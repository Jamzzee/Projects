'use client';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FaSort } from 'react-icons/fa';
import Searchbar from './SearchCountry';
import ToggleFilterButton from './ToggleFilterButton';
import { SortCountriesProps } from '@/types/SortCountriesType';
import Button from './Buttons';
import Link from 'next/link';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.6rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const SortContainer = styled.div`
  position: relative;
`;

const SortToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  background-color: var(--color-grey-100);
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  color: var(--color-grey-800);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-200);
  }
`;

const SortMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 10;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
  padding: 0.75rem;
  min-width: 18rem;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const sortOptions = [
  { label: 'Sort by name', value: 'name' },
  { label: 'Sort by population', value: 'population' },
];

export default function SearchAndSortBar({
  sortBy,
  setSortBy,
}: SortCountriesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close the sort menu out of the box
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const handleToggle = () => setIsOpen(prev => !prev);
  const handleSelect = (value: string) => {
    setSortBy(value);
    setIsOpen(false);
  };

  return (
    <Wrapper>
      <Searchbar />
      <Link href="/random">
        <Button>Get random country</Button>
      </Link>
      <SortContainer ref={sortRef}>
        <SortToggleButton onClick={handleToggle} aria-expanded={isOpen}>
          <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
          <FaSort />
        </SortToggleButton>

        <SortMenu $isOpen={isOpen}>
          <ToggleFilterButton
            options={sortOptions}
            selectedValues={[sortBy]}
            onToggle={handleSelect}
          />
        </SortMenu>
      </SortContainer>
    </Wrapper>
  );
}
