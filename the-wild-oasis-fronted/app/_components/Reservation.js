import { auth } from '../_lib/auth';
import { getBookedDatesByCabinId, getBookings, getSettings } from '../_lib/data-service';
import DateSelector from './DateSelector';
import LoginMessage from './LoginMessage';
import ReservationForm from './ReservationForm';

async function Reservation({ cabin }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);
  const session = await auth();
  // Get all bookings for this guest
  const guestBookings = (await getBookings(session.user.guestId)) || [];

  // Extract booked dates
  const userBookedDates = guestBookings.flatMap((booking) => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    let dates = [];
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  });

  return (
    <div className="flex min-h-[400px] flex-col gap-6 border border-primary-800 p-4 md:grid md:grid-cols-2 md:gap-8 md:p-6">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
        userBookedDates={userBookedDates}
      />
      {session?.user ? (
        <ReservationForm cabin={cabin} user={session.user} settings={settings} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}

export default Reservation;
