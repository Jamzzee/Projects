'use client';
import { useBookmarks } from '@/context/BookmarksContext';
import { Country } from '@/types/Country';
import styled from 'styled-components';
import { BookmarkButton } from './BookmarkButton';
import { PiHeartFill, PiHeart } from 'react-icons/pi';
import Image from 'next/image';
import Link from 'next/link';

const Card = styled.div<{ $isBookmarked: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: transform 0.2s ease;

  border: 2px solid;
  border-color: ${({ $isBookmarked }) =>
    $isBookmarked ? 'var(--color-brand-600)' : 'transparent'};

  &:hover {
    transform: scale(1.02);
  }
`;

const CountryInfoWrapper = styled.article`
  display: flex;
  flex-direction: column;
`;

const FlagWrapper = styled.div`
  position: relative;
  width: 70px;
  height: 50px;
  margin-right: 1.5rem;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
`;

const CountryName = styled.h3`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const CountryInfo = styled.p`
  font-size: 1.5rem;
  color: var(--color-grey-500);
`;

const StyledLink = styled.section`
  flex: 1;
  display: flex;
  justify-content: space-between;
  text-decoration: none;
  color: inherit;
`;

type CountryItemProps = {
  country: Country;
};
export default function CountryItem({ country }: CountryItemProps) {
  const {
    name: { common: name },
    region,
    flags,
    cca3,
  } = country;
  const { bookmarks, toggleBookmark } = useBookmarks();
  const isBookmarked = bookmarks.some(b => b.cca3 === cca3);

  const handleBookmarks = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleBookmark(country);
  };

  const countryHref = `/country/${encodeURIComponent(name)}`;

  return (
    <Card $isBookmarked={isBookmarked}>
      <Link href={countryHref} style={{ width: '100%' }}>
        <StyledLink>
          <CountryInfoWrapper>
            <CountryName>{name}</CountryName>
            <CountryInfo>{region}</CountryInfo>
          </CountryInfoWrapper>

          <FlagWrapper>
            <Image
              src={flags?.png || flags?.svg}
              alt={`${flags?.alt}` || 'Country flag'}
              sizes="(max-width: 600px) 70px, (max-width: 900px) 100px, 140px"
              fill
              style={{ objectFit: 'cover' }}
            />
          </FlagWrapper>
        </StyledLink>
      </Link>

      <BookmarkButton
        onClick={handleBookmarks}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {isBookmarked ? (
          <PiHeartFill style={{ color: 'var(--color-red-600)' }} />
        ) : (
          <PiHeart style={{ color: 'var(--color-red-600)' }} />
        )}
      </BookmarkButton>
    </Card>
  );
}
