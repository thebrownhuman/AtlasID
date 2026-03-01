// src/components/OtpInput.tsx
// Reusable 6-digit OTP row. Auto-focuses first cell on mount.
// Works on both desktop and mobile (full touch support via onChange).

import React, { useEffect } from 'react';
import { useOtpInput, type UseOtpInputOptions } from '../hooks/useOtpInput';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type OtpInputStatus = 'idle' | 'error' | 'success';

interface OtpInputProps extends UseOtpInputOptions {
    /** Visual status to drive border/glow colour */
    readonly status?: OtpInputStatus;
    /** Auto-focus first cell on mount (default: true) */
    readonly autoFocus?: boolean;
    /** Disabled — all cells read-only, greyed out */
    readonly disabled?: boolean;
    readonly className?: string;
    /** Forwarded from parent so parent can access the composed otp string */
    readonly onComplete?: (otp: string) => void;
}

// ─── Colour maps ───────────────────────────────────────────────────────────────

const CELL_BORDER: Record<OtpInputStatus, string> = {
    idle: 'border-white/[0.14]',
    error: 'border-status-error',
    success: 'border-status-success',
};

const CELL_SHADOW: Record<OtpInputStatus, string> = {
    idle: '',
    error: '0 0 0 3px rgba(239,68,68,0.25)',
    success: '0 0 0 3px rgba(34,197,94,0.25)',
};

const CELL_TEXT: Record<OtpInputStatus, string> = {
    idle: 'text-white',
    error: 'text-status-error',
    success: 'text-status-success',
};

// ─── OtpInput ─────────────────────────────────────────────────────────────────

export const OtpInput: React.FC<OtpInputProps> = ({
    length = 6,
    status = 'idle',
    autoFocus = true,
    disabled = false,
    className = '',
    onComplete,
}) => {
    const {
        digits,
        inputRefs,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleFocus,
    } = useOtpInput({ length, onComplete });

    // Auto-focus first cell on mount
    useEffect(() => {
        if (autoFocus) {
            // Small delay to let React finish rendering
            const t = setTimeout(() => inputRefs.current[0]?.focus(), 80);
            return () => clearTimeout(t);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoFocus]);

    return (
        <div
            className={`flex items-center gap-2 sm:gap-3 ${className}`}
            role="group"
            aria-label="One-time password input"
        >
            {digits.map((digit, index) => (
                <input
                    key={index}
                    ref={el => { inputRefs.current[index] = el; }}
                    id={`otp-digit-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    disabled={disabled}
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    aria-label={`Digit ${index + 1} of ${length}`}
                    onChange={handleChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    onPaste={handlePaste}
                    onFocus={handleFocus(index)}
                    className={[
                        // ── Base layout ──────────────────────────────────────────────
                        'flex-1 min-w-0',
                        'h-14 sm:h-16',
                        'rounded-control',
                        // ── Typography ───────────────────────────────────────────────
                        'text-center text-2xl font-bold font-manrope tracking-wider',
                        CELL_TEXT[status],
                        // ── Surface ──────────────────────────────────────────────────
                        'bg-white/[0.05]',
                        'border-[1.5px]',
                        CELL_BORDER[status],
                        // ── Transitions ──────────────────────────────────────────────
                        'transition-all duration-150',
                        // ── Focus ────────────────────────────────────────────────────
                        'focus:outline-none',
                        status === 'idle'
                            ? 'focus:border-atlas-blue focus:[box-shadow:0_0_0_3px_rgba(46,119,255,0.25)]'
                            : '',
                        // ── Disabled ─────────────────────────────────────────────────
                        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-text',
                    ].join(' ')}
                    style={status !== 'idle' && digit ? { boxShadow: CELL_SHADOW[status] } : undefined}
                />
            ))}
        </div>
    );
};

export default OtpInput;
