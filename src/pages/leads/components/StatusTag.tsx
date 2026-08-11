import { memo } from "react";
import { LEAD_STATUS_META, type LeadStatus } from "@/constants";

interface StatusTagProps {
  status: LeadStatus;
}

export const StatusTag = memo((props: StatusTagProps) => {
  const { status } = props;
  const meta = LEAD_STATUS_META[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${meta.className}`}
    >
      {meta.label}
    </span>
  );
});
