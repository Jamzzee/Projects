import { getCountries, getCountry } from '@/api/fetchData';
import ClientDynamicCountryHome from '@/components/ClientDynamicCountryHome';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type CountryPageProps = {
  params: Promise<{ name: string }>;
};

export async function generateMetadata({
  params,
}: CountryPageProps): Promise<Metadata> {
  const { name: countryName } = await params;
  const decodedName = decodeURIComponent(countryName.toLowerCase());
  const country = await getCountry(decodedName);

  return {
    title: `${country?.name.common} - Country Info`,
    description: `Details about ${country?.name.common}`,
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { name: countryName } = await params;
  if (!countryName) notFound();

  const decodedName = decodeURIComponent(countryName.toLowerCase());
  const country = await getCountry(decodedName);
  if (!country) notFound();

  const allCountries = await getCountries();

  return (
    <ClientDynamicCountryHome country={country} allCountries={allCountries} />
  );
}

export async function generateStaticParams() {
  const countries = await getCountries();

  return countries.map(c => ({
    name: c.name.common.toLowerCase(),
  }));
}
