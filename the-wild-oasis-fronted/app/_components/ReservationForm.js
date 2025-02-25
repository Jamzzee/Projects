'use client';

import { differenceInDays } from 'date-fns';
import { useReservation } from './ReservationContext';
import { createBooking } from '../_lib/actions';
import SubmitButton from './SubmitButton';
import { useState } from 'react';
import { formatCurrency } from '../_utils/helpers';

function ReservationForm({ cabin, user, settings }) {
  const { range, resetRange } = useReservation();
  const [numGuests, setNumGuests] = useState();
  const [includeBreakfast, setIncludeBreakfast] = useState(false);

  const { maxCapacity, regularPrice, discount, id: cabinId } = cabin;

  const startDate = range?.from || null;
  const endDate = range?.to || null;
  const numNights =
    startDate && endDate && differenceInDays(endDate, startDate);
  const cabinPrice = numNights * (regularPrice - discount);

  function handleNumberGuests(e) {
    setNumGuests(Number(e.target.value));
  }
  function handleBreakfastChange(e) {
    setIncludeBreakfast(e.target.checked);
  }

  const optionalBreakfastPrice =
    numNights && numGuests && settings.breakfastPrice * numNights * numGuests;

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId,
    hasBreakfast: includeBreakfast,
  };

  // For adding additional data to the action form we could use bind method which allow us to add necessary data as an second argument of this function.
  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as </p>

        <div className="flex gap-4 items-center">
          <img
            // Important to display google profile images
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user.image}
            alt={user.name}
          />
          <p>{user.name.split(' ').at(0)}</p>
        </div>
      </div>

      <form
        // action={createBookingWithData}
        action={async formData => {
          await createBookingWithData(formData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
            value={numGuests}
            onChange={handleNumberGuests}
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

        {optionalBreakfastPrice ? (
          <div className="flex gap-2 items-baseline">
            <input
              type="checkbox"
              name="hasBreakfast"
              id="hasBreakfast"
              checked={includeBreakfast}
              onChange={handleBreakfastChange}
            />
            <label htmlFor="hasBreakfast">
              Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}
            </label>
          </div>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!(startDate && endDate) ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel="Reserving">Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
