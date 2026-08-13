import { CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { memo } from 'react';
import { ActResultForm } from './ActResultForm';
import { NextFollowUpEditor } from './NextFollowUpEditor';
import type { Lead } from '@/apis';
import { KlCard } from '@/components/base';

interface SalesActionProps {
  lead: Lead;
}

export const SalesAction = memo((props: SalesActionProps) => {
  const { lead } = props;

  const items = [
    {
      key: 'result-activity',
      label: (
        <>
          <EditOutlined /> Activity Result
        </>
      ),
      children: <ActResultForm leadId={lead.id} />,
    },
    {
      key: 'next-follow-up',
      label: (
        <>
          <CalendarOutlined /> Next Follow-up
        </>
      ),
      children: <NextFollowUpEditor leadId={lead.id} />,
    },
  ];

  return (
    <KlCard>
      <Tabs items={items} />
    </KlCard>
  );
});
