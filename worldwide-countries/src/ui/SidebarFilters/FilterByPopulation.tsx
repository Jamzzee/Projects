import { FilterByPopulationProps } from '@/types/FiltersTypes';
import FilterSection from './FilterSection';

const populationOptions = [
  { label: '< 1 mn', value: 'small' },
  { label: '1 mn - 10 mn', value: 'medium' },
  { label: '> 10 mn', value: 'large' },
];

export default function FilterByPopulation({
  populations,
  setPopulations,
}: FilterByPopulationProps) {
  const togglePopulation = (population: string) => {
    setPopulations(prev =>
      prev.includes(population)
        ? prev.filter(p => p !== population)
        : [...prev, population]
    );
  };

  return (
    <FilterSection
      label="Filter by population"
      options={populationOptions}
      selectedValue={populations}
      onToggle={togglePopulation}
      htmlFor="population-fitler"
    />
  );
}
