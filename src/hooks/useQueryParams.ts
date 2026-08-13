import { useCallback, useState } from 'react';
import type { FilterParam, SortParam } from '@/types';

export const useQueryParams = <T>() => {
  const [filters, setFilters] = useState<Array<FilterParam<T>>>([]);
  const [sorts, setSorts] = useState<Array<SortParam<T>>>();

  const addOrUpdateFilters = useCallback(
    (next: FilterParam<T>, allowNull: boolean = false) => {
      setFilters((prev) => {
        const isEmpty =
          (!allowNull && next.value === null) ||
          (typeof next.value === 'string' && next.value.trim() === '') ||
          (Array.isArray(next.value) && next.value.length === 0);

        const match = (p: FilterParam<T>) =>
          p.key === next.key && p.operator === next.operator;

        if (isEmpty) {
          return prev.filter((p) => !match(p));
        }

        const index = prev.findIndex(match);
        if (index === -1) {
          return [...prev, next];
        }

        const copy = prev.slice();
        copy[index] = { ...copy[index], ...next };
        return copy;
      });
    },
    [],
  );

  const removeFilter = useCallback(
    (key: keyof T) =>
      setFilters((prev) => prev.filter((filter) => filter.key !== key)),
    [],
  );

  return { filters, sorts, addOrUpdateFilters, removeFilter, setSorts };
};
