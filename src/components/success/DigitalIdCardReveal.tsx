// src/components/success/DigitalIdCardReveal.tsx
// Animation wrapper that orchestrates the 3-phase reveal sequence:
//   Phase 1: Card rises + fades in (0–0.6s)
//   Phase 2: Card flips 360° with glow burst (0.3–0.9s)
//   Phase 3: Lock-badge drops in from top, shimmer sweeps (0.8s+)

import React, { useState, useEffect } from 'react';
import { DigitalIdCard, type DigitalIdCardData } from './DigitalIdCard';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DigitalIdCardRevealProps {
    readonly data: DigitalIdCardData;
    readonly className?: string;
    /** Delay before the animation starts, in ms (default: 200) */
    readonly delay?: number;
}

// ─── Phase tracker ─────────────────────────────────────────────────────────────

type RevealPhase = 'hidden' | 'rising' | 'flipping' | 'revealed';

const PHASE_DELAYS: Record<RevealPhase, number> = {
    hidden: 0,
    rising: 0,
    flipping: 350,
    revealed: 900,
};

// ─── DigitalIdCardReveal ───────────────────────────────────────────────────────

export const DigitalIdCardReveal: React.FC<DigitalIdCardRevealProps> = ({
    data, className = '', delay = 200,
}) => {
    const [phase, setPhase] = useState<RevealPhase>('hidden');

    // Sequence phases with delays
    useEffect(() => {
        const t0 = setTimeout(() => setPhase('rising'), delay + PHASE_DELAYS.rising);
        const t1 = setTimeout(() => setPhase('flipping'), delay + PHASE_DELAYS.flipping);
        const t2 = setTimeout(() => setPhase('revealed'), delay + PHASE_DELAYS.revealed);
        return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
    }, [delay]);

    return (
        <div
            className={`relative ${className}`}
            style={{ perspective: '1200px' }}
            aria-live="polite"
            aria-label="Your AtlasID card is ready"
        >
            {/* ── Glow burst behind the card ────────────────────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% 60%, rgba(46,119,255,0.22) 0%, transparent 70%)',
                    opacity: phase === 'revealed' ? 1 : 0,
                    transition: 'opacity 0.8s ease',
                }}
                aria-hidden="true"
            />

            {/* ── Orbiting particle ring ────────────────────────────────────── */}
            {phase === 'revealed' && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    aria-hidden="true"
                >
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-atlas-blue/50"
                            style={{
                                transform: `rotate(${deg}deg) translateX(calc(50% + 8px))`,
                                animation: `particleOrbit 6s linear ${i * 0.15}s infinite`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* ── The card itself ──────────────────────────────────────────── */}
            <div
                style={{
                    transformStyle: 'preserve-3d',
                    // Phase-based transforms
                    opacity: phase === 'hidden' ? 0 : 1,
                    transform: phase === 'hidden'
                        ? 'translateY(40px) scale(0.88)'
                        : phase === 'rising'
                            ? 'translateY(0px) scale(0.95)'
                            : phase === 'flipping'
                                ? 'translateY(0px) scale(1) rotateY(360deg)'
                                : 'translateY(0px) scale(1) rotateY(360deg)',
                    transition: phase === 'hidden' ? 'none'
                        : phase === 'rising' ? 'opacity 0.45s ease, transform 0.50s cubic-bezier(0.22,1,0.36,1)'
                            : phase === 'flipping' ? 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)'
                                : 'transform 0s',
                }}
            >
                <DigitalIdCard data={data} shimmer={phase === 'revealed'} />
            </div>

            {/* ── Verified stamp — drops in after card settles ──────────────── */}
            {phase === 'revealed' && (
                <div
                    className="absolute -top-4 -right-4 z-30"
                    style={{ animation: 'stampIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
                    aria-hidden="true"
                >
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(34,197,94,0.10))',
                            border: '2px solid rgba(34,197,94,0.50)',
                            boxShadow: '0 0 20px rgba(34,197,94,0.30)',
                        }}
                    >
                        <span className="material-symbols-outlined text-status-success text-2xl">
                            verified
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DigitalIdCardReveal;
