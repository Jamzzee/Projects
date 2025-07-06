'use client';

import { CountryFilterProvider } from '@/context/CountryFilterContext';
import { Country } from '@/types/Country';
import AppLayout from '@/ui/AppLayout';
import Button from '@/ui/Buttons';
import CountryItem from '@/ui/CountryItem';
import Message from '@/ui/Message';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

const ButtonWrapper = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type HomeProps = {
  country: Country | null;
};

export default function ClientRandomCountryHome({ country }: HomeProps) {
  const router = useRouter();
  if (!country) return <Message message="Country not found" />;

  function handleRouter() {
    router.refresh();
  }

  return (
    <CountryFilterProvider countries={[country]}>
      <AppLayout>
        <ButtonWrapper>
          <Link href="/">
            <Button variant="neutral" style={{ margin: '2rem' }}>
              &larr; Back to Home
            </Button>
          </Link>
          <Button onClick={handleRouter}>Get random country</Button>
        </ButtonWrapper>
        <CountryItem country={country} />
      </AppLayout>
    </CountryFilterProvider>
  );
}
