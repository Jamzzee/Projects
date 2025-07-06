export interface FilterByRegionProps {
  countries: { region: string | null | undefined }[];
  regions: string[];
  setRegions: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface FilterByPopulationProps {
  populations: string[];
  setPopulations: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface FilterSectionProps {
  label: string;
  options: { label: string; value: string }[];
  selectedValue: string[];
  onToggle: (value: string) => void;
  htmlFor?: string;
}
