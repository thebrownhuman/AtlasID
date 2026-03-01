// src/components/success/SuccessScreen.tsx
// Full success screen: ambient layout, card reveal, countdown ring, CTA.
// Used after both login verification AND sign-up completion.

import React, { useMemo } from 'react';
import { DigitalIdCardReveal } from './DigitalIdCardReveal';
import { useAutoRedirectCountdown } from '../../hooks/useAutoRedirectCountdown';
import type { DigitalIdCardData } from './DigitalIdCard';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SuccessScreenProps {
    /** Data to display on the digital ID card */
    readonly cardData?: Partial<DigitalIdCardData>;
    /** Seconds before auto-redirect (default: 8) */
    readonly countdownSeconds?: number;
    /** Called when redirect fires (auto or manual) */
    readonly onRedirect: () => void;
    /** Headline text (default: "Your AtlasID is ready") */
    readonly headline?: string;
    /** Subtext */
    readonly subtext?: string;
    readonly className?: string;
}

// ─── Countdown ring (SVG arc) ──────────────────────────────────────────────────

interface CountdownRingProps {
    readonly secondsLeft: number;
    readonly progress: number;
    readonly cancelled: boolean;
    readonly onCancel: () => void;
    readonly onNow: () => void;
}

const R = 26;
const CIRC = 2 * Math.PI * R;

const CountdownRing: React.FC<CountdownRingProps> = ({
    secondsLeft, progress, cancelled, onCancel, onNow,
}) => (
    <div className="flex flex-col items-center gap-2">
        <div className="relative w-16 h-16">
            <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90" aria-hidden="true">
                {/* Track */}
                <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                {/* Progress arc */}
                <circle
                    cx="32" cy="32" r={R}
                    fill="none"
                    stroke={cancelled ? 'rgba(255,255,255,0.20)' : 'rgba(46,119,255,0.80)'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    strokeDashoffset={CIRC * (1 - progress)}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
            </svg>
            {/* Number inside ring */}
            <span
                className="absolute inset-0 flex items-center justify-center font-manrope font-bold text-white text-lg tabular-nums"
                aria-live="polite"
                aria-label={cancelled ? 'Countdown cancelled' : `Redirecting in ${secondsLeft} seconds`}
            >
                {cancelled ? '—' : secondsLeft}
            </span>
        </div>

        <p className="text-label text-white/45 text-center">
            {cancelled
                ? 'Auto-redirect cancelled'
                : `Redirecting to dashboard in ${secondsLeft}s`}
        </p>

        <div className="flex items-center gap-3">
            <button
                onClick={onNow}
                className="px-5 py-2.5 rounded-control bg-atlas-blue text-white text-body-sm font-semibold
                   shadow-btn-primary hover:bg-atlas-blue-dim hover:shadow-glow-blue-md
                   transition-all duration-200 active:scale-[0.97]"
            >
                Go to Dashboard
            </button>
            {!cancelled && (
                <button
                    onClick={onCancel}
                    className="text-body-sm text-white/40 hover:text-white/70 transition-colors duration-150"
                >
                    Cancel
                </button>
            )}
        </div>
    </div>
);

// ─── Default card data ─────────────────────────────────────────────────────────

const DEMO_CARD: DigitalIdCardData = {
    fullName: 'Alex Chen',
    idNumber: 'ATL-2026-884921',
    email: 'alex@atlasid.com',
    initials: 'AC',
    issuedDate: new Date().toISOString().slice(0, 10),
    expiryDate: new Date(Date.now() + 365 * 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
};

// ─── SuccessScreen ─────────────────────────────────────────────────────────────

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
    cardData,
    countdownSeconds = 8,
    onRedirect,
    headline = 'Your AtlasID is ready',
    subtext = 'Your global identity has been verified and your digital ID has been issued.',
    className = '',
}) => {
    const mergedCard = useMemo<DigitalIdCardData>(() => ({
        ...DEMO_CARD,
        ...cardData,
    }), [cardData]);

    const countdown = useAutoRedirectCountdown({
        seconds: countdownSeconds,
        onRedirect,
    });

    return (
        <div
            className={`
        relative min-h-screen flex flex-col items-center justify-center
        px-4 py-12 overflow-hidden
        ${className}
      `}
            style={{ background: '#060810' }}
        >
            {/* ── Background ambient glows ────────────────────────────────── */}
            <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(46,119,255,0.08) 0%, transparent 65%)' }}
                aria-hidden="true"
            />
            <div
                className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)' }}
                aria-hidden="true"
            />

            {/* ── Main content ─────────────────────────────────────────────── */}
            <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">

                {/* Success header */}
                <div
                    className="flex flex-col items-center gap-3 text-center animate-fade-slide-up"
                    style={{ animationDelay: '0ms' }}
                >
                    {/* Verified shield + sparkle ring */}
                    <div className="relative">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center"
                            style={{
                                background: 'rgba(34,197,94,0.12)',
                                border: '1px solid rgba(34,197,94,0.30)',
                                boxShadow: '0 0 32px rgba(34,197,94,0.18)',
                            }}
                        >
                            <span className="material-symbols-outlined text-status-success text-3xl" aria-hidden="true">
                                verified_user
                            </span>
                        </div>
                        {/* Sparkle dots */}
                        {[0, 72, 144, 216, 288].map((deg, i) => (
                            <div
                                key={i}
                                className="absolute w-1.5 h-1.5 rounded-full bg-status-success/60"
                                style={{
                                    top: '50%', left: '50%',
                                    transform: `rotate(${deg}deg) translateX(32px) translateY(-50%)`,
                                    animation: `sparkle 2s ease ${i * 0.12}s infinite`,
                                }}
                                aria-hidden="true"
                            />
                        ))}
                    </div>

                    <div>
                        <h1 className="text-display-2 font-bold text-white">{headline}</h1>
                        <p className="text-body-sm text-white/55 mt-2 leading-relaxed max-w-xs">
                            {subtext}
                        </p>
                    </div>
                </div>

                {/* Digital ID Card */}
                <DigitalIdCardReveal
                    data={mergedCard}
                    delay={300}
                    className="w-full"
                />

                {/* Countdown + CTA */}
                <div
                    className="animate-fade-slide-up w-full flex flex-col items-center"
                    style={{ animationDelay: '1200ms' }}
                >
                    <CountdownRing
                        secondsLeft={countdown.secondsLeft}
                        progress={countdown.progress}
                        cancelled={countdown.isCancelled}
                        onCancel={countdown.cancel}
                        onNow={onRedirect}
                    />
                </div>

            </div>
        </div>
    );
};

export default SuccessScreen;
