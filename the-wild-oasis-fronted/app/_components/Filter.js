'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Children } from 'react';

export default function Filter({ paramKey, filters }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get(paramKey) ?? filters[0].values; // default to first filter 'all'

  function handleFilter(filterValue) {
    const params = new URLSearchParams(searchParams);
    params.set(paramKey, filterValue);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border border-primary-800 flex">
      {filters.map(({ label, value }) => (
        <Button
          key={value}
          filter={value}
          onHandleFilter={handleFilter}
          activeFilter={activeFilter}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}

function Button({ filter, onHandleFilter, activeFilter, children }) {
  return (
    <button
      onClick={() => onHandleFilter(filter)}
      className={`px-5 py-2 hover:bg-primary-700 ${
        activeFilter === filter ? 'bg-primary-700' : ''
      }`}
    >
      {children}
    </button>
  );
}

// TODO Old version (needs refactoring)
// export default function Filter() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const pathname = usePathname();

//   const activeFilter = searchParams.get('capacity') ?? 'all';

//   function handleFitler(filter) {
//     const params = new URLSearchParams(searchParams);
//     params.set('capacity', filter);
//     router.replace(`${pathname}?${params.toString()}`, { scroll: false });
//   }

//   return (
//     <div className="border border-primary-800 flex">
//       <Button
//         filter="all"
//         onHandleflter={handleFitler}
//         activeFilter={activeFilter}
//       >
//         All cabins
//       </Button>
//       <Button
//         filter="small"
//         onHandleflter={handleFitler}
//         activeFilter={activeFilter}
//       >
//         1&mdash;3 guests
//       </Button>
//       <Button
//         filter="medium"
//         onHandleflter={handleFitler}
//         activeFilter={activeFilter}
//       >
//         4&mdash;7 guests
//       </Button>
//       <Button
//         filter="large"
//         onHandleflter={handleFitler}
//         activeFilter={activeFilter}
//       >
//         8&mdash;12 guests
//       </Button>
//     </div>
//   );
// }

// function Button({ filter, onHandleflter, activeFilter, children }) {
//   return (
//     <button
//       onClick={() => onHandleflter(filter)}
//       className={`px-5 py-2 hover:bg-primary-700 ${
//         activeFilter === filter ? 'bg-primary-700 text-primary-50' : ''
//       }`}
//     >
//       {children}
//     </button>
//   );
// }
