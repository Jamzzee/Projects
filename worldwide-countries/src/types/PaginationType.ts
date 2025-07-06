export interface PaginationProps {
  curPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onPrev: () => void;
  onNext: () => void;
}
