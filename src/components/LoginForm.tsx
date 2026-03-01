// src/components/LoginForm.tsx
// Controlled login form consuming the useLoginForm custom hook.
// All form state logic lives in the hook — this component is purely presentation.

import React, { useState, useId } from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import { LOGIN_FORM_DEFAULTS } from '../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface LoginFormProps {
    readonly onSuccess?: () => void;
    readonly className?: string;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface InputFieldProps {
    readonly id: string;
    readonly label: string;
    readonly name: string;
    readonly type: string;
    readonly value: string;
    readonly placeholder?: string;
    readonly error?: string;
    readonly required?: boolean;
    readonly autoComplete?: string;
    readonly onChange: React.ChangeEventHandler<HTMLInputElement>;
    readonly onBlur: React.ChangeEventHandler<HTMLInputElement>;
    readonly suffix?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
    id, label, name, type, value, placeholder, error,
    required, autoComplete, onChange, onBlur, suffix,
}) => (
    <div className="flex flex-col gap-2">
        <label
            htmlFor={id}
            className="text-label font-semibold text-white/65 uppercase tracking-widest"
        >
            {label}
            {required && <span className="text-[#2e77ff] ml-0.5" aria-hidden="true">*</span>}
        </label>

        <div className="relative">
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                onChange={onChange}
                onBlur={onBlur}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`
          w-full rounded-control px-4 py-3.5 pr-${suffix ? '12' : '4'}
          bg-white/[0.05] text-white text-body-md font-medium
          border transition-all duration-200
          placeholder:text-white/35
          focus:outline-none focus:ring-0
          ${error
                        ? 'border-status-error focus:border-status-error focus:shadow-glow-error'
                        : 'border-white/[0.12] focus:border-atlas-blue focus:shadow-glow-blue-sm'
                    }
        `}
                style={{
                    paddingRight: suffix ? '3rem' : '1rem',
                }}
            />

            {/* Suffix slot (e.g. show/hide button) */}
            {suffix && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {suffix}
                </div>
            )}
        </div>

        {/* Error message */}
        {error && (
            <p
                id={`${id}-error`}
                role="alert"
                className="flex items-center gap-1.5 text-label text-status-error"
            >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">error</span>
                {error}
            </p>
        )}
    </div>
);

// ─── ShowPasswordButton ────────────────────────────────────────────────────────

interface ShowPasswordButtonProps {
    readonly isVisible: boolean;
    readonly onToggle: () => void;
}

const ShowPasswordButton: React.FC<ShowPasswordButtonProps> = ({ isVisible, onToggle }) => (
    <button
        type="button"
        onClick={onToggle}
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        className="w-8 h-8 flex items-center justify-center rounded-control
               text-white/45 hover:text-white hover:bg-white/[0.08]
               transition-all duration-150"
    >
        <span className="material-symbols-outlined text-xl" aria-hidden="true">
            {isVisible ? 'visibility_off' : 'visibility'}
        </span>
    </button>
);

// ─── LoadingSpinner ────────────────────────────────────────────────────────────

const LoadingSpinner: React.FC = () => (
    <span
        className="inline-block w-4 h-4 border-2 border-white/30 border-t-white
               rounded-full animate-spin"
        aria-hidden="true"
    />
);

// ─── LoginForm ────────────────────────────────────────────────────────────────

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, className = '' }) => {
    const uid = useId();
    const [showPassword, setShowPassword] = useState(false);

    const {
        formState,
        errors,
        isLoading,
        serverError,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useLoginForm(LOGIN_FORM_DEFAULTS);

    return (
        <form
            id={`${uid}-login-form`}
            noValidate
            onSubmit={e => handleSubmit(e, onSuccess)}
            className={`flex flex-col gap-5 ${className}`}
            aria-label="Sign in to AtlasID"
        >
            {/* ── Email ─────────────────────────────────────────────────────────── */}
            <InputField
                id={`${uid}-email`}
                label="Email address"
                name="email"
                type="email"
                value={formState.email}
                placeholder="you@example.com"
                autoComplete="email"
                required
                error={errors.email}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            {/* ── Password ──────────────────────────────────────────────────────── */}
            <InputField
                id={`${uid}-password`}
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formState.password}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                error={errors.password}
                onChange={handleChange}
                onBlur={handleBlur}
                suffix={
                    <ShowPasswordButton
                        isVisible={showPassword}
                        onToggle={() => setShowPassword(v => !v)}
                    />
                }
            />

            {/* ── Remember me + Help ────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                {/* Custom checkbox */}
                <label
                    className="flex items-center gap-2.5 cursor-pointer group"
                    htmlFor={`${uid}-remember`}
                >
                    <div className="relative">
                        <input
                            id={`${uid}-remember`}
                            type="checkbox"
                            name="rememberMe"
                            checked={formState.rememberMe}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div
                            className="w-[18px] h-[18px] rounded-[3px] border-[1.5px] border-white/25
                         flex items-center justify-center transition-all duration-150
                         peer-checked:border-[#2e77ff] peer-checked:bg-[#2e77ff]
                         peer-focus-visible:shadow-glow-blue-sm
                         group-hover:border-white/45"
                            aria-hidden="true"
                        >
                            {formState.rememberMe && (
                                <span className="material-symbols-outlined text-white text-xs font-bold">
                                    check
                                </span>
                            )}
                        </div>
                    </div>
                    <span className="text-body-sm text-white/60 select-none">Remember me</span>
                </label>

                <a
                    href="#help"
                    className="flex items-center gap-1 text-body-sm text-white/55
                     hover:text-white transition-colors duration-150"
                >
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">help</span>
                    Need help signing in?
                </a>
            </div>

            {/* ── Server error ──────────────────────────────────────────────────── */}
            {serverError && (
                <div
                    role="alert"
                    className="flex items-center gap-2 px-4 py-3 rounded-control
                     bg-status-error-bg border border-status-error/30"
                >
                    <span className="material-symbols-outlined text-status-error text-sm" aria-hidden="true">
                        warning
                    </span>
                    <span className="text-body-sm text-status-error">{serverError}</span>
                </div>
            )}

            {/* ── Submit button ─────────────────────────────────────────────────── */}
            <button
                type="submit"
                disabled={isLoading}
                aria-disabled={isLoading}
                className="relative w-full flex items-center justify-center gap-2
                   px-7 py-3.5 rounded-control
                   bg-[#2e77ff] text-white font-semibold text-body-md
                   shadow-btn-primary
                   hover:bg-[#1a5fe0] hover:shadow-glow-blue-md
                   active:bg-[#1451cc] active:scale-[0.98]
                   disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
                   transition-all duration-200
                   focus-visible:outline-none focus-visible:shadow-glow-blue-sm"
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner />
                        <span>Verifying…</span>
                    </>
                ) : (
                    <>
                        <span>Sign In</span>
                        <span className="material-symbols-outlined text-lg" aria-hidden="true">
                            arrow_forward
                        </span>
                    </>
                )}
            </button>

            {/* ── Security note ─────────────────────────────────────────────────── */}
            <p className="flex items-center justify-center gap-1.5 text-label text-white/35">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">lock</span>
                Protected by reCAPTCHA · End-to-end encrypted
            </p>
        </form>
    );
};

export default LoginForm;
