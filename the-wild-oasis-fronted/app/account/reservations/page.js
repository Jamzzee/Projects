// import Filter from '@/app/_components/Filter';
// import ReservationList from '@/app/_components/ResrvationList';
// import { auth } from '@/app/_lib/auth';
// import { getBookings } from '@/app/_lib/data-service';
// import Link from 'next/link';

// export const metadata = {
//   title: 'Reservations',
// };

// export default async function Page({ searchParams }) {
//   const session = await auth();
//   const bookings = await getBookings(session.user.guestId);

//   const filter = searchParams?.status ?? 'all';

//   return (
//     <div>
//       <h2 className="font-semibold text-2xl text-accent-400">
//         Your reservations
//       </h2>

//       <div className="flex justify-end mb-7">
//         <Filter
//           paramKey="status"
//           filters={[
//             { label: 'All reservations', value: 'all' },
//             { label: 'Upcoming', value: 'upcoming' },
//             { label: 'Today', value: 'today' },
//             { label: 'Past', value: 'past' },
//           ]}
//         />
//       </div>

//       {bookings.length === 0 ? (
//         <p className="text-lg">
//           You have no reservations yet. Check out our{' '}
//           <Link className="underline text-accent-500" href="/cabins">
//             luxury cabins &rarr;
//           </Link>
//         </p>
//       ) : (
//         <ReservationList bookings={bookings} filter={filter} />
//       )}
//     </div>
//   );
// }

import Filter from '@/app/_components/Filter';
import ReservationList from '@/app/_components/ResrvationList';
import { auth } from '@/app/_lib/auth';
import { getBookings } from '@/app/_lib/data-service';
import Link from 'next/link';

export const metadata = {
  title: 'Reservations',
};

export default async function Page({ searchParams }) {
  const session = await auth();
  const bookings = await getBookings(session.user.guestId);

  const filter = searchParams?.status ?? 'all';

  return (
    <section className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-accent-400 sm:text-2xl">
          Your reservations
        </h2>

        <Filter
          paramKey="status"
          filters={[
            { label: 'All reservations', value: 'all' },
            { label: 'Upcoming', value: 'upcoming' },
            { label: 'Today', value: 'today' },
            { label: 'Past', value: 'past' },
          ]}
        />
      </div>

      {/* Content */}
      {bookings.length === 0 ? (
        <p className="max-w-md text-base sm:text-lg">
          You have no reservations yet. Check out our{' '}
          <Link
            href="/cabins"
            className="font-semibold text-accent-500 underline transition-colors hover:text-accent-400"
          >
            luxury cabins &rarr;
          </Link>
        </p>
      ) : (
        <ReservationList bookings={bookings} filter={filter} />
      )}
    </section>
  );
}
