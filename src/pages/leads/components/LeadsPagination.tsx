import { memo } from "react";
import { KlButton, KlText } from "@/components/base";

interface LeadsPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const LeadsPagination = memo((props: LeadsPaginationProps) => {
  const { page, pageSize, total, onPageChange } = props;

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const hasPrevious = page > 1;
  const hasNext = to < total;

  return (
    <div className="flex items-center justify-between border-t border-text-200/10 px-4 py-3">
      <KlText type="secondary" className="!text-sm">
        {total === 0
          ? "No leads"
          : `Showing ${from}-${to} of ${total} leads`}
      </KlText>

      <div className="flex gap-2">
        <KlButton disabled={!hasPrevious} onClick={() => onPageChange(page - 1)}>
          Previous
        </KlButton>
        <KlButton disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
          Next
        </KlButton>
      </div>
    </div>
  );
});
