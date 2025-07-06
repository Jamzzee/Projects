import { FilterByRegionProps } from '@/types/FiltersTypes';
import FilterSection from './FilterSection';

export default function FilterByRegion({
  countries,
  regions,
  setRegions,
}: FilterByRegionProps) {
  const regionOptions = Array.from(
    new Set(countries.map(c => c.region).filter((r): r is string => r !== null))
  ).map(r => ({ label: r, value: r }));

  const toggleRegion = (region: string) => {
    setRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  return (
    <>
      <FilterSection
        label="Filter by region"
        options={regionOptions}
        selectedValue={regions}
        onToggle={toggleRegion}
        htmlFor="region-fitler"
      />
    </>
  );
}
