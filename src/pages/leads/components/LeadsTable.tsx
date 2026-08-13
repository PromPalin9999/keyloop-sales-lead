import { Empty, Skeleton } from 'antd';
import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeadsPagination } from './LeadsPagination';
import { LeadsTableHeader } from './LeadsTableHeader';
import { useLeadLstColumns } from './useLeadLstColumns';
import { useLeads, useSalespeople, type Lead } from '@/apis';
import { KlCard, KlTable } from '@/components/base';
import { Role, buildLeadDetailRoute } from '@/constants';
import {
  useDebouncedValue,
  usePaginationStates,
  useQueryParams,
} from '@/hooks';
import { useAuthStore } from '@/store';

export const LeadsTable = () => {
  const isAdmin = useAuthStore((state) => state.profile?.role === Role.Admin);
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const { pageNumber, setPageNumber, pageSize } = usePaginationStates(1, 7);
  const { filters, addOrUpdateFilters, removeFilter, sorts, setSorts } =
    useQueryParams<Lead>();

  useEffect(() => {
    setPageNumber(1);
  }, [debouncedSearch, filters, sorts, setPageNumber]);

  const { leads, isGettingLeads } = useLeads({
    search: debouncedSearch || undefined,
    filters,
    sorts,
    page: pageNumber,
    pageSize,
  });

  const { salespeople, staffById } = useSalespeople();
  const { columns } = useLeadLstColumns({ staffById });

  let tableContent: ReactNode;
  if (isGettingLeads) {
    tableContent = (
      <div className='p-6'>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  } else if (!leads || leads.items.length === 0) {
    tableContent = (
      <div className='p-12'>
        <Empty description='No leads found' />
      </div>
    );
  } else {
    tableContent = (
      <KlTable
        dataSource={leads.items}
        columns={columns}
        rowKey='id'
        pagination={false}
        scroll={{ x: 1000 }}
        onRow={(lead) => ({
          className: 'cursor-pointer',
          onClick: () => navigate(buildLeadDetailRoute(lead.id)),
        })}
      />
    );
  }

  return (
    <>
      <LeadsTableHeader
        search={searchInput}
        onSearchChange={setSearchInput}
        filters={filters}
        addOrUpdateFilters={addOrUpdateFilters}
        removeFilter={removeFilter}
        isAdmin={isAdmin}
        salespeople={salespeople}
        sorts={sorts}
        onSortChange={setSorts}
      />

      <KlCard styles={{ body: { padding: 0 } }}>
        {tableContent}
        <LeadsPagination
          page={pageNumber}
          pageSize={pageSize}
          total={leads?.total ?? 0}
          onPageChange={setPageNumber}
        />
      </KlCard>
    </>
  );
};
