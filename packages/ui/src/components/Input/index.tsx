'use client';

import React, { useState } from 'react';

interface BaseProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// ─── Text / Email ────────────────────────────────────────────────────────────

interface TextInputProps extends BaseProps {
  type: 'text' | 'email';
  value: string;
  onChange: (value: string) => void;
}

export function Input({ id, label, type, value, onChange, placeholder, required, className }: TextInputProps) {
  return (
    <div>
      {label && <label className="ea-input-label" htmlFor={id}>{label}</label>}
      <input
        id={id} type={type}
        className={`ea-input ${className ?? ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

// ─── Number ──────────────────────────────────────────────────────────────────

interface NumberInputProps extends BaseProps {
  value: string | number;
  onChange: (value: string) => void;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  unit?: string;
}

export function NumberInput({ id, label, value, onChange, placeholder, required, min, max, step, unit, className }: NumberInputProps) {
  return (
    <div>
      {label && <label className="ea-input-label" htmlFor={id}>{label}</label>}
      <div className="relative">
        <input
          id={id} type="number"
          className={`ea-input ${unit ? 'pr-8' : ''} ${className ?? ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          min={min} max={max} step={step}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted tracking-[0.1em] pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Password ─────────────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

interface PasswordInputProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
}

export function PasswordInput({ id, label, value, onChange, placeholder, required, show, onToggle, className }: PasswordInputProps) {
  return (
    <div>
      {label && <label className="ea-input-label" htmlFor={id}>{label}</label>}
      <div className="relative">
        <input
          id={id} type={show ? 'text' : 'password'}
          className={`ea-input pr-10 ${className ?? ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors p-1"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

// ─── Password with internal state (standalone) ────────────────────────────────

interface StandalonePasswordInputProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
}

export function StandalonePasswordInput(props: StandalonePasswordInputProps) {
  const [show, setShow] = useState(false);
  return <PasswordInput {...props} show={show} onToggle={() => setShow((s) => !s)} />;
}

// ─── Select ──────────────────────────────────────────────────────────────────

interface SelectProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  options: string[] | { value: string; label: string }[];
}

export function Select({ id, label, value, onChange, options, className }: SelectProps) {
  return (
    <div>
      {label && <label className="ea-input-label" htmlFor={id}>{label}</label>}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`ea-input cursor-pointer appearance-none ${className ?? ''}`}
      >
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val} className="bg-elevated text-white">{lbl}</option>
          );
        })}
      </select>
    </div>
  );
}
