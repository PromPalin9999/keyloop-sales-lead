// prettier-ignore
import { Table, type TableProps, type TableColumnsType, type TablePaginationConfig } from "antd";
// prettier-ignore
import type { FilterValue, SorterResult, TableCurrentDataSource } from "antd/es/table/interface";
import { memo, useCallback, type JSX } from 'react';
import type { SortParam } from '@/types';

type KlTableProps<T extends object> = Omit<TableProps<T>, 'columns'> & {
  columns?: TableColumnsType<T>;
  onSortChange?: (sort: Array<SortParam<T>> | undefined) => void;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>,
  ) => void;
};

function KlTableInner<T extends object>(props: KlTableProps<T>) {
  const { scroll, onSortChange, onChange } = props;

  const handleChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<T> | SorterResult<T>[],
      extra: TableCurrentDataSource<T>,
    ) => {
      let newSort: Array<SortParam<T>> | undefined;

      if (Array.isArray(sorter)) {
        newSort = sorter
          .filter((s) => s.order && s.field)
          .map((s) => ({
            key: s.field as keyof T,
            direction: s.order === 'ascend' ? 'asc' : 'desc',
          }));
      } else if (sorter.order && sorter.field) {
        newSort = [
          {
            key: sorter.field as keyof T,
            direction: sorter.order === 'ascend' ? 'asc' : 'desc',
          },
        ];
      }

      onSortChange?.(newSort?.length ? newSort : undefined);
      onChange?.(pagination, filters, sorter, extra);
    },
    [onSortChange, onChange],
  );

  return (
    <Table<T> onChange={handleChange} scroll={{ ...scroll, x: 0 }} {...props} />
  );
}

// Preserve generic signature through memo
export const KlTable = memo(KlTableInner) as <T extends object>(
  props: KlTableProps<T>,
) => JSX.Element;
