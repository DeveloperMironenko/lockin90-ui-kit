'use client';

import type { FilterBuilderProps, FilterClause, FilterOperator } from './types';

const OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: 'eq',       label: '=' },
  { value: 'neq',      label: '≠' },
  { value: 'gt',       label: '>' },
  { value: 'lt',       label: '<' },
  { value: 'in',       label: 'in' },
  { value: 'contains', label: 'contains' },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function FilterBuilder({ fields, clauses, onChange }: FilterBuilderProps) {
  const update = (id: string, patch: Partial<FilterClause>) => {
    onChange(clauses.map(c => (c.id === id ? { ...c, ...patch } : c)));
  };
  const remove = (id: string) => onChange(clauses.filter(c => c.id !== id));
  const add = () => onChange([...clauses, { id: uid(), field: fields[0]?.key ?? '', op: 'eq', value: '' }]);

  return (
    <div className="bg-surface border border-border rounded p-3 flex flex-col gap-2">
      {clauses.map((clause, i) => {
        const field = fields.find(f => f.key === clause.field);
        return (
          <div key={clause.id} className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted w-10">
              {i === 0 ? 'WHERE' : 'AND'}
            </span>
            <select
              value={clause.field}
              onChange={e => update(clause.id, { field: e.target.value })}
              className="bg-elevated border border-border-strong text-white text-[12px] px-2 py-1.5 rounded font-mono"
            >
              {fields.map(f => (<option key={f.key} value={f.key}>{f.label}</option>))}
            </select>
            <select
              value={clause.op}
              onChange={e => update(clause.id, { op: e.target.value as FilterOperator })}
              className="bg-elevated border border-border-strong text-white text-[12px] px-2 py-1.5 rounded font-mono"
            >
              {OPERATORS.map(op => (<option key={op.value} value={op.value}>{op.label}</option>))}
            </select>
            {field?.type === 'enum' ? (
              <select
                value={clause.value}
                onChange={e => update(clause.id, { value: e.target.value })}
                className="bg-elevated border border-border-strong text-white text-[12px] px-2 py-1.5 rounded font-mono flex-1"
              >
                <option value="">—</option>
                {(field.options ?? []).map(o => (<option key={o} value={o}>{o}</option>))}
              </select>
            ) : (
              <input
                value={clause.value}
                onChange={e => update(clause.id, { value: e.target.value })}
                placeholder="value"
                className="bg-elevated border border-border-strong text-white text-[12px] px-2 py-1.5 rounded font-mono flex-1 outline-none focus:border-accent"
              />
            )}
            <button
              onClick={() => remove(clause.id)}
              className="text-muted hover:text-accent text-[12px] px-2 py-1.5 transition-colors"
              aria-label="Remove clause"
            >
              ✕
            </button>
          </div>
        );
      })}
      <button
        onClick={add}
        className="self-start font-display italic font-bold text-[11px] tracking-[0.12em] uppercase text-secondary hover:text-white px-2 py-1.5 transition-colors"
      >
        + Add clause
      </button>
    </div>
  );
}
