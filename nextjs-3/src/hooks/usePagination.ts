'use client';
import { ITEMS_PER_PAGE } from '@/helper/constants';
import { useEffect, useState } from 'react';

export default function usePagination<T>(
  items: T[],
  itemsPerPage = ITEMS_PER_PAGE,
  dependency: unknown[] = []
) {
  const [curPage, setCurPage] = useState<number>(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const start = (curPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const totalItems = items.slice(start, end);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurPage(page);
    }
  };

  const nextPage = () => goToPage(curPage + 1);
  const prevPage = () => goToPage(curPage - 1);
  const resetPage = () => setCurPage(1);

  useEffect(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependency]);

  return {
    curPage,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
  };
}
