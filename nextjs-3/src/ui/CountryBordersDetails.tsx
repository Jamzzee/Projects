import { Country } from '@/types/Country';
import Link from 'next/link';
import styled from 'styled-components';

const Value = styled.span`
  font-size: 1.6rem;
  color: var(--color-grey-800);
`;

const Tag = styled.span`
  font-size: 1.4rem;
  background-color: var(--color-grey-200);
  color: var(--color-grey-800);
  padding: 0.4rem 1rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;

  &:hover {
    background-color: var(--color-grey-300);
  }
`;

export default function CountryBordersDetails({
  borders,
  allCountries,
}: {
  borders: string[] | undefined;
  allCountries?: Country[];
}) {
  return (
    <>
      {borders?.length &&
        borders.map(cca3 => {
          const borderCountry = allCountries?.find(c => c.cca3 === cca3);
          if (!borderCountry) return;

          const name = borderCountry.name.common;
          const href = `/country/${encodeURIComponent(name.toLowerCase())}`;

          return (
            <Link href={href} key={cca3}>
              <Tag>{name}</Tag>
            </Link>
          );
        })}
      {!borders?.length && <Value>No borders</Value>}
    </>
  );
}
