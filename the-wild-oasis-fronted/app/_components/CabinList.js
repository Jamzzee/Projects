import CabinCard from '../_components/CabinCard';
import { getCabins } from '../_lib/data-service';

//* Using noStor() function make out rout fully dynamicaly. The same as 'relalidate' equal to 0;

async function CabinList({ filter }) {
  const cabins = await getCabins();
  if (!cabins.length) return null;

  const filterCabins = {
    all: () => true,
    small: (cabin) => cabin.maxCapacity <= 3,
    medium: (cabin) => cabin.maxCapacity >= 4 && cabin.maxCapacity <= 7,
    large: (cabin) => cabin.maxCapacity >= 8,
  };
  const displayedCabins = filter === 'all' ? cabins : cabins.filter(filterCabins[filter]);

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
