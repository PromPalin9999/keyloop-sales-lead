import {
  CalendarOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Empty, Skeleton } from "antd";
import { memo } from "react";
import type { Activity, StaffMember } from "@/apis";
import { KlText } from "@/components/base";
import { ACTIVITY_TYPE_LABELS } from "@/constants";
import { formatDateTime } from "@/utils";

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  CALL: <PhoneOutlined />,
  EMAIL: <MailOutlined />,
  SMS: <MessageOutlined />,
  NOTE: <MessageOutlined />,
  LEAD_RECEIVED: <CalendarOutlined />,
};

interface ActivityTimelineProps {
  activities: Activity[] | undefined;
  staffById: Map<string, StaffMember>;
  isLoading: boolean;
}

export const ActivityTimeline = memo((props: ActivityTimelineProps) => {
  const { activities, staffById, isLoading } = props;

  if (isLoading) return <Skeleton active paragraph={{ rows: 4 }} />;
  if (!activities?.length) return <Empty description="No activity yet" />;

  return (
    <div className="flex flex-col">
      {activities.map((activity, index) => {
        const createdByName = activity.created_by
          ? staffById.get(activity.created_by)?.full_name || "--"
          : "System";

        return (
          <div
            key={activity.id}
            className={`flex gap-3 py-4 ${
              index !== activities.length - 1 ? "border-b border-text-200/10" : ""
            }`}
          >
            <div className="mt-1 text-lg text-text-400">
              {ACTIVITY_ICONS[activity.type]}
            </div>
            <div className="min-w-0 flex-1">
              <KlText type="secondary" className="!text-xs">
                {formatDateTime(activity.occurred_at)} · {createdByName}
              </KlText>
              <KlText strong className="mt-0.5 block">
                {ACTIVITY_TYPE_LABELS[activity.type]}
              </KlText>
              {activity.note && (
                <KlText className="mt-1 block whitespace-pre-wrap">
                  {activity.note}
                </KlText>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
