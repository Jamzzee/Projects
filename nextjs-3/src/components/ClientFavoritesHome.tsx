'use client';

import { useBookmarks } from '@/context/BookmarksContext';
import { CountryFilterProvider } from '@/context/CountryFilterContext';
import AppLayout from '@/ui/AppLayout';
import Countries from '@/ui/Countries';
import EmptyBookmarks from '@/ui/EmptyBookmarks';
import SearchAndSortBar from '@/ui/SearchAndSortBar';
import { useState } from 'react';

export default function ClientFavoritesHome() {
  const { bookmarks } = useBookmarks();
  const [sortBy, setSortBy] = useState('name');

  const isBookmarks = bookmarks.length > 0;

  return (
    <CountryFilterProvider countries={bookmarks} shouldFetch={false}>
      <AppLayout>
        <SearchAndSortBar sortBy={sortBy} setSortBy={setSortBy} />
        {!isBookmarks && <EmptyBookmarks />}
        {isBookmarks && <Countries sortBy={sortBy} isBookmarkPage={true} />}
      </AppLayout>
    </CountryFilterProvider>
  );
}
