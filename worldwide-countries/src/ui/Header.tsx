import styled from 'styled-components';
import DarkModeToggle from './DarkModeToggle';
import Bookmarks from './Bookmarks';
import Link from 'next/link';

const StyledHeader = styled.header`
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--color-brand-700);
  color: var(--color-grey-0);
  padding: 1.6rem 3.2rem;
  font-size: 2rem;
  font-weight: 600;
`;

const HeaderTitle = styled.h1`
  font-size: 3.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

const HeaderAction = styled.div`
  display: flex;
  align-items: center;
  gap: 2.4rem;
`;

export default function Header() {
  return (
    <StyledHeader>
      <Link href="/" passHref>
        <HeaderTitle aria-label="Worldwide home page">
          <span aria-hidden="true">🌍</span> Worldwide
        </HeaderTitle>
      </Link>
      <HeaderAction>
        <DarkModeToggle />
        <Bookmarks />
      </HeaderAction>
    </StyledHeader>
  );
}
