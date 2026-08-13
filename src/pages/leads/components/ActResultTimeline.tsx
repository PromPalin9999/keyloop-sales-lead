import {
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Empty, Skeleton } from 'antd';
import { memo } from 'react';
import type { Activity } from '@/apis';
import { KlText } from '@/components/base';
import { ACTIVITY_TYPE_LABELS } from '@/constants';
import { formatDateTime } from '@/utils';

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  CALL: <PhoneOutlined />,
  EMAIL: <MailOutlined />,
  SMS: <MessageOutlined />,
  LEAD_RECEIVED: <UserAddOutlined />,
};

interface ActivityTimelineProps {
  activities: Activity[] | undefined;
  isLoading: boolean;
}

export const ActResultTimeline = memo((props: ActivityTimelineProps) => {
  const { activities, isLoading } = props;

  if (isLoading) return <Skeleton active paragraph={{ rows: 4 }} />;
  if (!activities?.length) return <Empty description='No activity yet' />;

  return (
    <div className='flex flex-col'>
      {activities.map((activity, index) => {
        const isLast = index === activities.length - 1;
        const actorName =
          activity.created_by_name || (activity.created_by ? '--' : 'Website');

        return (
          <div key={activity.id} className='flex gap-4'>
            <div className='flex flex-col items-center'>
              <div className='ring-primary-50 bg-primary-100 text-primary-600 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ring-4'>
                {ACTIVITY_ICONS[activity.type]}
              </div>
              {!isLast && (
                <div className='from-primary-200 my-1 w-px flex-1 bg-linear-to-b to-transparent' />
              )}
            </div>

            <div className={`min-w-0 flex-1 ${isLast ? '' : 'pb-6'}`}>
              <div className='flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1'>
                <KlText className='block!'>
                  <span className='font-semibold'>
                    {ACTIVITY_TYPE_LABELS[activity.type]}
                  </span>
                  <span className='text-text-400'> by </span>
                  <span className='text-primary-600! font-semibold'>
                    {actorName}
                  </span>
                </KlText>
                <KlText
                  type='secondary'
                  className='font-mono! whitespace-nowrap text-xs!'
                >
                  {formatDateTime(activity.occurred_at)}
                </KlText>
              </div>

              {activity.note && (
                <div className='border-text-200/20 bg-primary-200 mt-2 rounded-xl border px-3 py-2.5'>
                  <KlText className='block! text-sm! whitespace-pre-wrap'>
                    {activity.note}
                  </KlText>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});
