'use client';
import styled from 'styled-components';
import { FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';

import FilterGroup from '@/ui/SidebarFilters/FilterGroup';
import { MobileSidebarToggle } from './SidebarFilters/MobileSidebarToggle';
import { useState } from 'react';
import { useCountryFilter } from '@/context/CountryFilterContext';
import Button from './Buttons';

const StyledSidebar = styled.aside`
  grid-area: sidebar;
  background-color: var(--color-grey-100);
  padding: 2rem;
  border-right: 1px solid var(--color-grey-200);

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SidebarTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 1.03px;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--color-grey-200);
  padding: 0.5rem 1rem;
  width: 100%;

  @media (max-width: 900px) {
    display: none;
  }
`;

const FilterGroupWrapper = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  @media (min-width: 901px) {
    display: flex !important;
  }
`;

const StyledIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 2.4rem;
  color: var(--color-grey-700);
  transition: transform 0.3s;

  svg {
    display: block;
  }
`;

const StyledChevron = styled(StyledIcon)`
  margin-left: 0.4rem;
`;

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { clearFilters, regions, populations } = useCountryFilter();
  const isFilters = regions.length > 0 || populations.length > 0;
  return (
    <StyledSidebar>
      <SidebarTitle>Filters menu</SidebarTitle>
      <MobileSidebarToggle onClick={() => setIsOpen(prev => !prev)}>
        <StyledIcon>
          <FiFilter />
        </StyledIcon>
        <StyledChevron>
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </StyledChevron>
      </MobileSidebarToggle>

      <FilterGroupWrapper $isOpen={isOpen}>
        <FilterGroup />
      </FilterGroupWrapper>

      {isFilters && isOpen && (
        <Button variant="danger" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </StyledSidebar>
  );
}
