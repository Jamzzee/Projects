'use client';
import { useBookmarks } from '@/context/BookmarksContext';
import { useCountryFilter } from '@/context/CountryFilterContext';
import { ITEMS_PER_PAGE } from '@/helper/constants';
import usePagination from '@/hooks/usePagination';
import useSortedCountries from '@/hooks/useSortedCountries';
import { CountriesProps } from '@/types/CountriesType';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';
import Button from './Buttons';
import ConfirmModalWindow from './ConfirmModalWindow';
import CountryItem from './CountryItem';
import Pagination from './Pagination';
import { Spinner } from './Spinner';
import Message from './Message';

const StyledGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
`;

const ActionModule = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
`;

export default function Countries({
  sortBy = 'name',
  countries,
  isBookmarkPage = false,
}: CountriesProps) {
  const { filteredCountries, isLoading } = useCountryFilter();
  const source = countries || filteredCountries;
  const sortedCountries = useSortedCountries(source, sortBy);

  const {
    totalItems: renderedCountries,
    curPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  } = usePagination(sortedCountries, ITEMS_PER_PAGE, [source, sortBy]);
  const { bookmarks, clearBookmarks } = useBookmarks();
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  const handleClearClick = () => setShowModal(true);
  const handleConfirm = () => {
    clearBookmarks();
    setShowModal(false);
    router.push('/');
  };
  const handleCancelClear = () => setShowModal(false);

  const isBookmarks = bookmarks.length > 0;

  return (
    <>
      {isBookmarkPage && (
        <ActionModule>
          <Link href="/">
            <Button variant="neutral">&larr; back</Button>
          </Link>
          {isBookmarks && (
            <Button variant="danger" onClick={handleClearClick}>
              Delete All
            </Button>
          )}
        </ActionModule>
      )}
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          <StyledGrid>
            {renderedCountries.map(country => (
              <CountryItem key={country.cca3} country={country} />
            ))}
          </StyledGrid>

          {renderedCountries.length ? (
            <Pagination
              curPage={curPage}
              totalPages={totalPages}
              onChangePage={goToPage}
              onNext={nextPage}
              onPrev={prevPage}
            />
          ) : (
            <Message message="Country not found." />
          )}
        </>
      )}

      {showModal && (
        <ConfirmModalWindow
          message="Are you sure you want to clear all bookmarks ?"
          onConfirm={handleConfirm}
          onCancel={handleCancelClear}
        />
      )}
    </>
  );
}
