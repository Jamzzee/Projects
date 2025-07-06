'use client';

import { CountryFilterProvider } from '@/context/CountryFilterContext';
import { Country } from '@/types/Country';
import AppLayout from '@/ui/AppLayout';
import CountryDetails from '@/ui/CountryDetails';

type HomeProps = {
  country: Country;
  allCountries: Country[];
};

export default function ClientDynamicCountryHome({
  country,
  allCountries,
}: HomeProps) {
  return (
    <CountryFilterProvider countries={[country]}>
      <AppLayout>
        <CountryDetails country={country} allCountries={allCountries} />
      </AppLayout>
    </CountryFilterProvider>
  );
}
