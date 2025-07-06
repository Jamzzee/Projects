import ClientFavoritesHome from '@/components/ClientFavoritesHome';
import { Spinner } from '@/ui/Spinner';
import { Suspense } from 'react';

export default function FavoritesPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ClientFavoritesHome />
    </Suspense>
  );
}
