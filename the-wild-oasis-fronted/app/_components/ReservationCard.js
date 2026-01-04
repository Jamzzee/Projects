// import { PencilSquareIcon } from '@heroicons/react/24/solid';
// import { format, formatDistance, isPast, isToday, parseISO } from 'date-fns';
// import DeleteReservation from './DeleteReservation';
// import Link from 'next/link';
// import Image from 'next/image';

// export const formatDistanceFromNow = (dateStr) =>
//   formatDistance(parseISO(dateStr), new Date(), {
//     addSuffix: true,
//   }).replace('about ', '');

// function ReservationCard({ booking, onDelete }) {
//   const {
//     id,
//     guestId,
//     startDate,
//     endDate,
//     numNights,
//     totalPrice,
//     numGuests,
//     created_at,
//     cabins: { name, image },
//   } = booking;

//   return (
//     <div className="flex border border-primary-800">
//       <div className="relative aspect-square h-32">
//         <Image
//           src={image}
//           alt={`Cabin ${name}`}
//           fill
//           className="border-r border-primary-800 object-cover"
//         />
//       </div>

//       <div className="flex flex-grow flex-col px-6 py-3">
//         <div className="flex items-center justify-between">
//           <h3 className="text-xl font-semibold">
//             <span>
//               {isToday(new Date(startDate)) ? 'Today' : formatDistanceFromNow(startDate)}{' '}
//               &rarr;{' '}
//             </span>
//             {numNights} nights in Cabin {name}
//           </h3>

//           {isToday(new Date(startDate)) ? (
//             <span className="flex h-7 items-center rounded-sm bg-blue-800 px-3 text-xs font-bold uppercase text-blue-200">
//               Today
//             </span>
//           ) : isPast(new Date(startDate)) ? (
//             <span className="flex h-7 items-center rounded-sm bg-yellow-800 px-3 text-xs font-bold uppercase text-yellow-200">
//               Past
//             </span>
//           ) : (
//             <span className="flex h-7 items-center rounded-sm bg-green-800 px-3 text-xs font-bold uppercase text-green-200">
//               Upcoming
//             </span>
//           )}
//         </div>

//         <div className="mt-auto flex items-baseline gap-5">
//           <p className="text-xl font-semibold text-accent-400">${totalPrice}</p>
//           <p className="text-primary-300">&bull;</p>
//           <p className="text-lg text-primary-300">
//             {numGuests} guest{numGuests > 1 && 's'}
//           </p>
//           <p className="ml-auto text-sm text-primary-400">
//             Booked {format(new Date(created_at), 'EEE, MMM dd yyyy, p')}
//           </p>
//           <p className="ml-auto text-sm text-primary-400">
//             <span className="ml-auto text-sm text-primary-400">
//               {format(new Date(startDate), 'MMM dd yyyy')} &mdash;{' '}
//               {format(new Date(endDate), 'MMM dd yyyy')}
//             </span>
//           </p>
//         </div>
//       </div>

//       <div className="flex w-[100px] flex-col border-l border-primary-800">
//         {!isPast(startDate) ? (
//           <>
//             <Link
//               href={`/account/reservations/edit/${id}`}
//               className="group flex flex-grow items-center gap-2 border-b border-primary-800 px-3 text-xs font-bold uppercase text-primary-300 transition-colors hover:bg-accent-600 hover:text-primary-900"
//             >
//               <PencilSquareIcon className="h-5 w-5 text-primary-600 transition-colors group-hover:text-primary-800" />
//               <span className="mt-1">Edit</span>
//             </Link>
//             <DeleteReservation bookingId={id} onDelete={onDelete} />
//           </>
//         ) : null}
//       </div>
//     </div>
//   );
// }

// export default ReservationCard;

import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { format, formatDistance, isPast, isToday, parseISO } from 'date-fns';
import DeleteReservation from './DeleteReservation';
import Link from 'next/link';
import Image from 'next/image';

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace('about ', '');

function ReservationCard({ booking, onDelete }) {
  const {
    id,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    created_at,
    cabins: { name, image },
  } = booking;

  const isPastBooking = isPast(new Date(startDate));
  const isTodayBooking = isToday(new Date(startDate));

  return (
    <article className="flex max-w-full flex-col overflow-hidden rounded-lg border border-primary-800 bg-primary-950 lg:flex-row">
      {/* IMAGE */}
      <div className="relative h-48 w-full lg:h-auto lg:w-40">
        <Image
          src={image}
          alt={`Cabin ${name}`}
          fill
          className="object-cover lg:border-r lg:border-primary-800"
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-6">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold sm:text-lg">
            {isTodayBooking ? 'Today' : formatDistanceFromNow(startDate)} → {numNights}{' '}
            nights in Cabin {name}
          </h3>

          <span
            className={`rounded-sm px-3 py-1 text-xs font-bold uppercase ${
              isTodayBooking
                ? 'bg-blue-800 text-blue-200'
                : isPastBooking
                  ? 'bg-yellow-800 text-yellow-200'
                  : 'bg-green-800 text-green-200'
            } `}
          >
            {isTodayBooking ? 'Today' : isPastBooking ? 'Past' : 'Upcoming'}
          </span>
        </div>

        {/* META */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-primary-300">
          <span className="text-lg font-semibold text-accent-400">${totalPrice}</span>
          <span>&bull;</span>
          <span>
            {numGuests} guest{numGuests > 1 && 's'}
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline">
            {format(new Date(startDate), 'MMM dd yyyy')} —{' '}
            {format(new Date(endDate), 'MMM dd yyyy')}
          </span>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-primary-400">
          Booked {format(new Date(created_at), 'EEE, MMM dd yyyy, p')}
        </p>

        {/* ACTIONS (mobile) */}
        {!isPastBooking && (
          <div className="mt-3 flex gap-2 lg:hidden">
            <Link
              href={`/account/reservations/edit/${id}`}
              className="flex items-center gap-2 rounded-md border border-primary-700 px-3 py-2 text-xs font-semibold transition hover:bg-accent-600 hover:text-primary-900"
            >
              <PencilSquareIcon className="h-4 w-4" />
              Edit
            </Link>

            <DeleteReservation bookingId={id} onDelete={onDelete} />
          </div>
        )}
      </div>

      {/* ACTIONS (desktop) */}
      {!isPastBooking && (
        <div className="hidden w-[110px] flex-col border-l border-primary-800 lg:flex">
          <Link
            href={`/account/reservations/edit/${id}`}
            className="group flex flex-1 items-center justify-center gap-2 border-b border-primary-800 text-xs font-bold uppercase text-primary-300 transition hover:bg-accent-600 hover:text-primary-900"
          >
            <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800" />
            Edit
          </Link>

          <DeleteReservation bookingId={id} onDelete={onDelete} />
        </div>
      )}
    </article>
  );
}

export default ReservationCard;
