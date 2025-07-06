import { useCountryFilter } from '@/context/CountryFilterContext';
import styled from 'styled-components';
import FilterByRegion from './FilterByRegion';
import FilterByPopulation from './FilterByPopulation';

const StyledFilterGroup = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
`;

export default function FilterGroup() {
  const { allCountries, regions, populations, setRegions, setPopulations } =
    useCountryFilter();

  return (
    <StyledFilterGroup>
      <FilterByRegion
        countries={allCountries}
        regions={regions}
        setRegions={setRegions}
      />
      <FilterByPopulation
        populations={populations}
        setPopulations={setPopulations}
      />
    </StyledFilterGroup>
  );
}
