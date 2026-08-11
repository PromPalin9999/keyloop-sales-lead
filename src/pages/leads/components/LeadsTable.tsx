import {
  CalendarOutlined,
  CarOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Empty, Skeleton } from "antd";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { LeadListItem, StaffMember } from "@/apis";
import { KlText } from "@/components/base";
import { ACTIVITY_TYPE_LABELS, buildLeadDetailRoute } from "@/constants";
import {
  formatReceivedAt,
  formatRelativeTime,
  formatShortDate,
  isOverdue,
} from "@/utils";
import { StatusTag } from "./StatusTag";

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  CALL: <PhoneOutlined />,
  EMAIL: <MailOutlined />,
  SMS: <MessageOutlined />,
  NOTE: <MessageOutlined />,
  LEAD_RECEIVED: <CalendarOutlined />,
};

interface LeadsTableProps {
  leads: LeadListItem[];
  staffById: Map<string, StaffMember>;
  isLoading: boolean;
}

export const LeadsTable = memo((props: LeadsTableProps) => {
  const { leads, staffById, isLoading } = props;
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="p-12">
        <Empty description="No leads found" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="border-b border-text-200/20">
            {["Customer", "Vehicle Interest", "Status", "Owner", "Last Activity", "Next Follow-up", "Received"].map(
              (heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-xs font-medium tracking-wide text-text-500 whitespace-nowrap uppercase"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const owner = lead.assigned_to ? staffById.get(lead.assigned_to) : null;
            const lastActivity = lead.activities?.[0];
            const followUpOverdue =
              !!lead.next_follow_up_at && isOverdue(lead.next_follow_up_at);

            return (
              <tr
                key={lead.id}
                className="cursor-pointer border-b border-text-200/10 last:border-none hover:bg-background-50 dark:hover:bg-background-100/5"
                onClick={() => navigate(buildLeadDetailRoute(lead.id))}
              >
                <td className="px-4 py-3">
                  <KlText strong className="block">
                    {lead.customer_name}
                  </KlText>
                  <KlText type="secondary" className="block !text-xs">
                    {lead.email || lead.phone || "--"}
                  </KlText>
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-2">
                    <CarOutlined className="text-text-400" />
                    <KlText>{lead.vehicle_interest}</KlText>
                  </span>
                </td>

                <td className="px-4 py-3">
                  <StatusTag status={lead.status} />
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {owner ? (
                    <span className="inline-flex items-center gap-2">
                      <Avatar size="small" icon={<UserOutlined />} />
                      <KlText>{owner.full_name || "--"}</KlText>
                    </span>
                  ) : (
                    <KlText type="secondary">Unassigned</KlText>
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {lastActivity ? (
                    <span className="inline-flex items-center gap-2">
                      {ACTIVITY_ICONS[lastActivity.type]}
                      <div>
                        <KlText className="block !text-xs">
                          {ACTIVITY_TYPE_LABELS[lastActivity.type]}
                        </KlText>
                        <KlText type="secondary" className="block !text-xs">
                          {formatRelativeTime(lastActivity.occurred_at)}
                        </KlText>
                      </div>
                    </span>
                  ) : (
                    <KlText type="secondary">--</KlText>
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {lead.next_follow_up_at ? (
                    <KlText className={followUpOverdue ? "!text-error" : undefined}>
                      {formatShortDate(lead.next_follow_up_at)}
                      {followUpOverdue ? " (Overdue)" : ""}
                    </KlText>
                  ) : (
                    <KlText type="secondary">--</KlText>
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <KlText>{formatReceivedAt(lead.created_at)}</KlText>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
