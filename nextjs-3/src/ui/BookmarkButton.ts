import styled from 'styled-components';

export const BookmarkButton = styled.button`
  position: absolute;
  top: 0.9rem;
  right: 0.9rem;
  font-size: 1.8rem;
  color: var(--color-brand-600);
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.15);
  }
`;
