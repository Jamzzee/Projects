'use client';
import { ToggleFilterButtonProps } from '@/types/ToggleFilterButton';
import styled from 'styled-components';

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ListItem = styled.li``;

const ToggleButton = styled.button<{ $selected: boolean }>`
  background-color: ${({ $selected }) =>
    $selected ? 'var(--color-brand-100)' : 'var(--color-grey-100)'};
  color: ${({ $selected }) =>
    $selected ? 'var(--color-brand-800)' : 'var(--color-grey-700)'};
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid
    ${({ $selected }) =>
      $selected ? 'var(--color-brand-500)' : 'var(--color-grey-300)'};
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s, color 0.3s, border-color 0.1s;

  &:hover {
    background-color: ${({ $selected }) =>
      $selected ? 'var(--color-brand-200)' : 'var(--color-grey-200)'};

    color: ${({ $selected }) =>
      $selected ? 'var(--color-brand-900)' : 'var(--color-grey-800)'};

    border-color: ${({ $selected }) =>
      $selected ? 'var(--color-brand-600)' : 'var(--color-grey-400)'};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-brand-200);
  }
`;

export default function ToggleFilterButton({
  options,
  selectedValues,
  onToggle,
}: ToggleFilterButtonProps) {
  return (
    <List>
      {options.map(({ label, value }) => (
        <ListItem key={value}>
          <ToggleButton
            type="button"
            $selected={selectedValues.includes(value)}
            onClick={() => onToggle(value)}
          >
            {label}
          </ToggleButton>
        </ListItem>
      ))}
    </List>
  );
}
