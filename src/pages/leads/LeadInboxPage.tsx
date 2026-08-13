import { LeadsTable } from './components/LeadsTable';
import { PageBreadcrumb } from '@/components';
import { KlText, KlTitle } from '@/components/base';

const LeadInboxPage = () => {
  return (
    <>
      <PageBreadcrumb page='Lead Inbox' />

      <KlTitle level={3} className='mb-0!'>
        Lead Inbox
      </KlTitle>
      <KlText type='secondary' className='mb-6 block'>
        Manage and track in-flight prospects across the floor.
      </KlText>

      <LeadsTable />
    </>
  );
};

export default LeadInboxPage;
