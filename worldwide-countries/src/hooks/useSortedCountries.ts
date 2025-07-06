'use client';
import { Country } from '@/types/Country';
import { useMemo } from 'react';

export default function useSortedCountries(
  countries: Country[],
  sortBy: string
) {
  return useMemo(() => {
    if (sortBy === 'name') {
      return countries.toSorted((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
    }
    if (sortBy === 'population') {
      return countries.toSorted((a, b) => a.population - b.population);
    }

    return countries;
  }, [countries, sortBy]);
}
