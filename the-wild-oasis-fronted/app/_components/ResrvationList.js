'use client';

import { useOptimistic } from 'react';
import ReservationCard from './ReservationCard';
import { deleteReservation } from '../_lib/actions';
import { isPast, isToday, startOfDay } from 'date-fns';

export default function ReservationList({ bookings, filter }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter(booking => booking.id !== bookingId);
    }
  );
  // Define reservation filters
  const filterReservations = {
    all: () => true, // Show all reservations
    upcoming: booking => !isPast(startOfDay(new Date(booking.startDate))),
    today: booking => isToday(startOfDay(new Date(booking.startDate))),
    past: booking =>
      isPast(startOfDay(new Date(booking.startDate))) &&
      !isToday(startOfDay(new Date(booking.startDate))),
  };
  // Displayed reservations based on filter
  const displayedReservations = optimisticBookings.filter(
    filterReservations[filter]
  );

  // Delete reservation
  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      {displayedReservations.map(booking => (
        <ReservationCard
          booking={booking}
          onDelete={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}
