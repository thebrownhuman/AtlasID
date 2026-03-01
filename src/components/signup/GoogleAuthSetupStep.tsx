// src/components/signup/GoogleAuthSetupStep.tsx
// Step 4 of 5 — Google Authenticator 2FA setup with QR code + TOTP verification.
// Based on Stitch 4K design: "AtlasID 2FA Setup Step".

import React, { useState, useCallback } from 'react';
import { OtpInput } from '../OtpInput';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface GoogleAuthSetupStepProps {
    readonly onVerified: () => void;
    readonly onSkip?: () => void;
    readonly onBack?: () => void;
    readonly className?: string;
}

// ─── Manual key display ────────────────────────────────────────────────────────

const SETUP_KEY = 'JBSWY3DP EHPK3PXP';

const ManualKeySection: React.FC = () => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={() => setExpanded(p => !p)}
                className="flex items-center gap-1.5 text-body-sm text-atlas-blue hover:text-white transition-colors duration-150 self-center"
            >
                <span className="material-symbols-outlined text-base" aria-hidden="true">
                    {expanded ? 'expand_less' : 'expand_more'}
                </span>
                Or enter setup key manually
            </button>
            {expanded && (
                <div
                    className="flex items-center gap-3 px-4 py-3 rounded-control animate-fade-slide-up"
                    style={{ background: 'rgba(46,119,255,0.07)', border: '1px solid rgba(46,119,255,0.18)' }}
                >
                    <span className="material-symbols-outlined text-atlas-blue text-lg flex-shrink-0" aria-hidden="true">key</span>
                    <code className="font-mono text-sm text-white/80 tracking-widest select-all flex-1">{SETUP_KEY}</code>
                    <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(SETUP_KEY.replace(/\s/g, ''))}
                        className="text-white/40 hover:text-white transition-colors"
                        aria-label="Copy setup key"
                    >
                        <span className="material-symbols-outlined text-base">content_copy</span>
                    </button>
                </div>
            )}
        </div>
    );
};

// ─── QRCode placeholder ────────────────────────────────────────────────────────

const QRCodePlaceholder: React.FC = () => (
    <div className="flex flex-col items-center gap-3">
        <div
            className="w-44 h-44 rounded-xl flex flex-col items-center justify-center gap-2 relative overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.96)',
                border: '2px solid rgba(46,119,255,0.50)',
                boxShadow: '0 0 32px rgba(46,119,255,0.20)',
            }}
            aria-label="QR Code for Google Authenticator"
        >
            {/* Simulated QR pattern */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, padding: 8 }}>
                {Array.from({ length: 49 }, (_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 8, height: 8,
                            background: [0, 1, 2, 6, 7, 8, 14, 21, 28, 35, 42, 43, 44, 48, 47, 46, 40, 41, 36, 37, 22, 23, 24, 25, 26, 27, 15, 16, 17].includes(i)
                                ? '#060810' : 'transparent',
                            borderRadius: 1,
                        }}
                    />
                ))}
            </div>
            <div
                className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(46,119,255,0.15)', border: '1px solid rgba(46,119,255,0.35)' }}
            >
                <span className="material-symbols-outlined text-atlas-blue text-sm" aria-hidden="true">lock</span>
            </div>
        </div>
        <p className="text-label text-white/40 text-center">
            Scan with Google Authenticator or Authy
        </p>
    </div>
);

// ─── GoogleAuthSetupStep ───────────────────────────────────────────────────────

type VerifyState = 'idle' | 'verifying' | 'error' | 'success';

export const GoogleAuthSetupStep: React.FC<GoogleAuthSetupStepProps> = ({
    onVerified, onSkip, onBack, className = '',
}) => {
    const [state, setState] = useState<VerifyState>('idle');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleComplete = useCallback(async (code: string) => {
        setState('verifying');
        setErrorMsg(null);
        // Simulate TOTP verification — accept any 6-digit code except 000000
        await new Promise(res => setTimeout(res, 1400));
        if (code !== '000000') {
            setState('success');
            setTimeout(() => onVerified(), 1200);
        } else {
            setState('error');
            setErrorMsg('Incorrect code. Check the app and try again.');
        }
    }, [onVerified]);

    return (
        <section className={`flex flex-col gap-6 ${className}`} aria-label="Google Authenticator setup">
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <header className="flex flex-col gap-1">
                <div
                    className="w-12 h-12 rounded-control flex items-center justify-center mb-1"
                    style={{ background: 'rgba(46,119,255,0.12)', border: '1px solid rgba(46,119,255,0.25)' }}
                    aria-hidden="true"
                >
                    <span className="material-symbols-outlined text-2xl text-atlas-blue">smartphone</span>
                </div>
                <h3 className="text-display-3 font-bold text-white">Set up 2FA</h3>
                <p className="text-body-sm text-white/55 leading-relaxed">
                    Scan the QR code with{' '}
                    <span className="text-white/80 font-medium">Google Authenticator</span>{' '}
                    to protect your account with two-factor authentication.
                </p>
            </header>

            {/* ── 3-step instructions ──────────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
                {[
                    { step: '1', text: 'Install Google Authenticator on your phone' },
                    { step: '2', text: 'Tap + and scan the QR code below' },
                    { step: '3', text: 'Enter the 6-digit code shown in the app' },
                ].map(({ step, text }) => (
                    <div key={step} className="flex items-center gap-3">
                        <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-atlas-blue flex-shrink-0"
                            style={{ background: 'rgba(46,119,255,0.12)', border: '1px solid rgba(46,119,255,0.25)' }}
                        >{step}</span>
                        <p className="text-body-sm text-white/60">{text}</p>
                    </div>
                ))}
            </div>

            {/* ── QR Code ────────────────────────────────────────────────────── */}
            <QRCodePlaceholder />
            <ManualKeySection />

            <hr className="border-white/[0.08]" />

            {/* ── TOTP Input ─────────────────────────────────────────────────── */}
            {state === 'success' ? (
                <div className="flex flex-col items-center gap-4 py-2 animate-fade-slide-up">
                    <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.30)' }}
                    >
                        <span className="material-symbols-outlined text-3xl text-status-success">verified_user</span>
                    </div>
                    <div className="text-center">
                        <p className="text-body-md font-bold text-white">2FA Enabled!</p>
                        <p className="text-body-sm text-white/50 mt-1">Your account is now protected.</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <p className="text-label font-semibold text-white/55 uppercase tracking-widest text-center">
                        Enter the 6-digit code from your app
                    </p>
                    <OtpInput
                        length={6}
                        status={state === 'error' ? 'error' : 'idle'}
                        autoFocus
                        disabled={state === 'verifying'}
                        onComplete={handleComplete}
                    />
                    {state === 'error' && errorMsg && (
                        <p role="alert" className="flex items-center gap-1.5 text-body-sm text-status-error animate-fade-slide-up justify-center">
                            <span className="material-symbols-outlined text-base" aria-hidden="true">error</span>
                            {errorMsg}
                        </p>
                    )}
                    {state === 'verifying' && (
                        <p className="text-body-sm text-white/40 text-center animate-pulse">Verifying code…</p>
                    )}
                </div>
            )}

            {/* ── Security note ────────────────────────────────────────────── */}
            <p className="flex items-center justify-center gap-1.5 text-label text-white/30">
                <span className="material-symbols-outlined text-sm" aria-hidden="true">lock</span>
                Protected by TOTP (RFC 6238) — time-based one-time passwords
            </p>

            {/* ── Footer: Back + Skip ───────────────────────────────────── */}
            <footer className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={state === 'verifying' || state === 'success'}
                        className="flex items-center gap-1.5 px-5 py-3 rounded-control
                                   border border-white/[0.12] text-white/65 text-body-sm font-semibold
                                   hover:text-white hover:border-white/25 hover:bg-white/[0.04]
                                   transition-all duration-200 disabled:opacity-40"
                    >
                        <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_back</span>
                        Back
                    </button>
                )}

                <div className="flex-1" />

                {onSkip && state !== 'success' && (
                    <button
                        type="button"
                        onClick={onSkip}
                        className="text-body-sm text-white/30 hover:text-white/60 transition-colors"
                    >
                        Set up later (not recommended)
                    </button>
                )}
            </footer>
        </section>
    );
};

export default GoogleAuthSetupStep;
