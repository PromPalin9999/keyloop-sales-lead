import { CheckOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Empty, Input, Pagination, Skeleton } from 'antd';
import { memo, useEffect, useMemo, useState } from 'react';
import { useSalespeople } from '@/apis';
import { KlButton, KlModal, KlText } from '@/components/base';

const PAGE_SIZE = 5;

interface SelectAssigneeModalProps {
  open: boolean;
  onClose: () => void;
  value: string | null;
  onSelect: (id: string | null) => void;
}

export const SelectAssigneeModal = memo((props: SelectAssigneeModalProps) => {
  const { open, onClose, value, onSelect } = props;
  const { salespeople, isLoading: isLoadingSalespeople } = useSalespeople();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(value);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!open) return;
    setSelected(value);
    setSearch('');
    setPage(1);
  }, [open, value]);

  const filteredSalespeople = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return salespeople;
    return salespeople.filter((person) =>
      (person.full_name ?? '').toLowerCase().includes(term),
    );
  }, [salespeople, search]);

  const pagedSalespeople = useMemo(
    () => filteredSalespeople.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredSalespeople, page],
  );

  const hasChange = selected !== value;

  return (
    <KlModal
      title='Assign To'
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      mask={{ closable: false }}
      keyboard={false}
    >
      <KlText type='secondary' className='block!'>
        Select a sales representative to assign this lead to.
      </KlText>

      <Input
        className='mt-4 mb-2'
        placeholder='Search sales...'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        allowClear
      />

      <div className='flex flex-col gap-1'>
        {isLoadingSalespeople && <Skeleton active paragraph={{ rows: 3 }} />}

        {!isLoadingSalespeople && filteredSalespeople.length === 0 && (
          <Empty description='No salespeople found' />
        )}

        {pagedSalespeople.map((person) => {
          const isSelected = selected === person.id;

          return (
            <button
              key={person.id}
              type='button'
              onClick={() => setSelected(isSelected ? null : person.id)}
              className={`flex items-center gap-3 rounded-lg p-2 text-left transition-colors ${
                isSelected ? 'bg-primary-300!' : 'hover:bg-text-100/50'
              }`}
            >
              <Avatar icon={<UserOutlined />} />
              <KlText strong className='min-w-0 flex-1 truncate!'>
                {person.full_name || '--'}
              </KlText>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  isSelected
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-text-300'
                }`}
              >
                {isSelected && <CheckOutlined className='text-xs!' />}
              </span>
            </button>
          );
        })}
      </div>

      {filteredSalespeople.length > PAGE_SIZE && (
        <div className='mt-2 flex justify-center'>
          <Pagination
            simple
            size='small'
            current={page}
            pageSize={PAGE_SIZE}
            total={filteredSalespeople.length}
            onChange={setPage}
          />
        </div>
      )}

      <div className='mt-4 flex justify-end gap-2'>
        <KlButton onClick={onClose}>Cancel</KlButton>
        <KlButton
          type='primary'
          disabled={!hasChange}
          onClick={() => {
            onSelect(selected);
            onClose();
          }}
        >
          Select
        </KlButton>
      </div>
    </KlModal>
  );
});
