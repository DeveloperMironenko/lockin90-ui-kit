/** Comparison operators a {@link FilterClause} can use. */
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains';

/** A single `field <op> value` row in the query the user is assembling. */
export interface FilterClause {
  /** Stable, unique row id (used as the React key + for patch/remove). */
  id: string;
  /** The {@link FilterField.key} this clause targets. */
  field: string;
  /** The comparison operator. */
  op: FilterOperator;
  /** The right-hand value (always a string at the UI layer; coerced by callers). */
  value: string;
}

/** A selectable field the builder can filter on. */
export interface FilterField {
  /** Stable field id stored in {@link FilterClause.field}. */
  key: string;
  /** Human label shown in the field dropdown. */
  label: string;
  /** Drives the value control — `enum` renders a `<select>` of `options`. */
  type: 'string' | 'number' | 'enum' | 'date';
  /** Allowed values when `type === 'enum'`. */
  options?: string[];
}

export interface FilterBuilderProps {
  /** The fields available to filter on. */
  fields: FilterField[];
  /** The current list of clauses (controlled). */
  clauses: FilterClause[];
  /** Called with the next clause list on any add / edit / remove. */
  onChange: (clauses: FilterClause[]) => void;
}
