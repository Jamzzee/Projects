'use client';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';
import GlobalStyles from '@/styles/GlobalStyles';

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 30rem 1fr;
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    'header header'
    'filters filters'
    'sidebar main';

  height: 100vh;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-lg);
  border-radius: var(--border-radius-lg);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto 1fr;

    grid-template-areas:
      'header'
      'filters'
      'sidebar'
      'main';
  }
`;

const LayoutSidebar = styled.aside`
  grid-area: sidebar;
`;

const Main = styled.main`
  grid-area: main;
  padding: 2rem 3.2rem;
  background-color: var(--color-grey-50);
  overflow-y: auto;
  max-height: calc(100vh - 8rem);
`;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalStyles />
      <StyledAppLayout>
        <Header />
        <LayoutSidebar>
          <Sidebar />
        </LayoutSidebar>
        <Main>{children}</Main>
      </StyledAppLayout>
    </>
  );
}
