'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isPopulationMatch } from '@/helper/helpers';
import useFetchByRegion from '@/hooks/useFetchByRegion';
import useURLFilters from '@/hooks/useURLFilters';
import { Country } from '@/types/Country';
import { CountryFilterContextType } from '@/types/CountryFilterContextType';

const CountryFilterContext = createContext<CountryFilterContextType | null>(
  null
);

function CountryFilterProvider({
  children,
  countries: initCountries,
  shouldFetch = true,
}: {
  children: React.ReactNode;
  countries: Country[];
  shouldFetch?: boolean;
}) {
  const allCountries = initCountries;
  const [regionFilteredCountries, setRegionFilteredCountries] =
    useState<Country[]>(initCountries);
  const [regions, setRegions] = useState<string[]>([]);
  const [populations, setPopulations] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Use, push and update URL params for: region, population, searchQuery.
  useURLFilters({
    regions,
    populations,
    searchQuery,
    setRegions,
    setPopulations,
    setSearchQuery,
  });

  // Dynamic fetch from API route
  const { isLoading } = useFetchByRegion({
    regions,
    initCountries,
    setRegionFilteredCountries,
    shouldFetch,
  });

  useEffect(() => {
    if (!shouldFetch) {
      const filtered = regions?.length
        ? initCountries.filter(c => regions.includes(c.region))
        : initCountries;
      setRegionFilteredCountries(filtered);
    }
  }, [shouldFetch, regions, initCountries]);

  const filteredCountries = useMemo(() => {
    return regionFilteredCountries.filter(c => {
      const matchPopulation =
        populations.length === 0 ||
        populations.some(p => isPopulationMatch(p, c.population));

      const matchSearch = c.name.common
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchPopulation && matchSearch;
    });
  }, [populations, searchQuery, regionFilteredCountries]);

  const clearFilters = () => {
    setRegions([]);
    setPopulations([]);
    setSearchQuery('');
  };

  return (
    <CountryFilterContext.Provider
      value={{
        allCountries,
        countries: regionFilteredCountries,
        filteredCountries,
        regions,
        populations,
        searchQuery,
        isLoading,
        setSearchQuery,
        setRegions,
        setPopulations,
        clearFilters,
      }}
    >
      {children}
    </CountryFilterContext.Provider>
  );
}

function useCountryFilter() {
  const context = useContext(CountryFilterContext);
  if (!context)
    throw new Error('useCountryFilter used outside of the context provider');

  return context;
}

export { CountryFilterProvider, useCountryFilter };
