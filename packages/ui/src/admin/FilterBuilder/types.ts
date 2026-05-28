export type FilterOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains';

export interface FilterClause {
  id: string;
  field: string;
  op: FilterOperator;
  value: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'enum' | 'date';
  options?: string[];
}

export interface FilterBuilderProps {
  fields: FilterField[];
  clauses: FilterClause[];
  onChange: (clauses: FilterClause[]) => void;
}
