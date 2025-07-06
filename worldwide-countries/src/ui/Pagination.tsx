'use client';
import { PaginationProps } from '@/types/PaginationType';
import styled from 'styled-components';

const PaginationWrapper = styled.section`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block: 2.5rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.6rem 1.2rem;
  border-radius: var(--border-radius-sm);
  border: none;
  cursor: pointer;
  background-color: ${({ $active }) =>
    $active ? 'var(--color-brand-500)' : 'var(--color-grey-200)'};
  color: ${({ $active }) =>
    $active ? 'var(--color-grey-0)' : 'var(--color-grey-800)'};
  font-weight: 800;

  &:hover {
    background-color: var(--color-brand-600);
    color: var(color-grey-50);
  }

  &:disabled {
    cursor: now-allowed;
    background-color: var(--color-grey-100);
    color: var(--color-grey-500);
  }
`;

export default function Pagination({
  curPage,
  totalPages,
  onChangePage,
  onPrev,
  onNext,
}: PaginationProps) {
  return (
    <PaginationWrapper>
      <PageButton
        style={{ marginRight: '1rem' }}
        onClick={onPrev}
        disabled={curPage === 1}
      >
        Prev
      </PageButton>
      {Array.from({ length: totalPages }, (_, i) => (
        <PageButton
          key={i + 1}
          $active={i + 1 === curPage}
          onClick={() => onChangePage(i + 1)}
        >
          {i + 1}
        </PageButton>
      ))}
      <PageButton
        style={{ marginLeft: '1rem' }}
        onClick={onNext}
        disabled={curPage === totalPages}
      >
        Next
      </PageButton>
    </PaginationWrapper>
  );
}
