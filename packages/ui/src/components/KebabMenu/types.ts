export interface KebabMenuItem {
  label: string;
  onClick: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

export interface KebabMenuProps {
  items: KebabMenuItem[];
  align?: 'left' | 'right';
  className?: string;
}
