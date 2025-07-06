'use client';

import { FilterSectionProps } from '@/types/FiltersTypes';
import { useState } from 'react';
import styled from 'styled-components';
import { Label } from './Label';
import ToggleIcon from '../ToggleIcon';
import ToggleFilterButton from '../ToggleFilterButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-radius: var(--border-radius-tiny);
  box-shadow: var(--shadow-sm);
`;

const ToggleHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  cursor: pointer;
`;

const ToggleSection = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

export default function FilterSection({
  label,
  options,
  selectedValue,
  onToggle,
  htmlFor,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Container>
      <ToggleHeader onClick={() => setIsOpen(prev => !prev)}>
        <Label htmlFor={htmlFor}>{label}</Label>
        <ToggleIcon isOpenFilterMenu={isOpen} />
      </ToggleHeader>
      <ToggleSection $isOpen={isOpen}>
        <ToggleFilterButton
          options={options}
          selectedValues={selectedValue}
          onToggle={onToggle}
        />
      </ToggleSection>
    </Container>
  );
}
