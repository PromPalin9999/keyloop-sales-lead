import {
  FilterOutlined,
  SearchOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import {
  Checkbox,
  Dropdown,
  Input,
  Popover,
  Select,
  type MenuProps,
} from 'antd';
import { memo } from 'react';
import type { Lead, StaffMember } from '@/apis';
import { KlButton, KlText } from '@/components/base';
import {
  LEAD_STATUS_META,
  LEAD_STATUS_OPTIONS,
  type LeadStatus,
} from '@/constants';
import type { FilterParam, SortParam } from '@/types';

const SORT_OPTIONS: Array<SortParam<Lead> & { label: string }> = [
  { label: 'Received: Newest first', key: 'created_at', direction: 'desc' },
  { label: 'Received: Oldest first', key: 'created_at', direction: 'asc' },
  {
    label: 'Next follow-up: Soonest',
    key: 'next_follow_up_at',
    direction: 'asc',
  },
  { label: 'Customer name: A-Z', key: 'customer_name', direction: 'asc' },
  { label: 'Status', key: 'status', direction: 'asc' },
];

interface LeadsTableHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: FilterParam<Lead>[];
  addOrUpdateFilters: (next: FilterParam<Lead>) => void;
  removeFilter: (key: keyof Lead) => void;
  isAdmin: boolean;
  salespeople: StaffMember[];
  sorts: SortParam<Lead>[] | undefined;
  onSortChange: (value: SortParam<Lead>[]) => void;
}

export const LeadsTableHeader = memo((props: LeadsTableHeaderProps) => {
  const {
    search,
    onSearchChange,
    filters,
    addOrUpdateFilters,
    removeFilter,
    isAdmin,
    salespeople,
    sorts,
    onSortChange,
  } = props;

  const statusFilter =
    (filters.find((f) => f.key === 'status')?.value as LeadStatus[]) ?? [];
  const ownerFilter = filters.find((f) => f.key === 'assigned_to')?.value as
    string | undefined;

  const activeFilterCount = statusFilter.length + (ownerFilter ? 1 : 0);
  const activeSort = sorts?.[0];

  const sortMenuItems: MenuProps['items'] = SORT_OPTIONS.map((option) => ({
    key: `${option.key}:${option.direction}`,
    label: option.label,
    onClick: () =>
      onSortChange([{ key: option.key, direction: option.direction }]),
  }));

  const filterContent = (
    <div className='pb-1!'>
      <div>
        {isAdmin && (
          <>
            <KlText strong className='mb-2 block'>
              Owner
            </KlText>
            <Select
              allowClear
              className='mb-3! w-full'
              placeholder='All Sales'
              value={ownerFilter}
              onChange={(value) =>
                value
                  ? addOrUpdateFilters({
                      key: 'assigned_to',
                      operator: 'eq',
                      value,
                    })
                  : removeFilter('assigned_to')
              }
              options={salespeople.map((person) => ({
                label: person.full_name || person.id,
                value: person.id,
              }))}
            />
          </>
        )}
      </div>
      <div>
        <KlText strong className='block'>
          Status
        </KlText>
        <Checkbox.Group
          className='mb-3 flex flex-col gap-1'
          value={statusFilter}
          onChange={(values) =>
            addOrUpdateFilters({
              key: 'status',
              operator: 'in',
              value: values as LeadStatus[],
            })
          }
          options={LEAD_STATUS_OPTIONS.map((status) => ({
            label: LEAD_STATUS_META[status].label,
            value: status,
          }))}
        />
      </div>

      {activeFilterCount > 0 && (
        <KlButton
          type='primary'
          className='mt-5! w-full!'
          onClick={() => {
            removeFilter('status');
            removeFilter('assigned_to');
          }}
        >
          Clear filters
        </KlButton>
      )}
    </div>
  );

  return (
    <div className='mb-4 flex flex-col gap-3 md:flex-row md:items-center'>
      <Input
        allowClear
        size='large'
        className='md:max-w-md'
        placeholder='Search leads, vehicles, or contacts...'
        prefix={<SearchOutlined className='text-text-400' />}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className='flex gap-2 md:ml-auto'>
        <Popover
          content={filterContent}
          trigger='click'
          placement='bottomRight'
        >
          <KlButton size='large' icon={<FilterOutlined />}>
            Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </KlButton>
        </Popover>

        <Dropdown
          menu={{
            items: sortMenuItems,
            selectedKeys: activeSort
              ? [`${activeSort.key}:${activeSort.direction}`]
              : [],
          }}
          trigger={['click']}
        >
          <KlButton size='large' icon={<SortAscendingOutlined />}>
            Sort
          </KlButton>
        </Dropdown>
      </div>
    </div>
  );
});
