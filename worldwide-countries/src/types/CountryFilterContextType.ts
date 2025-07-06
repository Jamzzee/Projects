import { Country } from './Country';

export type CountryFilterContextType = {
  allCountries: Country[];
  countries: Country[];
  filteredCountries: Country[];
  regions: string[];
  populations: string[];
  searchQuery: string;
  isLoading: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setPopulations: React.Dispatch<React.SetStateAction<string[]>>;
  setRegions: React.Dispatch<React.SetStateAction<string[]>>;
  clearFilters: () => void;
};
