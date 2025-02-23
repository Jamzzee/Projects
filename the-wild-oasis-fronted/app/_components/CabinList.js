import { unstable_noStore as noStore } from 'next/cache';
import CabinCard from '../_components/CabinCard';
import { getCabins } from '../_lib/data-service';

//* Using noStor() function make out rout fully dynamicaly. The same as 'relalidate' equal to 0;

async function CabinList({ filter }) {
  // noStore();

  const cabins = await getCabins();
  if (!cabins.length) return null;

  /*  let displayedCabins;
  if (filter === 'all') displayedCabins = cabins;
  if (filter === 'small')
    displayedCabins = cabins.filter(cabin => cabin.maxCapacity <= 3);
  if (filter === 'medium')
    displayedCabins = cabins.filter(
      cabin => cabin.maxCapacity <= 4 && cabin.maxCapacity <= 7
    );
  if (filter === 'large')
    displayedCabins = cabins.filter(cabin => cabin.maxCapacity >= 8); */

  const filterCabins = {
    all: () => true,
    small: cabin => cabin.maxCapacity <= 3,
    medium: cabin => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
    large: cabin => cabin.maxCapacity >= 8,
  };
  const displayedCabins =
    filter === 'all' ? cabins : cabins.filter(filterCabins[filter]);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map(cabin => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
