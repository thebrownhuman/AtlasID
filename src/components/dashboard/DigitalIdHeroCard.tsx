// src/components/dashboard/DigitalIdHeroCard.tsx
// Large featured card summarizing the user's digital identity status.
// Uses the same token system as DigitalIdCard but with dashboard-sized layout.

import React from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DigitalIdHeroCardProps {
    readonly fullName: string;
    readonly idNumber: string;
    readonly email: string;
    readonly initials: string;
    readonly issuedDate: string;
    readonly expiryDate: string;
    readonly verifyScore?: number;   // 0–100
    readonly className?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
    try {
        return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            .format(new Date(iso));
    } catch { return iso; }
}

function scoreColor(score: number): string {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
}

// ─── ScoreRing ─────────────────────────────────────────────────────────────────

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
    const R = 20;
    const circ = 2 * Math.PI * R;
    const dash = circ * (score / 100);
    return (
        <div className="relative w-14 h-14 flex-shrink-0">
            <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90" aria-hidden="true">
                <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle
                    cx="28" cy="28" r={R} fill="none"
                    stroke={scoreColor(score)} strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circ - dash}`}
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                />
            </svg>
            <span
                className="absolute inset-0 flex items-center justify-center font-manrope font-bold text-white text-sm"
                aria-label={`Identity score: ${score} out of 100`}
            >
                {score}
            </span>
        </div>
    );
};

// ─── DigitalIdHeroCard ─────────────────────────────────────────────────────────

export const DigitalIdHeroCard: React.FC<DigitalIdHeroCardProps> = ({
    fullName, idNumber, email, initials, issuedDate, expiryDate,
    verifyScore = 94, className = '',
}) => (
    <article
        className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 ${className}`}
        aria-label="Your AtlasID identity summary"
        style={{
            background: 'linear-gradient(135deg, #0d1529 0%, #122044 50%, #0a1830 100%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.60), 0 0 0 1px rgba(46,119,255,0.12)',
        }}
    >
        {/* Ambient glow */}
        <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(46,119,255,0.14) 0%, transparent 70%)' }}
            aria-hidden="true"
        />

        {/* Holographic top bar */}
        <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(46,119,255,0.70), rgba(91,154,255,0.40), transparent)' }}
            aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Left: avatar + name */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                    className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center
                     font-manrope font-bold text-xl text-white"
                    style={{
                        background: 'linear-gradient(135deg, rgba(46,119,255,0.40) 0%, rgba(91,154,255,0.20) 100%)',
                        border: '1.5px solid rgba(46,119,255,0.45)',
                        boxShadow: '0 0 20px rgba(46,119,255,0.25)',
                    }}
                    aria-hidden="true"
                >
                    {initials.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex flex-col min-w-0">
                    <span className="font-manrope font-bold text-white text-xl leading-tight truncate">
                        {fullName}
                    </span>
                    <span className="text-body-sm text-white/50 truncate mt-0.5">{email}</span>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
                            style={{
                                background: 'rgba(34,197,94,0.12)',
                                border: '1px solid rgba(34,197,94,0.25)',
                                fontSize: '10px',
                            }}
                        >
                            <span className="material-symbols-outlined text-status-success" style={{ fontSize: '11px' }}>
                                verified
                            </span>
                            <span className="font-manrope font-bold text-status-success tracking-wider">
                                VERIFIED
                            </span>
                        </span>
                        <span className="text-label text-white/35 font-mono">{idNumber}</span>
                    </div>
                </div>
            </div>

            {/* Right: score + dates */}
            <div className="flex items-center gap-6 sm:flex-shrink-0">
                <div className="flex flex-col items-center gap-1">
                    <ScoreRing score={verifyScore} />
                    <span className="text-label text-white/40">ID Score</span>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                        <span className="text-label text-white/35 uppercase tracking-widest" style={{ fontSize: '8px' }}>
                            Issued
                        </span>
                        <span className="text-body-sm font-semibold text-white">{formatDate(issuedDate)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-label text-white/35 uppercase tracking-widest" style={{ fontSize: '8px' }}>
                            Valid through
                        </span>
                        <span className="text-body-sm font-semibold text-white">{formatDate(expiryDate)}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Action row */}
        <div className="relative z-10 flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.07]">
            {[
                { icon: 'download', label: 'Download PDF' },
                { icon: 'share', label: 'Share ID' },
                { icon: 'qr_code_2', label: 'Show QR' },
            ].map(({ icon, label }) => (
                <button
                    key={label}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-control text-label font-medium
                     border border-white/[0.10] bg-white/[0.04]
                     hover:bg-white/[0.08] hover:text-white text-white/55
                     transition-all duration-150"
                >
                    <span className="material-symbols-outlined text-base" aria-hidden="true">{icon}</span>
                    <span className="hidden sm:block">{label}</span>
                </button>
            ))}
        </div>
    </article>
);

export default DigitalIdHeroCard;
