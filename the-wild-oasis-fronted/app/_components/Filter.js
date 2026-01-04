'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
    <div className="flex border border-primary-800">
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
