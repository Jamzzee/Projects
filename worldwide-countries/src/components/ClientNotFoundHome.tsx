'use client';
import { CountryFilterProvider } from '@/context/CountryFilterContext';
import AppLayout from '@/ui/AppLayout';
import Button from '@/ui/Buttons';
import Link from 'next/link';
import styled from 'styled-components';

const Wrapper = styled.section`
  padding: 5rem;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 4rem;
  margin-bottom: 2rem;
`;

export default function ClientNotFound() {
  return (
    <CountryFilterProvider countries={[]}>
      <AppLayout>
        <Wrapper>
          <Title> 404 - Country not found!</Title>
          <Link href="/" passHref>
            <Button variant="neutral">&larr; back</Button>
          </Link>
        </Wrapper>
      </AppLayout>
    </CountryFilterProvider>
  );
}
