import styled from 'styled-components';

export const Label = styled.label`
  display: block;
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-grey-900);

  &:hover {
    color: var(--color-brand-600);
    cursor: pointer;
  }
`;
