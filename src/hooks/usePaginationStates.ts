import { useState } from 'react';

export const usePaginationStates = (
  defaultPageNumber?: number,
  defaultPageSize?: number,
) => {
  const [pageNumber, setPageNumber] = useState<number>(defaultPageNumber || 1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize || 10);

  return { pageNumber, setPageNumber, pageSize, setPageSize };
};
