'use client';

import { updateReservation } from '@/app/_lib/actions';
import SubmitButton from './SubmitButton';
import { formatCurrency } from '../_utils/helpers';
import { useState } from 'react';

function ReservationPage({
  reservationId,
  maxCapacity,
  numGuests,
  observations,
  numNights,
  breakfastPrice,
  hasBreakfast,
}) {
  const [updateNumGuests, setUpdateNumGuests] = useState(numGuests);
  const optionalBreakfastPrice = breakfastPrice * numNights * updateNumGuests;

  function handleUpdateNumGuests(e) {
    setUpdateNumGuests(e.target.value);
  }

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{reservationId}
      </h2>

      <form
        action={updateReservation}
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      >
        <input type="hidden" name="reservationId" value={reservationId} />
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            defaultValue={updateNumGuests}
            onChange={handleUpdateNumGuests}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(x => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-baseline">
          <input
            type="checkbox"
            name="hasBreakfast"
            id="hasBreakfast"
            defaultChecked={hasBreakfast}
          />
          <label htmlFor="hasBreakfast">
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            defaultValue={observations}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          <SubmitButton pendingLabel="Updating...">
            Update Reservation
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}

export default ReservationPage;
