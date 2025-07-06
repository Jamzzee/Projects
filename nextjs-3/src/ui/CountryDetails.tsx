'use client';
import Link from 'next/link';
import styled from 'styled-components';
import Button from './Buttons';
import Image from 'next/image';
import { Country } from '@/types/Country';
import CountryBordersDetails from './CountryBordersDetails';

const StyledCountry = styled.section`
  display: grid;
  gap: 2.4rem;
  padding: 2rem;
  background-color: var(--color-grey-100);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-size: 3rem;
  margin-bottom: 1.5rem;
`;

const FlagWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 50px;
  margin-right: 1.5rem;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
`;

const Label = styled.span`
  font-weight: 600;
  color: var(--color-grey-600);
  min-width: 12rem;
`;

const Value = styled.span`
  font-size: 1.6rem;
  color: var(--color-grey-800);
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Tag = styled.span`
  font-size: 1.4rem;
  background-color: var(--color-grey-200);
  color: var(--color-grey-800);
  padding: 0.4rem 1rem;
  border-radius: var(--border-radius-sm);
`;

type CountryDetailsProps = {
  country: Country;
  allCountries?: Country[];
};

export default function CountryDetails({
  country,
  allCountries,
}: CountryDetailsProps) {
  const {
    name,
    flags,
    capital,
    region,
    population,
    languages,
    currencies,
    borders,
  } = country;

  return (
    <StyledCountry>
      <Link href="/" passHref>
        <Button variant="neutral">&larr; back</Button>
      </Link>
      <Row>
        <Title>{name.common}</Title>
        <FlagWrapper>
          <Image
            src={flags?.png || flags?.svg}
            alt={`${flags?.alt}` || 'Country flag'}
            sizes="(max-width: 600px) 70px, (max-width: 900px) 100px, 140px"
            fill
            style={{ objectFit: 'cover' }}
          />
        </FlagWrapper>
      </Row>

      <Row>
        <Label>Capital:</Label>
        <Value>{capital?.[0] || '&apos;'}</Value>
      </Row>

      <Row>
        <Label>Region:</Label>
        <Value>{region}</Value>
      </Row>
      <Row>
        <Label>Population:</Label>
        <Value>{population.toLocaleString().replace(/,/g, ' ')}</Value>
      </Row>

      <Row>
        <Label>Languages:</Label>
        <List>
          {languages ? (
            Object.values(languages).map(lang => <Tag key={lang}>{lang}</Tag>)
          ) : (
            <Value>-</Value>
          )}
        </List>
      </Row>

      <Row>
        <Label>Currencies:</Label>
        <List>
          {currencies ? (
            Object.values(currencies).map(curr => (
              <Tag key={curr.name}>
                {curr.name} ({curr.symbol})
              </Tag>
            ))
          ) : (
            <Value>&apos;</Value>
          )}
        </List>
      </Row>

      <Row>
        <Label>Borders:</Label>
        <List>
          <CountryBordersDetails
            borders={borders}
            allCountries={allCountries}
          />
        </List>
      </Row>

      <Row>
        <Label>Wikipedia:</Label>
        <Value>
          <a
            href={`https://en.wikipedia.org/wiki/${encodeURIComponent(
              name.official
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--color-blue-sky-500)',
              textDecoration: 'underline',
            }}
          >
            {name.official}
          </a>
        </Value>
      </Row>
    </StyledCountry>
  );
}
