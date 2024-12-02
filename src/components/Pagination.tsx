import {
  Pagination as BasePagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  usePagination,
} from "@ajna/pagination";

export default function Pagination({
  total,
  pageSize,
  currentPage,
  setCurrentPage,
}: {
  total: number;
  pageSize: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { pagesCount, pages } = usePagination({
    total: total,
    initialState: {
      currentPage: currentPage,
      pageSize: pageSize,
    },
  });

  return (
    <BasePagination
      pagesCount={pagesCount}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    >
      <PaginationContainer>
        <PaginationPrevious>Previous</PaginationPrevious>
        <PaginationPageGroup>
          {pages.map((page: number) => (
            <PaginationPage key={`pagination_page_${page}`} page={page} />
          ))}
        </PaginationPageGroup>
        <PaginationNext>Next</PaginationNext>
      </PaginationContainer>
    </BasePagination>
  );
}
