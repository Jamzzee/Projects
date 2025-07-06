'use client';
import { Country } from '@/types/Country';
import { useEffect, useState } from 'react';

type FetchByRegionParams = {
  regions: string[];
  initCountries: Country[];
  shouldFetch?: boolean;
  setRegionFilteredCountries: (val: Country[]) => void;
};

export default function useFetchByRegion({
  regions,
  initCountries,
  shouldFetch = true,
  setRegionFilteredCountries,
}: FetchByRegionParams) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!shouldFetch) return;

    if (!regions.length) {
      setRegionFilteredCountries(initCountries);
      return;
    }

    async function fetchByRegion() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        regions.forEach(r => params.append('regions', r));
        const res = await fetch(`/api/region?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch countries');
        const data: Country[] = await res.json();

        setRegionFilteredCountries(data);
      } catch (e) {
        console.error(e);
        setRegionFilteredCountries([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchByRegion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regions, initCountries]);
  return { isLoading };
}
