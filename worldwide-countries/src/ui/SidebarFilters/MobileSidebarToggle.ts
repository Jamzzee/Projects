import styled from 'styled-components';

export const MobileSidebarToggle = styled.button`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.6rem;
    padding: 0.2rem 0.4rem;
    background: none;
    border: none;
    color: var(--color-grey-0);
    font-size: 2rem;
    cursor: pointer;
  }
`;
