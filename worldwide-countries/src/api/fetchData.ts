import { GET_ALL_COUNTRIES_URL, GET_COUNTRY_URL } from '@/helper/constants';
import { Country } from '@/types/Country';

export async function getCountries(): Promise<Country[]> {
  const res = await fetch(
    `${GET_ALL_COUNTRIES_URL}?fields=name,region,population,flags,cca3`
  );

  if (!res.ok) throw new Error('Failed to fetch countries.');
  return await res.json();
}

export async function getCountry(name: string): Promise<Country | null> {
  const res = await fetch(
    `${GET_COUNTRY_URL}/name/${encodeURIComponent(name)}?fullText=true`
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data?.[0] || null;
}

export async function getRandomCountry(): Promise<Country | null> {
  const res = await fetch(
    `${GET_ALL_COUNTRIES_URL}?fields=name,region,population,flags,cca3`,
    { cache: 'no-store' }
  );

  if (!res.ok) throw new Error('Failed to fetch countries.');
  const countries = await res.json();
  const randomCountry = Math.floor(Math.random() * countries.length);

  return countries[randomCountry] || null;
}
