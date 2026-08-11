import { Select } from "antd";
import { memo } from "react";
import { useUpdateLeadStatus } from "@/apis";
import { LEAD_STATUS_META, LEAD_STATUS_OPTIONS, type LeadStatus } from "@/constants";
import { notify } from "@/utils";

interface StatusSelectProps {
  leadId: string;
  status: LeadStatus;
  disabled?: boolean;
}

export const StatusSelect = memo((props: StatusSelectProps) => {
  const { leadId, status, disabled } = props;

  const { updateLeadStatus, isUpdatingLeadStatus } = useUpdateLeadStatus({
    config: {
      onSuccess: () => notify.success("Status updated"),
    },
  });

  return (
    <Select<LeadStatus>
      className="w-full"
      value={status}
      disabled={disabled}
      loading={isUpdatingLeadStatus}
      onChange={(value) => updateLeadStatus({ id: leadId, status: value })}
      options={LEAD_STATUS_OPTIONS.map((option) => ({
        label: LEAD_STATUS_META[option].label,
        value: option,
      }))}
    />
  );
});
