import {
  CalendarOutlined,
  CarOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, type TableColumnsType } from 'antd';
import { useMemo, type ReactNode } from 'react';
import { StatusTag } from './StatusTag';
import type { LeadListItem, StaffMember } from '@/apis';
import { KlText } from '@/components/base';
import { ACTIVITY_TYPE_LABELS, type ActivityType } from '@/constants';
import {
  formatReceivedAt,
  formatRelativeTime,
  formatShortDate,
  isOverdue,
} from '@/utils';

const ACTIVITY_ICONS: Record<ActivityType, ReactNode> = {
  CALL: <PhoneOutlined />,
  EMAIL: <MailOutlined />,
  SMS: <MessageOutlined />,
  LEAD_RECEIVED: <CalendarOutlined />,
};

interface UseLeadLstColumnsProps {
  staffById: Map<string, StaffMember>;
}

export const useLeadLstColumns = (props: UseLeadLstColumnsProps) => {
  const { staffById } = props;

  const columns: TableColumnsType<LeadListItem> = useMemo(
    () => [
      {
        key: 'customer',
        title: 'Customer',
        render: (_, lead) => (
          <div>
            <KlText strong className='block'>
              {lead.customer_name}
            </KlText>
            <KlText type='secondary' className='block !text-xs'>
              {lead.email || lead.phone || '--'}
            </KlText>
          </div>
        ),
      },
      {
        key: 'vehicle_interest',
        dataIndex: 'vehicle_interest',
        title: 'Vehicle Interest',
        className: 'whitespace-nowrap text-center!',
        render: (_, lead) => (
          <span className='inline-flex items-center gap-2'>
            <CarOutlined className='text-text-400' />
            <KlText>{lead.vehicle_interest}</KlText>
          </span>
        ),
      },
      {
        key: 'status',
        dataIndex: 'status',
        title: 'Status',
        className: 'whitespace-nowrap text-center!',
        render: (_, lead) => <StatusTag status={lead.status} />,
      },
      {
        key: 'owner',
        title: 'Owner',
        className: 'whitespace-nowrap text-center!',

        render: (_, lead) => {
          const owner = lead.assigned_to
            ? staffById.get(lead.assigned_to)
            : null;

          return owner ? (
            <span className='inline-flex items-center gap-2'>
              <Avatar size='small' icon={<UserOutlined />} />
              <KlText>{owner.full_name || '--'}</KlText>
            </span>
          ) : (
            <KlText type='secondary'>Unassigned</KlText>
          );
        },
      },
      {
        key: 'last_activity',
        title: 'Last Activity',
        className: 'whitespace-nowrap text-center!',
        render: (_, lead) => {
          const lastActivity = lead.activities?.[0];
          if (!lastActivity) return <KlText type='secondary'>--</KlText>;

          return (
            <span className='inline-flex items-center gap-2'>
              {ACTIVITY_ICONS[lastActivity.type]}
              <div>
                <KlText className='block !text-xs'>
                  {ACTIVITY_TYPE_LABELS[lastActivity.type]}
                </KlText>
                <KlText type='secondary' className='block !text-xs'>
                  {formatRelativeTime(lastActivity.occurred_at)}
                </KlText>
              </div>
            </span>
          );
        },
      },
      {
        key: 'next_follow_up_at',
        dataIndex: 'next_follow_up_at',
        title: 'Next Follow-up',
        className: 'whitespace-nowrap text-center!',

        render: (_, lead) => {
          if (!lead.next_follow_up_at) {
            return <KlText type='secondary'>--</KlText>;
          }

          const overdue = isOverdue(lead.next_follow_up_at);
          return (
            <div>
              <KlText className={overdue ? 'text-error! block' : 'block'}>
                {formatShortDate(lead.next_follow_up_at)}
                {overdue ? ' (Overdue)' : ''}
              </KlText>
              {lead.next_follow_up_by_name && (
                <KlText type='secondary' className='block text-xs!'>
                  by {lead.next_follow_up_by_name}
                </KlText>
              )}
            </div>
          );
        },
      },
      {
        key: 'created_at',
        dataIndex: 'created_at',
        title: 'Received',
        className: 'whitespace-nowrap text-center!',

        render: (_, lead) => (
          <KlText>{formatReceivedAt(lead.created_at)}</KlText>
        ),
      },
    ],
    [staffById],
  );

  return { columns };
};
