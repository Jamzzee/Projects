export type ToggleFilterButtonProps = {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onToggle: (value: string) => void;
};
