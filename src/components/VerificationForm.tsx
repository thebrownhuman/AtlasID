// src/components/VerificationForm.tsx
// Full OTP verification screen — header, OtpInput row, ResendTimer, states.
// Reusable for both desktop (standalone card) and mobile (full-screen).

import React, { useState, useCallback, useId } from 'react';
import { OtpInput } from './OtpInput';
import { useResendTimer } from '../hooks/useResendTimer';
import {
    OTP_DIGIT_COUNT,
    OTP_RESEND_COOLDOWN,
    OTP_MAX_ATTEMPTS,
    OTP_MASKED_EMAIL,
    OTP_VALIDITY_MINUTES,
} from '../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type VerificationState = 'idle' | 'verifying' | 'error' | 'success';

interface VerificationFormProps {
    /** Masked destination to show user (e.g. "j***@atlasid.com") */
    readonly maskedEmail?: string;
    /** Called when all digits filled AND verification succeeds */
    readonly onSuccess?: () => void;
    /** Called when user wants to go back */
    readonly onBack?: () => void;
    /** Override internal verify logic for testing/integration */
    readonly onVerify?: (otp: string) => Promise<boolean>;
    /** Override internal resend logic */
    readonly onResend?: () => Promise<void>;
    readonly className?: string;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
    <span
        className={`inline-block rounded-full border-2 border-white/25 border-t-white animate-spin
                ${size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'}`}
        aria-hidden="true"
    />
);

interface ResendRowProps {
    readonly secondsLeft: number;
    readonly canResend: boolean;
    readonly isExhausted: boolean;
    readonly isResending: boolean;
    readonly attemptsMade: number;
    readonly maxAttempts: number;
    readonly onResend: () => void;
}

const ResendRow: React.FC<ResendRowProps> = ({
    secondsLeft, canResend, isExhausted, isResending, attemptsMade, maxAttempts, onResend,
}) => (
    <div className="flex flex-col items-center gap-1 text-center">
        {isExhausted ? (
            <p className="text-body-sm text-status-error">
                Maximum resend attempts reached. Please{' '}
                <a href="#support" className="text-text-link hover:text-white underline transition-colors">
                    contact support
                </a>.
            </p>
        ) : (
            <>
                <p className="text-body-sm text-white/50">
                    Didn't receive the code?{' '}
                    {canResend ? (
                        <button
                            type="button"
                            onClick={onResend}
                            disabled={isResending}
                            className="text-text-link hover:text-white font-medium transition-colors duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                        >
                            {isResending ? (
                                <><LoadingSpinner size="sm" /> Sending…</>
                            ) : (
                                'Resend code'
                            )}
                        </button>
                    ) : (
                        <span className="text-white/40">
                            Resend in{' '}
                            <span className="tabular-nums text-white/70 font-semibold">
                                {secondsLeft}s
                            </span>
                        </span>
                    )}
                </p>
                {attemptsMade > 0 && (
                    <p className="text-label text-white/35">
                        {maxAttempts - attemptsMade} resend{maxAttempts - attemptsMade !== 1 ? 's' : ''} remaining
                    </p>
                )}
            </>
        )}
    </div>
);

// ─── Success overlay ───────────────────────────────────────────────────────────

const SuccessOverlay: React.FC = () => (
    <div className="flex flex-col items-center gap-5 py-6 text-center animate-fade-slide-up">
        <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.30)' }}
        >
            {/* Outer pulse ring */}
            <div
                className="absolute inset-0 rounded-full glow-pulse"
                style={{ boxShadow: '0 0 0 8px rgba(34,197,94,0.08)' }}
                aria-hidden="true"
            />
            <span className="material-symbols-outlined text-4xl text-status-success" aria-hidden="true">
                verified_user
            </span>
        </div>

        <div>
            <h3 className="text-display-3 font-bold text-white">Identity verified</h3>
            <p className="text-body-sm text-white/60 mt-1.5 leading-relaxed">
                Your email has been confirmed. Redirecting&nbsp;you now…
            </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-pill bg-white/10 overflow-hidden">
            <div
                className="h-full rounded-pill bg-status-success"
                style={{ animation: 'progressFill 2.5s ease forwards' }}
                aria-hidden="true"
            />
        </div>
    </div>
);

// ─── VerificationForm ──────────────────────────────────────────────────────────

export const VerificationForm: React.FC<VerificationFormProps> = ({
    maskedEmail = OTP_MASKED_EMAIL,
    onSuccess,
    onBack,
    onVerify,
    onResend,
    className = '',
}) => {
    const formId = useId();
    const [state, setState] = useState<VerificationState>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [otpValue, setOtpValue] = useState('');

    // ── Verify logic ────────────────────────────────────────────────────────────
    const verify = useCallback(async (otp: string) => {
        setState('verifying');
        setErrorMsg(null);
        try {
            const ok = onVerify
                ? await onVerify(otp)
                : await new Promise<boolean>(res => setTimeout(() => res(otp !== '000000'), 1800));

            if (ok) {
                setState('success');
                setTimeout(() => onSuccess?.(), 2600);
            } else {
                setState('error');
                setErrorMsg('Incorrect code. Please try again.');
            }
        } catch {
            setState('error');
            setErrorMsg('Something went wrong. Please try again.');
        }
    }, [onSuccess, onVerify]);

    // ── Resend logic ────────────────────────────────────────────────────────────
    const defaultResend = useCallback(async () => {
        await new Promise(res => setTimeout(res, 800));
    }, []);

    const timer = useResendTimer(onResend ?? defaultResend, {
        initialSeconds: OTP_RESEND_COOLDOWN,
        maxAttempts: OTP_MAX_ATTEMPTS,
    });

    // ── OTP complete callback ───────────────────────────────────────────────────
    const handleOtpComplete = useCallback((otp: string) => {
        setOtpValue(otp);
        verify(otp);
    }, [verify]);

    // ── Manual submit (if user presses the button before auto-complete) ─────────
    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (otpValue.length === OTP_DIGIT_COUNT && state === 'idle') {
            verify(otpValue);
        }
    }, [otpValue, state, verify]);

    const otpStatus = state === 'error' ? 'error' : state === 'success' ? 'success' : 'idle';
    const isLocked = state === 'verifying' || state === 'success';

    return (
        <section
            className={`flex flex-col gap-6 ${className}`}
            aria-label="Email verification"
            aria-live="polite"
        >
            {/* ── Header ────────────────────────────────────────────────────────── */}
            {state !== 'success' && (
                <header className="flex flex-col gap-2">
                    {/* Shield icon */}
                    <div
                        className="w-12 h-12 rounded-control flex items-center justify-center mb-1"
                        style={{ background: 'rgba(46,119,255,0.12)', border: '1px solid rgba(46,119,255,0.25)' }}
                        aria-hidden="true"
                    >
                        <span className="material-symbols-outlined text-2xl text-atlas-blue">
                            mark_email_read
                        </span>
                    </div>

                    <h2 className="text-display-3 font-bold text-white">Verify your email</h2>
                    <p className="text-body-sm text-white/60 leading-relaxed">
                        We've sent a {OTP_DIGIT_COUNT}-digit verification code to{' '}
                        <span className="text-white/85 font-medium">{maskedEmail}</span>.
                        {' '}The code is valid for {OTP_VALIDITY_MINUTES} minutes.
                    </p>
                </header>
            )}

            {/* ── Success state ─────────────────────────────────────────────────── */}
            {state === 'success' ? (
                <SuccessOverlay />
            ) : (
                <form
                    id={`${formId}-otp-form`}
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-6"
                    aria-describedby={errorMsg ? `${formId}-error` : undefined}
                >
                    {/* ── OTP boxes ───────────────────────────────────────────────── */}
                    <div className="flex flex-col gap-3">
                        <OtpInput
                            length={OTP_DIGIT_COUNT}
                            status={otpStatus}
                            autoFocus
                            disabled={isLocked}
                            onComplete={handleOtpComplete}
                        />

                        {/* Error message */}
                        {state === 'error' && errorMsg && (
                            <p
                                id={`${formId}-error`}
                                role="alert"
                                className="flex items-center gap-1.5 text-body-sm text-status-error animate-fade-slide-up"
                            >
                                <span className="material-symbols-outlined text-base" aria-hidden="true">error</span>
                                {errorMsg}
                            </p>
                        )}
                    </div>

                    {/* ── Submit / verifying button ────────────────────────────────── */}
                    <button
                        type="submit"
                        disabled={isLocked || otpValue.length < OTP_DIGIT_COUNT}
                        aria-disabled={isLocked || otpValue.length < OTP_DIGIT_COUNT}
                        className="w-full flex items-center justify-center gap-2
                       px-7 py-3.5 rounded-control
                       bg-atlas-blue text-white font-semibold text-body-md
                       shadow-btn-primary
                       hover:bg-atlas-blue-dim hover:shadow-glow-blue-md
                       active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
                       transition-all duration-200
                       focus-visible:outline-none focus-visible:shadow-glow-blue-sm"
                    >
                        {state === 'verifying' ? (
                            <><LoadingSpinner /> <span>Verifying…</span></>
                        ) : (
                            <>
                                <span>Verify Code</span>
                                <span className="material-symbols-outlined text-lg" aria-hidden="true">
                                    arrow_forward
                                </span>
                            </>
                        )}
                    </button>

                    {/* ── Resend section ───────────────────────────────────────────── */}
                    <ResendRow
                        secondsLeft={timer.secondsLeft}
                        canResend={timer.canResend}
                        isExhausted={timer.isExhausted}
                        isResending={timer.isResending}
                        attemptsMade={timer.attemptsMade}
                        maxAttempts={timer.maxAttempts}
                        onResend={timer.handleResend}
                    />

                    {/* ── Back link ────────────────────────────────────────────────── */}
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex items-center justify-center gap-1.5
                         text-body-sm text-white/45 hover:text-white
                         transition-colors duration-150 group"
                        >
                            <span
                                className="material-symbols-outlined text-base group-hover:-translate-x-0.5 transition-transform"
                                aria-hidden="true"
                            >
                                arrow_back
                            </span>
                            Back to login
                        </button>
                    )}
                </form>
            )}

            {/* ── Security note ─────────────────────────────────────────────────── */}
            {state !== 'success' && (
                <p className="flex items-center justify-center gap-1.5 text-label text-white/30">
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">lock</span>
                    © {new Date().getFullYear()} AtlasID Inc. All rights reserved.
                </p>
            )}
        </section>
    );
};

export default VerificationForm;
