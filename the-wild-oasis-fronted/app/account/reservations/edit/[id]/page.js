import ReservationPage from '@/app/_components/ReservationPage';
import { getBooking, getCabin } from '@/app/_lib/data-service';

export default async function Page({ params }) {
  const { id: reservationId } = params;

  // Get booking data and maxCapacity from certain cabin
  const { cabinId, numGuests, observations } = await getBooking(reservationId);
  const { maxCapacity } = await getCabin(cabinId);

  return (
    <ReservationPage
      reservationId={reservationId}
      maxCapacity={maxCapacity}
      numGuests={numGuests}
      observations={observations}
    />
  );
}
