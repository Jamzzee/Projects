import { getRandomCountry } from '@/api/fetchData';
import ClientRandomCountryHome from '@/components/ClientRandomCountryHome';

export default async function RandomCountryPage() {
  const country = await getRandomCountry();

  return <ClientRandomCountryHome country={country} />;
}
