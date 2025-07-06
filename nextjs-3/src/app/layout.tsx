// import './globals.css';
import { BookmarksProvider } from '@/context/BookmarksContext';
import { DarkModeProvider } from '@/context/DarkModeContext';
import '@/styles/GlobalStyles';
import { Spinner } from '@/ui/Spinner';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Worldwide - countries',
  description:
    'Worldwide countries page allowed you to find interesting information about certain country',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <Suspense fallback={<Spinner />}>
          <DarkModeProvider>
            <BookmarksProvider>{children}</BookmarksProvider>
          </DarkModeProvider>
        </Suspense>
      </body>
    </html>
  );
}
