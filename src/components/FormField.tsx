// src/components/FormField.tsx
// Reusable label + input + error primitive using AtlasID design tokens.

import React, { useId } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FormFieldProps {
    readonly label: string;
    readonly name: string;
    readonly type?: string;
    readonly value: string;
    readonly placeholder?: string;
    readonly error?: string;
    readonly required?: boolean;
    readonly disabled?: boolean;
    readonly hint?: string;
    readonly autoComplete?: string;
    readonly onChange: (value: string) => void;
    readonly onBlur?: () => void;
    readonly className?: string;
    readonly inputClassName?: string;
}

// ─── FormField ─────────────────────────────────────────────────────────────────

export const FormField: React.FC<FormFieldProps> = ({
    label, name, type = 'text', value, placeholder, error,
    required, disabled, hint, autoComplete,
    onChange, onBlur, className = '', inputClassName = '',
}) => {
    const uid = useId();
    const inputId = `${uid}-${name}`;
    const errorId = `${uid}-${name}-error`;
    const hintId = `${uid}-${name}-hint`;

    const describedBy = [error ? errorId : '', hint ? hintId : ''].filter(Boolean).join(' ') || undefined;

    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {/* Label row */}
            <label
                htmlFor={inputId}
                className="text-label font-semibold text-white/65 uppercase tracking-widest"
            >
                {label}
                {required && <span className="text-atlas-blue ml-0.5" aria-hidden="true">*</span>}
            </label>

            {/* Input */}
            <input
                id={inputId}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={describedBy}
                onChange={e => onChange(e.target.value)}
                onBlur={onBlur}
                className={[
                    'w-full rounded-control px-4 py-3.5 text-white text-body-md font-medium',
                    'bg-white/[0.05] border transition-all duration-200',
                    'placeholder:text-white/30 focus:outline-none',
                    error
                        ? 'border-status-error focus:border-status-error focus:[box-shadow:0_0_0_3px_rgba(239,68,68,0.20)]'
                        : 'border-white/[0.12] focus:border-atlas-blue focus:[box-shadow:0_0_0_3px_rgba(46,119,255,0.25)]',
                    disabled ? 'opacity-40 cursor-not-allowed' : '',
                    inputClassName,
                ].join(' ')}
            />

            {/* Hint */}
            {hint && !error && (
                <p id={hintId} className="text-label text-white/40">{hint}</p>
            )}

            {/* Error */}
            {error && (
                <p id={errorId} role="alert" className="flex items-center gap-1.5 text-label text-status-error">
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">error</span>
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormField;
