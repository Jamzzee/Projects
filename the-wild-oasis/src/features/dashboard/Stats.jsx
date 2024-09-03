import PropTypes from 'prop-types';
import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import Stat from './Stat';
import { formatCurrency } from '../../utils/helpers';

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
  // 1. Num of bookings
  const numBookings = bookings.length;
  // 2. Totale sales
  const sales = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
  // 3. Total check ins
  const checkins = confirmedStays.length;
  // 4. Occupancy rate
  // num checked in nights / all available nights (num days * num cabins)
  const occupation =
    confirmedStays.reduce((acc, curr) => acc + curr.numNights, 0) /
    (numDays * cabinCount);

  return (
    <>
      <Stat
        title="bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupation * 100) + '%'}
      />
    </>
  );
}

Stats.propTypes = {
  bookings: PropTypes.any,
  confirmedStays: PropTypes.any,
  numDays: PropTypes.any,
  cabinCount: PropTypes.any,
};
export default Stats;
