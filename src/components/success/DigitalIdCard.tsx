// src/components/success/DigitalIdCard.tsx
// Reusable holographic digital ID card — works standalone or inside the reveal wrapper.
// Accepts user data props so it's fully decoupled from any auth state.

import React from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface DigitalIdCardData {
    readonly fullName: string;
    readonly idNumber: string;
    readonly email: string;
    /** ISO date string YYYY-MM-DD */
    readonly issuedDate: string;
    /** ISO date string YYYY-MM-DD */
    readonly expiryDate: string;
    /** Avatar initials fallback (2 chars) */
    readonly initials: string;
}

interface DigitalIdCardProps {
    readonly data: DigitalIdCardData;
    /** Extra wrapper classes (e.g. width constraints) */
    readonly className?: string;
    /** Apply the holographic shimmer shine overlay */
    readonly shimmer?: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
    try {
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}

// ─── MicroChip SVG ─────────────────────────────────────────────────────────────

const ChipSvg: React.FC = () => (
    <svg width="44" height="34" viewBox="0 0 44 34" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="42" height="32" rx="5" fill="url(#chipGrad)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8" />
        {/* Center contact pads */}
        <rect x="14" y="9" width="16" height="16" rx="2" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
        <line x1="14" y1="17" x2="30" y2="17" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <line x1="22" y1="9" x2="22" y2="25" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        {/* Side contacts */}
        <rect x="1" y="11" width="5" height="3.5" rx="1" fill="rgba(255,255,255,0.08)" />
        <rect x="1" y="19" width="5" height="3.5" rx="1" fill="rgba(255,255,255,0.08)" />
        <rect x="38" y="11" width="5" height="3.5" rx="1" fill="rgba(255,255,255,0.08)" />
        <rect x="38" y="19" width="5" height="3.5" rx="1" fill="rgba(255,255,255,0.08)" />
        <defs>
            <linearGradient id="chipGrad" x1="0" y1="0" x2="44" y2="34" gradientUnits="userSpaceOnUse">
                <stop stopColor="#c9a227" />
                <stop offset="0.5" stopColor="#e8c96a" />
                <stop offset="1" stopColor="#b8911f" />
            </linearGradient>
        </defs>
    </svg>
);

// ─── DigitalIdCard ─────────────────────────────────────────────────────────────

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
    data, className = '', shimmer = true,
}) => (
    <article
        className={`relative overflow-hidden rounded-2xl select-none ${className}`}
        aria-label={`AtlasID digital identity card for ${data.fullName}`}
        style={{
            background: 'linear-gradient(135deg, #0d1529 0%, #122044 45%, #0a1830 100%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.70), 0 0 0 1px rgba(46,119,255,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
    >
        {/* ── Holographic shimmer overlay ─────────────────────────────────── */}
        {shimmer && (
            <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)',
                    animation: 'holographicShine 4s ease-in-out infinite',
                }}
                aria-hidden="true"
            />
        )}

        {/* ── Ambient glow blobs ──────────────────────────────────────────── */}
        <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(46,119,255,0.18) 0%, transparent 70%)' }}
            aria-hidden="true"
        />
        <div
            className="absolute -bottom-14 -left-10 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(91,154,255,0.10) 0%, transparent 70%)' }}
            aria-hidden="true"
        />

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <div className="relative z-20 p-6 flex flex-col gap-5">

            {/* Row 1: Issuer + chip */}
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                        {/* Atlas globe icon */}
                        <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(46,119,255,0.20)', border: '1px solid rgba(46,119,255,0.40)' }}
                            aria-hidden="true"
                        >
                            <span className="material-symbols-outlined text-atlas-blue" style={{ fontSize: '12px' }}>
                                language
                            </span>
                        </div>
                        <span
                            className="font-manrope font-bold tracking-[0.18em] text-white"
                            style={{ fontSize: '11px', letterSpacing: '0.16em' }}
                        >
                            ATLASID
                        </span>
                    </div>
                    <span
                        className="font-manrope text-white/40 tracking-widest"
                        style={{ fontSize: '8px', letterSpacing: '0.22em', marginTop: '1px' }}
                    >
                        GLOBAL IDENTITY NETWORK
                    </span>
                </div>
                <ChipSvg />
            </div>

            {/* Row 2: Avatar + name */}
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                    className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-manrope font-bold text-lg text-white"
                    style={{
                        background: 'linear-gradient(135deg, rgba(46,119,255,0.35) 0%, rgba(91,154,255,0.20) 100%)',
                        border: '1.5px solid rgba(46,119,255,0.45)',
                        boxShadow: '0 0 16px rgba(46,119,255,0.25)',
                    }}
                    aria-hidden="true"
                >
                    {data.initials.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                    <span
                        className="font-manrope text-white font-bold truncate"
                        style={{ fontSize: '17px', letterSpacing: '0.01em' }}
                    >
                        {data.fullName}
                    </span>
                    <span className="font-manrope text-white/50 text-xs truncate mt-0.5">
                        {data.email}
                    </span>
                    {/* Verified badge */}
                    <span
                        className="inline-flex items-center gap-1 mt-1.5 self-start px-1.5 py-0.5 rounded"
                        style={{
                            background: 'rgba(34,197,94,0.12)',
                            border: '1px solid rgba(34,197,94,0.25)',
                            fontSize: '9px',
                        }}
                    >
                        <span className="material-symbols-outlined text-status-success" style={{ fontSize: '10px' }}>
                            verified
                        </span>
                        <span className="font-manrope font-semibold text-status-success tracking-wider">
                            IDENTITY VERIFIED
                        </span>
                    </span>
                </div>
            </div>

            {/* Row 3: ID number + barcode-style strip */}
            <div
                className="rounded-lg px-4 py-2.5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-manrope text-white/40 text-xs tracking-widest" style={{ fontSize: '8px' }}>
                            ID NUMBER
                        </span>
                        <span
                            className="font-manrope font-bold text-white tracking-[0.20em]"
                            style={{ fontSize: '13px', fontVariantNumeric: 'tabular-nums' }}
                        >
                            {data.idNumber}
                        </span>
                    </div>
                    {/* Mini barcode visual */}
                    <div className="flex gap-px items-center" aria-hidden="true">
                        {[3, 5, 2, 7, 4, 3, 6, 2, 5, 4, 6, 3, 5, 2, 4].map((h, i) => (
                            <div
                                key={i}
                                className="bg-white/25 rounded-sm"
                                style={{ width: '1.5px', height: `${h * 2.4}px` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 4: Issued / Expiry */}
            <div className="flex justify-between">
                {[
                    { label: 'ISSUED', value: formatDate(data.issuedDate) },
                    { label: 'VALID THROUGH', value: formatDate(data.expiryDate) },
                ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                        <span className="font-manrope text-white/35 tracking-widest" style={{ fontSize: '8px' }}>
                            {label}
                        </span>
                        <span className="font-manrope text-white font-semibold" style={{ fontSize: '11px' }}>
                            {value}
                        </span>
                    </div>
                ))}
                {/* Contactless symbol */}
                <div className="flex items-center" aria-hidden="true">
                    <span className="material-symbols-outlined text-white/30 text-xl">contactless</span>
                </div>
            </div>

        </div>

        {/* ── Bottom accent line ──────────────────────────────────────────── */}
        <div
            className="h-1 w-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(46,119,255,0.70), rgba(91,154,255,0.40), transparent)' }}
            aria-hidden="true"
        />
    </article>
);

export default DigitalIdCard;
