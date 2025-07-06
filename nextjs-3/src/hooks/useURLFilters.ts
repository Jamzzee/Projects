'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type URLFiltersParams = {
  regions: string[];
  populations: string[];
  searchQuery: string;
  setRegions: (val: string[]) => void;
  setPopulations: (val: string[]) => void;
  setSearchQuery: (val: string) => void;
};

export default function useURLFilters({
  regions,
  populations,
  searchQuery,
  setRegions,
  setPopulations,
  setSearchQuery,
}: URLFiltersParams) {
  const searchParams = useSearchParams();

  // Load state from URL for prevent lose filters during reloading or refreshing
  useEffect(() => {
    const region = searchParams.getAll('regions');
    const population = searchParams.getAll('populations');
    const search = searchParams.get('search');

    setRegions(region || []);
    setPopulations(population || []);
    setSearchQuery(search || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update and push state to URL
  useEffect(() => {
    // Avoid conflicts with dynamic page which require 'name'.
    const params = new URLSearchParams();

    regions.forEach(r => params.append('regions', r));
    populations.forEach(p => params.append('populations', p));
    if (searchQuery.trim()) params.set('search', searchQuery);

    const queryString = `${params.toString()}`;

    // Update the URL without re-renders page as in case of router.push()
    window.history.replaceState(null, '', `?${queryString}`);
  }, [regions, populations, searchQuery]);
}
