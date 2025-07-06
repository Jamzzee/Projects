'use client';
import { createContext, useContext } from 'react';
import { BookmarksContextType } from '@/types/BookmarksContextType';
import { Country } from '@/types/Country';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

const BookmarksContext = createContext<BookmarksContextType | null>(null);

function BookmarksProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useLocalStorageState<Country[]>(
    [],
    'bookmarkedCountries'
  );

  function toggleBookmark(country: Country) {
    setBookmarks(prev =>
      prev.some(b => b.cca3 === country.cca3)
        ? prev.filter(c => c.cca3 !== country.cca3)
        : [...prev, country]
    );
  }

  function clearBookmarks() {
    setBookmarks([]);
  }

  return (
    <BookmarksContext.Provider
      value={{ bookmarks, toggleBookmark, clearBookmarks }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

function useBookmarks() {
  const context = useContext(BookmarksContext);
  if (!context)
    throw new Error('useBookmarks used outside of the context provider');

  return context;
}

export { BookmarksProvider, useBookmarks };
