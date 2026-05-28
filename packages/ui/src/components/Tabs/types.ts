export interface Tab {
  id: string;
  label: string;
  href?: string;
  count?: number;
}

export interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange?: (id: string) => void;
  className?: string;
}
