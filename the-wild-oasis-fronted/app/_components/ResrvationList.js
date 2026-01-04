// 'use client';

// import { useOptimistic } from 'react';
// import ReservationCard from './ReservationCard';
// import { deleteReservation } from '../_lib/actions';
// import { isPast, isToday, startOfDay } from 'date-fns';

// export default function ReservationList({ bookings, filter }) {
//   const [optimisticBookings, optimisticDelete] = useOptimistic(
//     bookings,
//     (curBookings, bookingId) => {
//       return curBookings.filter(booking => booking.id !== bookingId);
//     }
//   );
//   // Define reservation filters
//   const filterReservations = {
//     all: () => true, // Show all reservations
//     upcoming: booking => !isPast(startOfDay(new Date(booking.startDate))),
//     today: booking => isToday(startOfDay(new Date(booking.startDate))),
//     past: booking =>
//       isPast(startOfDay(new Date(booking.startDate))) &&
//       !isToday(startOfDay(new Date(booking.startDate))),
//   };
//   // Displayed reservations based on filter
//   const displayedReservations = optimisticBookings.filter(
//     filterReservations[filter]
//   );

//   // Delete reservation
//   async function handleDelete(bookingId) {
//     optimisticDelete(bookingId);
//     await deleteReservation(bookingId);
//   }

//   return (
//     <ul className="space-y-6">
//       {displayedReservations.map(booking => (
//         <ReservationCard
//           booking={booking}
//           onDelete={handleDelete}
//           key={booking.id}
//         />
//       ))}
//     </ul>
//   );
// }

'use client';

import { useOptimistic } from 'react';
import ReservationCard from './ReservationCard';
import { deleteReservation } from '../_lib/actions';
import { isPast, isToday, startOfDay } from 'date-fns';

export default function ReservationList({ bookings, filter }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => curBookings.filter((booking) => booking.id !== bookingId),
  );

  const filterReservations = {
    all: () => true,
    upcoming: (booking) => !isPast(startOfDay(new Date(booking.startDate))),
    today: (booking) => isToday(startOfDay(new Date(booking.startDate))),
    past: (booking) =>
      isPast(startOfDay(new Date(booking.startDate))) &&
      !isToday(startOfDay(new Date(booking.startDate))),
  };

  const displayedReservations = optimisticBookings.filter(filterReservations[filter]);

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  if (displayedReservations.length === 0) {
    return (
      <p className="rounded-md bg-primary-900 p-4 text-sm text-primary-300">
        No reservations match this filter.
      </p>
    );
  }

  return (
    <ul className="space-y-4 sm:space-y-5 lg:space-y-6">
      {displayedReservations.map((booking) => (
        <li key={booking.id}>
          <ReservationCard booking={booking} onDelete={handleDelete} />
        </li>
      ))}
    </ul>
  );
}
