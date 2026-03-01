// src/components/SelectField.tsx
// Styled select/dropdown using AtlasID design tokens.

import React, { useId } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface SelectOption {
    readonly value: string;
    readonly label: string;
}

interface SelectFieldProps {
    readonly label: string;
    readonly name: string;
    readonly value: string;
    readonly options: readonly SelectOption[];
    readonly placeholder?: string;
    readonly error?: string;
    readonly required?: boolean;
    readonly disabled?: boolean;
    readonly onChange: (value: string) => void;
    readonly onBlur?: () => void;
    readonly className?: string;
}

// ─── SelectField ───────────────────────────────────────────────────────────────

export const SelectField: React.FC<SelectFieldProps> = ({
    label, name, value, options, placeholder = 'Select…',
    error, required, disabled,
    onChange, onBlur, className = '',
}) => {
    const uid = useId();
    const selectId = `${uid}-${name}`;
    const errorId = `${uid}-${name}-error`;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label
                htmlFor={selectId}
                className="text-label font-semibold text-white/65 uppercase tracking-widest"
            >
                {label}
                {required && <span className="text-atlas-blue ml-0.5" aria-hidden="true">*</span>}
            </label>

            {/* Wrapper for custom chevron */}
            <div className="relative">
                <select
                    id={selectId}
                    name={name}
                    value={value}
                    required={required}
                    disabled={disabled}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    className={[
                        'w-full appearance-none rounded-control px-4 py-3.5 pr-10',
                        'text-body-md font-medium cursor-pointer',
                        'bg-white/[0.05] border transition-all duration-200',
                        'focus:outline-none',
                        value ? 'text-white' : 'text-white/35',
                        error
                            ? 'border-status-error focus:border-status-error focus:[box-shadow:0_0_0_3px_rgba(239,68,68,0.20)]'
                            : 'border-white/[0.12] focus:border-atlas-blue focus:[box-shadow:0_0_0_3px_rgba(46,119,255,0.25)]',
                        disabled ? 'opacity-40 cursor-not-allowed' : '',
                    ].join(' ')}
                    style={{ colorScheme: 'dark' }}
                >
                    <option value="" disabled hidden>{placeholder}</option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-surface-graphite text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Chevron icon */}
                <span
                    className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2
                     -translate-y-1/2 text-white/45 text-xl"
                    aria-hidden="true"
                >
                    expand_more
                </span>
            </div>

            {error && (
                <p id={errorId} role="alert" className="flex items-center gap-1.5 text-label text-status-error">
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">error</span>
                    {error}
                </p>
            )}
        </div>
    );
};

export default SelectField;
