// src/components/dashboard/ChangePasswordModal.tsx
// Premium 3-step change password modal: (1) New password, (2) Email OTP, (3) Google Auth TOTP.
// Redesigned with larger OTP boxes, glowing icon pills, countdown timer, blue-border info cards.

import React, { useState, useCallback, useEffect } from 'react';
import { OtpInput } from '../OtpInput';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ChangePasswordModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly maskedEmail?: string;
}

type ModalStep = 'password' | 'otp' | 'totp' | 'success';

// ─── Password Strength ────────────────────────────────────────────────────────

function getStrength(pw: string): 0 | 1 | 2 | 3 {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score as 0 | 1 | 2 | 3;
}

const STRENGTH_LABEL: Record<0 | 1 | 2 | 3, string> = { 0: '', 1: 'Weak', 2: 'Fair', 3: 'Strong' };
const STRENGTH_COLOR: Record<0 | 1 | 2 | 3, string> = {
    0: 'bg-white/10', 1: 'bg-red-500', 2: 'bg-amber-400', 3: 'bg-emerald-400',
};
const STRENGTH_TEXT: Record<0 | 1 | 2 | 3, string> = {
    0: 'text-white/40', 1: 'text-red-400', 2: 'text-amber-400', 3: 'text-emerald-400',
};

const StrengthMeter: React.FC<{ password: string }> = ({ password }) => {
    const level = getStrength(password);
    if (!password) return null;
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex gap-1.5">
                {([1, 2, 3] as const).map(i => (
                    <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= level ? STRENGTH_COLOR[level] : 'bg-white/10'
                            }`}
                    />
                ))}
            </div>
            <p className={`text-xs font-semibold ${STRENGTH_TEXT[level]}`}>{STRENGTH_LABEL[level]}</p>
        </div>
    );
};

// ─── Password Requirements ────────────────────────────────────────────────────

const REQUIREMENTS = [
    { id: 'len', label: '8+ characters', check: (pw: string) => pw.length >= 8 },
    { id: 'upper', label: '1 uppercase', check: (pw: string) => /[A-Z]/.test(pw) },
    { id: 'num', label: '1 number', check: (pw: string) => /[0-9]/.test(pw) },
    { id: 'special', label: '1 special char', check: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

const RequirementsChecklist: React.FC<{ password: string }> = ({ password }) => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {REQUIREMENTS.map(({ id, label, check }) => {
            const met = check(password);
            return (
                <div key={id} className="flex items-center gap-1.5">
                    <span
                        className={`material-symbols-outlined text-sm transition-colors duration-200 ${met ? 'text-emerald-400' : 'text-white/20'
                            }`}
                        aria-hidden="true"
                    >
                        {met ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span className={`text-xs transition-colors duration-200 ${met ? 'text-white/70' : 'text-white/35'}`}>
                        {label}
                    </span>
                </div>
            );
        })}
    </div>
);

// ─── Shared Modal Shell ───────────────────────────────────────────────────────

interface ModalShellProps {
    step: number;
    iconName: string;
    title: string;
    subtitle: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const ModalShell: React.FC<ModalShellProps> = ({ step, iconName, title, subtitle, onClose, children, footer }) => (
    <div className="flex flex-col gap-6">
        {/* Header row */}
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                {/* Icon pill */}
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                        background: 'rgba(46,119,255,0.12)',
                        border: '1px solid rgba(46,119,255,0.30)',
                        boxShadow: '0 0 20px rgba(46,119,255,0.15)',
                    }}
                >
                    <span className="material-symbols-outlined text-[#2e77ff] text-xl">{iconName}</span>
                </div>
                {/* Titles inline */}
                <div>
                    <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
                    <p className="text-white/50 text-sm leading-snug mt-0.5">{subtitle}</p>
                </div>
            </div>
            {/* Top-right row: step counter + close */}
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className="text-xs font-semibold text-white/30 tracking-widest uppercase whitespace-nowrap">
                    Step {step} of 3
                </span>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-lg
                               text-white/30 hover:text-white hover:bg-white/[0.07]
                               transition-all duration-150"
                    aria-label="Close"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                </button>
            </div>
        </div>

        {/* Step content */}
        {children}

        {/* Footer */}
        {footer}
    </div>
);

// ─── Step Dots ────────────────────────────────────────────────────────────────

const StepDots: React.FC<{ current: ModalStep }> = ({ current }) => {
    const steps: ModalStep[] = ['password', 'otp', 'totp'];
    return (
        <div className="flex justify-center items-center gap-2 pt-2">
            {steps.map(s => (
                <div
                    key={s}
                    className={`rounded-full transition-all duration-300 ${s === current
                            ? 'w-6 h-1.5 bg-[#2e77ff]'
                            : 'w-1.5 h-1.5 bg-white/20'
                        }`}
                />
            ))}
        </div>
    );
};

// ─── Step 1: New Password ─────────────────────────────────────────────────────

const PasswordStep: React.FC<{ onNext: () => void; onClose: () => void }> = ({ onNext, onClose }) => {
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (getStrength(newPw) < 2) { setError('Password is too weak — use uppercase, numbers & symbols.'); return; }
        if (newPw !== confirmPw) { setError('Passwords do not match.'); return; }
        setError('');
        onNext();
    };

    return (
        <ModalShell
            step={1}
            iconName="lock_reset"
            title="Set New Password"
            subtitle="Choose a strong password for your account."
            onClose={onClose}
            footer={<StepDots current="password" />}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* New Password */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/45 uppercase tracking-wider">New Password</label>
                    <div className="relative">
                        <input
                            type={showNew ? 'text' : 'password'}
                            value={newPw}
                            onChange={e => setNewPw(e.target.value)}
                            placeholder="Min. 8 chars, 1 uppercase, 1 number"
                            autoComplete="new-password"
                            className="w-full px-4 py-3.5 pr-12 rounded-xl text-white text-sm
                                       placeholder:text-white/25 transition-all duration-200
                                       focus:outline-none"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.10)',
                            }}
                            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(46,119,255,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46,119,255,0.10)'; }}
                            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.boxShadow = 'none'; }}
                        />
                        <button type="button" onClick={() => setShowNew(p => !p)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors">
                            <span className="material-symbols-outlined text-lg">{showNew ? 'visibility_off' : 'visibility'}</span>
                        </button>
                    </div>
                    {newPw && <StrengthMeter password={newPw} />}
                </div>

                {/* Requirements */}
                {newPw && <RequirementsChecklist password={newPw} />}

                {/* Confirm */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-white/45 uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPw}
                            onChange={e => setConfirmPw(e.target.value)}
                            placeholder="Re-enter your password"
                            autoComplete="new-password"
                            className="w-full px-4 py-3.5 pr-12 rounded-xl text-white text-sm
                                       placeholder:text-white/25 transition-all duration-200
                                       focus:outline-none"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${confirmPw && confirmPw === newPw ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.10)'}`,
                            }}
                            onFocus={e => { if (!(confirmPw && confirmPw === newPw)) { e.currentTarget.style.borderColor = 'rgba(46,119,255,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46,119,255,0.10)'; } }}
                            onBlur={e => { if (!(confirmPw && confirmPw === newPw)) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.boxShadow = 'none'; } }}
                        />
                        <button type="button" onClick={() => setShowConfirm(p => !p)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors">
                            <span className="material-symbols-outlined text-lg">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                        </button>
                    </div>
                    {confirmPw && confirmPw === newPw && (
                        <p className="text-xs text-emerald-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">check_circle</span> Passwords match
                        </p>
                    )}
                </div>

                {error && (
                    <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl text-red-400 text-sm"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)' }}>
                        <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                               text-white font-semibold text-sm transition-all duration-200
                               hover:shadow-[0_0_24px_rgba(46,119,255,0.35)] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #2e77ff, #1a5fd4)' }}
                >
                    Continue to Verification
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
            </form>
        </ModalShell>
    );
};

// ─── Step 2: Email OTP ────────────────────────────────────────────────────────

const OtpStep: React.FC<{ maskedEmail: string; onVerified: () => void; onClose: () => void }> = ({
    maskedEmail, onVerified, onClose,
}) => {
    const [otpState, setOtpState] = useState<'idle' | 'verifying' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [resendSeconds, setResendSeconds] = useState(0);

    const handleComplete = useCallback(async (code: string) => {
        setOtpState('verifying');
        setErrorMsg('');
        await new Promise(res => setTimeout(res, 1200));
        if (code !== '000000') {
            onVerified();
        } else {
            setOtpState('error');
            setErrorMsg('Incorrect code. Try again or resend.');
        }
    }, [onVerified]);

    const handleResend = () => {
        setOtpState('idle');
        setResendSeconds(30);
        const t = setInterval(() => {
            setResendSeconds(s => { if (s <= 1) { clearInterval(t); return 0; } return s - 1; });
        }, 1000);
    };

    return (
        <ModalShell
            step={2}
            iconName="mark_email_read"
            title="Check your email"
            subtitle={`We sent a 6-digit code to ${maskedEmail}`}
            onClose={onClose}
            footer={<StepDots current="otp" />}
        >
            <div className="flex flex-col gap-5">
                {/* Info card */}
                <div
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                    style={{
                        background: 'rgba(46,119,255,0.06)',
                        borderLeft: '3px solid #2e77ff',
                        border: '1px solid rgba(46,119,255,0.15)',
                        borderLeftWidth: '3px',
                    }}
                >
                    <span className="material-symbols-outlined text-[#2e77ff] text-lg flex-shrink-0">info</span>
                    <p className="text-sm text-white/60 leading-snug">
                        Didn't receive it? Check spam or <button type="button" className="text-[#2e77ff] hover:text-white font-medium transition-colors" onClick={handleResend}>resend the code</button>.
                    </p>
                </div>

                {/* OTP */}
                <OtpInput
                    length={6}
                    status={otpState === 'error' ? 'error' : 'idle'}
                    autoFocus
                    disabled={otpState === 'verifying'}
                    onComplete={handleComplete}
                />

                {otpState === 'error' && errorMsg && (
                    <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl text-red-400 text-sm"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)' }}>
                        <span className="material-symbols-outlined text-base">error</span>{errorMsg}
                    </div>
                )}

                {otpState === 'verifying' && (
                    <p className="text-sm text-white/40 text-center animate-pulse">Verifying code…</p>
                )}

                {/* Resend timer */}
                {resendSeconds > 0 && (
                    <p className="text-sm text-white/40 text-center">
                        Resend available in <span className="text-white/70 font-bold tabular-nums">{resendSeconds}s</span>
                    </p>
                )}
            </div>
        </ModalShell>
    );
};

// ─── Step 3: Google Authenticator TOTP ───────────────────────────────────────

const TotpStep: React.FC<{ onConfirmed: () => void; onClose: () => void }> = ({ onConfirmed, onClose }) => {
    const [state, setState] = useState<'idle' | 'verifying' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [codeComplete, setCodeComplete] = useState(false);
    const [seconds, setSeconds] = useState(30);

    // Countdown timer for TOTP refresh
    useEffect(() => {
        const t = setInterval(() => {
            setSeconds(s => s <= 1 ? 30 : s - 1);
        }, 1000);
        return () => clearInterval(t);
    }, []);

    const handleComplete = useCallback(async (code: string) => {
        setCodeComplete(true);
        setState('verifying');
        setErrorMsg('');
        await new Promise(res => setTimeout(res, 1200));
        if (code !== '000000') {
            onConfirmed();
        } else {
            setState('error');
            setErrorMsg('Incorrect authenticator code. Code refreshes every 30 seconds.');
            setCodeComplete(false);
        }
    }, [onConfirmed]);

    const timerPercent = Math.round((seconds / 30) * 100);
    const circumference = 2 * Math.PI * 10; // radius 10

    return (
        <ModalShell
            step={3}
            iconName="smartphone"
            title="Confirm with Authenticator"
            subtitle="Enter the 6-digit code from Google Authenticator."
            onClose={onClose}
            footer={<StepDots current="totp" />}
        >
            <div className="flex flex-col gap-5">
                {/* Info card with timer */}
                <div
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                    style={{
                        background: 'rgba(46,119,255,0.06)',
                        border: '1px solid rgba(46,119,255,0.15)',
                        borderLeftWidth: '3px',
                        borderLeftColor: '#2e77ff',
                    }}
                >
                    <span className="material-symbols-outlined text-[#2e77ff] text-lg flex-shrink-0">smartphone</span>
                    <p className="text-sm text-white/60 flex-1 leading-snug">
                        Open <span className="text-white font-semibold">Google Authenticator</span> and enter the current code for AtlasID.
                    </p>
                    {/* Circular countdown */}
                    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <svg width="28" height="28" viewBox="0 0 28 28">
                            <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                            <circle
                                cx="14" cy="14" r="10"
                                fill="none"
                                stroke="#2e77ff"
                                strokeWidth="2.5"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference * (1 - timerPercent / 100)}
                                strokeLinecap="round"
                                transform="rotate(-90 14 14)"
                                style={{ transition: 'stroke-dashoffset 1s linear' }}
                            />
                            <text x="14" y="18" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.6)" fontFamily="Manrope">{seconds}</text>
                        </svg>
                        <span className="text-[9px] text-white/30 leading-none">sec</span>
                    </div>
                </div>

                {/* OTP */}
                <OtpInput
                    length={6}
                    status={state === 'error' ? 'error' : 'idle'}
                    autoFocus
                    disabled={state === 'verifying'}
                    onComplete={handleComplete}
                />

                {state === 'error' && errorMsg && (
                    <div className="flex items-start gap-2 px-3.5 py-3 rounded-xl text-red-400 text-sm"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)' }}>
                        <span className="material-symbols-outlined text-base flex-shrink-0 mt-0.5">error</span>
                        <span>{errorMsg}</span>
                    </div>
                )}

                {state === 'verifying' && (
                    <p className="text-sm text-white/40 text-center animate-pulse">Confirming with authenticator…</p>
                )}

                {/* CTA button — only visible once code is fully entered */}
                {(codeComplete || state === 'verifying') && state !== 'error' && (
                    <button
                        type="button"
                        disabled={state === 'verifying'}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl
                                   text-white font-semibold text-sm transition-all duration-200
                                   disabled:opacity-50 hover:shadow-[0_0_24px_rgba(46,119,255,0.35)]
                                   active:scale-[0.98]"
                        style={{ background: 'linear-gradient(135deg, #2e77ff, #1a5fd4)' }}
                    >
                        {state === 'verifying' ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Verifying…
                            </>
                        ) : (
                            <>
                                Verify & Change Password
                                <span className="material-symbols-outlined text-base">lock_reset</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </ModalShell>
    );
};

// ─── Success State ────────────────────────────────────────────────────────────

const SuccessState: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="flex flex-col items-center gap-6 py-6 text-center animate-fade-slide-up">
        {/* Animated success ring */}
        <div className="relative">
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                    background: 'radial-gradient(circle, rgba(52,211,153,0.15), rgba(52,211,153,0.05))',
                    border: '1.5px solid rgba(52,211,153,0.35)',
                    boxShadow: '0 0 40px rgba(52,211,153,0.20)',
                }}
            >
                <span className="material-symbols-outlined text-4xl text-emerald-400">check_circle</span>
            </div>
            {/* Pulsing ring */}
            <div
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: 'rgba(52,211,153,0.3)' }}
            />
        </div>
        <div>
            <h3 className="text-2xl font-bold text-white">Password Changed!</h3>
            <p className="text-sm text-white/50 mt-2 leading-relaxed max-w-xs mx-auto">
                Your password has been updated successfully. You'll remain logged in on this device.
            </p>
        </div>
        <button
            type="button"
            onClick={onClose}
            className="px-8 py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200
                       hover:shadow-[0_0_24px_rgba(46,119,255,0.35)] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #2e77ff, #1a5fd4)' }}
        >
            Done
        </button>
    </div>
);

// ─── ChangePasswordModal ───────────────────────────────────────────────────────

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
    isOpen, onClose, maskedEmail = 'j***@atlasid.com',
}) => {
    const [step, setStep] = useState<ModalStep>('password');

    const handleClose = useCallback(() => {
        onClose();
        setTimeout(() => setStep('password'), 300);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(6,8,16,0.88)', backdropFilter: 'blur(10px)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Change password"
        >
            {/* Backdrop click to close */}
            <div className="absolute inset-0" onClick={handleClose} />

            <div
                className="relative w-full max-w-[460px] rounded-2xl p-7 animate-fade-slide-up"
                style={{
                    background: 'rgba(14,18,28,0.97)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.80), 0 0 0 1px rgba(255,255,255,0.04)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {step === 'password' && <PasswordStep onNext={() => setStep('otp')} onClose={handleClose} />}
                {step === 'otp' && <OtpStep maskedEmail={maskedEmail} onVerified={() => setStep('totp')} onClose={handleClose} />}
                {step === 'totp' && <TotpStep onConfirmed={() => setStep('success')} onClose={handleClose} />}
                {step === 'success' && <SuccessState onClose={handleClose} />}
            </div>
        </div>
    );
};

export default ChangePasswordModal;
