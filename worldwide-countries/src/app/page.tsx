import { getCountries } from '@/api/fetchData';
import ClientHome from '@/components/ClientHome';
import { Country } from '@/types/Country';

export default async function Home() {
  const countries: Country[] = await getCountries();
  return <ClientHome countries={countries} />;
}
