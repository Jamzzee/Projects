'use client';
import { useCountryFilter } from '@/context/CountryFilterContext';
import styled from 'styled-components';

const StyledSearchBar = styled.div`
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-round);
  display: flex;
  align-items: center;
  padding-left: 3rem;
  transition: all 0.3s;
  margin-right: auto;

  &:focus-within {
    transform: translateY(-2px);
  }
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  font-family: inherit;
  color: inherit;
  font-size: 1.7rem;
  max-width: 30rem;
  padding: 1rem 0;

  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
  }

  &::placeholder {
    color: var(--color-grey-500);
  }

  @media only screen and (max-width: 900px) {
    width: auto;

    &::placeholder {
      color: rgb(168, 168, 168);
    }
  }
`;

export default function Searchbar() {
  const { searchQuery, setSearchQuery } = useCountryFilter();

  return (
    <StyledSearchBar>
      <SearchInput
        aria-label="Search country"
        type="text"
        placeholder="Search for a country"
        maxLength={30}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </StyledSearchBar>
  );
}
