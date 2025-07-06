import { POPULATION_LARGE, POPULATION_SMALL } from './constants';

export const isPopulationMatch = (
  filter: string,
  population: number
): boolean => {
  if (!filter) return false;

  switch (filter) {
    case 'small':
      return population < POPULATION_SMALL;
    case 'medium':
      return population >= POPULATION_SMALL && population <= POPULATION_LARGE;
    case 'large':
      return population > POPULATION_LARGE;
    default:
      return true;
  }
};
