'use client';

import { CountryFilterProvider } from '@/context/CountryFilterContext';
import { Country } from '@/types/Country';
import AppLayout from '@/ui/AppLayout';
import Countries from '@/ui/Countries';
import SearchAndSortBar from '@/ui/SearchAndSortBar';
import { useState } from 'react';

type HomeProps = {
  countries: Country[];
};

export default function ClientHome({ countries }: HomeProps) {
  const [sortBy, setSortBy] = useState<string>('name');

  return (
    <CountryFilterProvider countries={countries}>
      <AppLayout>
        <SearchAndSortBar sortBy={sortBy} setSortBy={setSortBy} />
        <Countries sortBy={sortBy} />
      </AppLayout>
    </CountryFilterProvider>
  );
}
