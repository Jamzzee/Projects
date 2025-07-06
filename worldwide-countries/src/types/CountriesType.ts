import { Country } from './Country';

export type CountriesProps = {
  sortBy?: string;
  countries?: Country[];
  isBookmarkPage?: boolean;
};
