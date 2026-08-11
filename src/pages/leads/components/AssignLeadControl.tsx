import { Select } from "antd";
import { memo } from "react";
import { useAssignLead, useSalespeople } from "@/apis";
import { notify } from "@/utils";

interface AssignLeadControlProps {
  leadId: string;
  assignedTo: string | null;
}

export const AssignLeadControl = memo((props: AssignLeadControlProps) => {
  const { leadId, assignedTo } = props;
  const { salespeople, isLoading: isLoadingSalespeople } = useSalespeople();

  const { assignLead, isAssigningLead } = useAssignLead({
    config: {
      onSuccess: () => notify.success("Lead assignment updated"),
    },
  });

  return (
    <Select
      allowClear
      className="w-full"
      placeholder="Unassigned"
      value={assignedTo ?? undefined}
      loading={isLoadingSalespeople || isAssigningLead}
      onChange={(value) =>
        assignLead({ id: leadId, assigned_to: value ?? null })
      }
      options={salespeople.map((person) => ({
        label: person.full_name || person.id,
        value: person.id,
      }))}
    />
  );
});
