'use client';

import { cn } from '../../cn';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import type { FilterBuilderProps, FilterClause, FilterOperator } from './types';

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'eq', label: '=' },
  { value: 'neq', label: '≠' },
  { value: 'gt', label: '>' },
  { value: 'lt', label: '<' },
  { value: 'in', label: 'in' },
  { value: 'contains', label: 'contains' },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/**
 * Aurora query-clause builder. Composes the base `Select` / `Input` / `Button`
 * primitives into a `WHERE … AND …` stack; the `lk-fb*` class layer carries the
 * glass panel chrome and the mono `WHERE`/`AND` joiners.
 */
export default function FilterBuilder({ fields, clauses, onChange }: FilterBuilderProps) {
  const update = (id: string, patch: Partial<FilterClause>) => {
    onChange(clauses.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };
  const remove = (id: string) => onChange(clauses.filter((c) => c.id !== id));
  const add = () =>
    onChange([...clauses, { id: uid(), field: fields[0]?.key ?? '', op: 'eq', value: '' }]);

  return (
    <div className="lk-fb">
      {clauses.map((clause, i) => {
        const field = fields.find((f) => f.key === clause.field);
        return (
          <div key={clause.id} className="lk-fb-row">
            <span className="lk-fb-joiner">{i === 0 ? 'WHERE' : 'AND'}</span>

            <Select
              value={clause.field}
              onChange={(e) => update(clause.id, { field: e.target.value })}
              className="lk-fb-field"
              aria-label="Field"
            >
              {fields.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
            </Select>

            <Select
              value={clause.op}
              onChange={(e) => update(clause.id, { op: e.target.value as FilterOperator })}
              className="lk-fb-op"
              aria-label="Operator"
            >
              {OPERATORS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </Select>

            {field?.type === 'enum' ? (
              <Select
                value={clause.value}
                onChange={(e) => update(clause.id, { value: e.target.value })}
                className="lk-fb-value"
                aria-label="Value"
              >
                <option value="">—</option>
                {(field.options ?? []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                value={clause.value}
                onChange={(e) => update(clause.id, { value: e.target.value })}
                placeholder="value"
                className="lk-fb-value"
                type={field?.type === 'number' ? 'number' : field?.type === 'date' ? 'date' : 'text'}
                aria-label="Value"
              />
            )}

            <button
              type="button"
              onClick={() => remove(clause.id)}
              className={cn('lk-fb-remove')}
              aria-label="Remove clause"
            >
              ✕
            </button>
          </div>
        );
      })}

      <Button variant="ghost" size="sm" onClick={add} className="lk-fb-add">
        + Add clause
      </Button>
    </div>
  );
}
