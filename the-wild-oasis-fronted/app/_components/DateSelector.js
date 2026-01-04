'use client';

import { differenceInDays, isPast, isSameDay, isWithinInterval } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useReservation } from './ReservationContext';
import { FIVE_NONTHS_LATER, TODAY } from '../_utils/const';

function isAlreadyBooked(range, datesArr) {
  return (
    range?.from &&
    range?.to &&
    datesArr.some((date) => isWithinInterval(date, { start: range.from, end: range.to }))
  );
}

function DateSelector({ settings, cabin, bookedDates, userBookedDates }) {
  const { range = { from: null, to: null }, setRange, resetRange } = useReservation();

  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

  const { regularPrice, discount } = cabin || {};
  const numNights =
    displayRange.from &&
    displayRange.to &&
    differenceInDays(displayRange.to, displayRange.from);

  const cabinPrice = numNights * (regularPrice - discount);

  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between">
      {/* CALENDAR */}
      <div className="flex justify-center px-2 sm:px-4 lg:px-0">
        <DayPicker
          className="rdp mx-auto w-full max-w-[360px] sm:max-w-none lg:mx-0"
          mode="range"
          selected={displayRange}
          onSelect={setRange}
          min={minBookingLength}
          max={maxBookingLength}
          startMonth={TODAY}
          endMonth={FIVE_NONTHS_LATER}
          captionLayout="dropdown"
          numberOfMonths={1}
          classNames={{
            months: 'flex flex-col gap-6 lg:flex-row lg:gap-8',
          }}
          disabled={(curDate) =>
            isPast(curDate) || bookedDates.some((date) => isSameDay(date, curDate))
          }
          modifiers={{
            userBooked: (day) =>
              userBookedDates
                .filter((day) => !isPast(day))
                .some((userDate) => isSameDay(userDate, day)),
          }}
          modifiersClassNames={{
            userBooked: 'user-booked-date',
          }}
        />
      </div>

      {/* PRICE BAR */}
      <div className="flex flex-col gap-3 bg-accent-500 px-4 py-3 text-primary-800 sm:gap-4 sm:px-6 lg:h-[72px] lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base">
          <p className="flex items-baseline gap-2 whitespace-nowrap">
            {discount > 0 ? (
              <>
                <span className="text-lg sm:text-xl lg:text-2xl">
                  ${regularPrice - discount}
                </span>
                <span className="font-semibold text-primary-700 line-through">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-lg sm:text-xl lg:text-2xl">${regularPrice}</span>
            )}
            <span>/night</span>
          </p>

          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-1 text-base sm:text-lg lg:text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p className="flex items-baseline gap-1 whitespace-nowrap">
                <span className="text-xs font-bold uppercase sm:text-sm lg:text-lg">
                  Total
                </span>
                <span className="text-lg font-semibold sm:text-xl lg:text-2xl">
                  ${cabinPrice}
                </span>
              </p>
            </>
          ) : null}
        </div>

        {(range?.from || range?.to) && (
          <button
            onClick={resetRange}
            className="w-full border border-primary-800 px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary-800 hover:text-primary-100 sm:w-auto"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default DateSelector;
