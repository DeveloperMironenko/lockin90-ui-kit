export interface FilterChip {
  id: string;
  label: string;
  count?: number;
}

export interface FilterChipsProps {
  chips: FilterChip[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}
