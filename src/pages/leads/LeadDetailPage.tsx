import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Flex, Result, Skeleton } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ActResultTimeline } from './components/ActResultTimeline';
import { AssignLeadModal } from './components/AssignLeadModal';
import { SalesAction } from './components/SalesAction';
import { StatusSelect } from './components/StatusSelect';
import { StatusTag } from './components/StatusTag';
import { useLead, useTimeLineLeadAct } from '@/apis';
import { PageBreadcrumb, PrefetchLink } from '@/components';
import { KlButton, KlCard, KlText, KlTitle } from '@/components/base';
import { Role, ROUTES } from '@/constants';
import { useAuthStore } from '@/store';
import { formatDateTime, formatShortDate } from '@/utils';

const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const isAdmin = useAuthStore((state) => state.profile?.role === Role.Admin);
  const [open, setOpen] = useState(false);

  const { lead, isGettingLead, isError } = useLead(id);
  const { activities, isGettingActivities } = useTimeLineLeadAct(id);

  if (isGettingLead) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (isError || !lead) {
    return (
      <Result
        status='404'
        title='Lead not found'
        subTitle="This lead doesn't exist, or you don't have access to it."
        extra={
          <PrefetchLink to={ROUTES.DASHBOARD}>
            <ArrowLeftOutlined /> Back to Lead Inbox
          </PrefetchLink>
        }
      />
    );
  }

  return (
    <>
      <PageBreadcrumb page={lead.customer_name} />

      <Flex justify='space-between' align='center' gap={20} className='mb-2!'>
        <Flex align='center' gap={20}>
          <KlTitle level={3} className='mb-1!'>
            {lead.customer_name}
          </KlTitle>

          <StatusTag status={lead.status} />
        </Flex>
        {isAdmin ? (
          <KlButton type='primary' onClick={() => setOpen(true)}>
            Assign Manager
          </KlButton>
        ) : (
          <StatusSelect leadId={lead.id} status={lead.status} />
        )}
      </Flex>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <div className='flex flex-col gap-6'>
          {lead.next_follow_up_at && lead.next_follow_up_note && (
            <div className='bg-primary-200! rounded-lg p-3!'>
              <KlText type='secondary' className='block! font-bold!'>
                Next Follow up details
              </KlText>
              <KlText type='secondary' className='block! text-xs!'>
                {formatDateTime(lead.next_follow_up_at)}
                {lead.next_follow_up_by_name
                  ? ` · set by ${lead.next_follow_up_by_name}`
                  : ''}
              </KlText>
              <KlText className='mt-1 block whitespace-pre-wrap'>
                {lead.next_follow_up_note}
              </KlText>
            </div>
          )}

          <KlCard
            title={
              <Flex vertical className='py-3!'>
                <KlTitle level={4} className='m-0! uppercase!'>
                  Contact Details
                </KlTitle>
                <KlText className='block! font-normal'>
                  Added {formatShortDate(lead.created_at)}
                </KlText>
              </Flex>
            }
          >
            <div className='flex flex-col gap-2'>
              <Flex vertical className=''>
                <KlText type='secondary' className='font-bold!'>
                  Email
                </KlText>
                <div className='flex items-center gap-2'>
                  <MailOutlined className='text-text-400' />
                  <KlText>{lead.email || '--'}</KlText>
                </div>
              </Flex>

              <Flex vertical className=''>
                <KlText type='secondary' className='font-bold!'>
                  Phone
                </KlText>
                <div className='flex items-center gap-2'>
                  <PhoneOutlined className='text-text-400' />
                  <KlText>{lead.phone || '--'}</KlText>
                </div>
              </Flex>

              <hr />

              <Flex vertical className=''>
                <KlText type='secondary' className='font-bold!'>
                  Vehicle Interest
                </KlText>
                <KlText className='block'>{lead.vehicle_interest}</KlText>
              </Flex>
              <Flex vertical className=''>
                <KlText type='secondary' className='font-bold!'>
                  Source
                </KlText>
                <KlText className='block'>{lead.source}</KlText>
              </Flex>
              <Flex vertical className=''>
                <KlText type='secondary' className='font-bold!'>
                  Assign To
                </KlText>
                <KlText className='block'>
                  {lead.assigned_to_name || 'Unassigned'}
                </KlText>
              </Flex>
            </div>
          </KlCard>

          {lead.message && (
            <KlCard>
              <KlText type='secondary' className='font-bold!'>
                Initial Inquiry Message
              </KlText>
              <div className='bg-primary-200! p-3! rounded-lg mt-1!'>
                <KlText className='block! whitespace-pre-wrap'>
                  "{lead.message}"
                </KlText>
              </div>
            </KlCard>
          )}
        </div>
        <div className='flex flex-col gap-6 md:col-span-2'>
          {!isAdmin && <SalesAction lead={lead} />}
          <KlCard title='Activity History'>
            <ActResultTimeline
              activities={activities}
              isLoading={isGettingActivities}
            />
          </KlCard>
        </div>
      </div>

      <AssignLeadModal
        open={open}
        onClose={() => setOpen(false)}
        leadId={lead.id}
        assignedTo={lead.assigned_to}
      />
    </>
  );
};

export default LeadDetailPage;
