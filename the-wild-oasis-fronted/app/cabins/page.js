import CabinList from '@/app/_components/CabinList';
import { Suspense } from 'react';
import Spinner from '../_components/Spinner';
import Filter from '../_components/Filter';
import ReservationReminder from '../_components/ReservationReminder';

export const metadata = {
  title: 'Cabins',
};

// * Revalidation at the Rout level. Revalidation at the Component level implementing in the CabinList component.
//* Revalidate data for every single request. Not a good point for data which won't be change so often.
// export const revalidate = 0;

// Instead, it's better to use ISR (incremental static regeneration), will regenerate a static page and fetch the data from time to time. All we have to do is to export 'revalidate' const as above and set some number (time in mls) for revalidate cycling

//* After using 'searchParams' server will rendered dynamicaly, that's means 'revalidation' useless right now, so just turn it off
// export const revalidate = 3600; // Ones per hour

export default function Page({ searchParams }) {
  // searchParams available only on the 'Page' server components

  const filter = searchParams?.capacity ?? 'all';

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>

      <div className="flex justify-end mb-8">
        <Filter
          paramKey="capacity"
          filters={[
            { label: 'All cabins', value: 'all' },
            { label: '1\u20133 guests', value: 'small' },
            { label: '4\u20137 guests', value: 'medium' },
            { label: '8\u201312 guests', value: 'large' },
          ]}
        />
      </div>

      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
