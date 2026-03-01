// src/components/dashboard/pages/MyIdentityPage.tsx
// "My Identity" dashboard page — ID card preview, strength gauge, personal/contact info.

import React, { useState } from 'react';

// ─── StrengthBar ───────────────────────────────────────────────────────────────

const StrengthBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
            <span className="text-label font-medium text-white/60">{label}</span>
            <span className="text-label font-bold text-white">{value}%</span>
        </div>
        <div className="h-1.5 rounded-pill overflow-hidden bg-white/[0.08]">
            <div
                className="h-full rounded-pill transition-all duration-700"
                style={{ width: `${value}%`, background: color }}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </div>
    </div>
);

// ─── InfoField ─────────────────────────────────────────────────────────────────

const InfoField: React.FC<{ label: string; value: string; editable?: boolean }> = ({ label, value, editable }) => (
    <div className="flex flex-col gap-1">
        <span className="text-label font-semibold text-white/35 uppercase tracking-widest">{label}</span>
        <div className="flex items-center justify-between gap-3">
            <span className="text-body-sm font-medium text-white/85">{value}</span>
            {editable && (
                <button
                    type="button"
                    className="flex-shrink-0 text-atlas-blue text-label font-semibold
                               hover:text-white transition-colors duration-150"
                >
                    Edit
                </button>
            )}
        </div>
    </div>
);

// ─── MyIdentityPage ────────────────────────────────────────────────────────────

export const MyIdentityPage: React.FC = () => {
    const [requestSent, setRequestSent] = useState(false);

    const strengths = [
        { label: 'Document Verification', value: 100, color: '#2e77ff' },
        { label: 'Biometric Match', value: 98, color: '#22c55e' },
        { label: 'Address Confirmed', value: 85, color: '#2e77ff' },
        { label: 'Phone Verified', value: 90, color: '#22c55e' },
    ];

    return (
        <div className="flex flex-col gap-8">

            {/* ── Page header ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-display-3 font-bold text-white">My Identity</h1>
                    <p className="text-body-sm text-white/50 mt-1">Your verified digital identity credentials</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-pill"
                    style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
                    <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                    <span className="text-label font-semibold text-status-success">Last verified 2 mins ago</span>
                </div>
            </div>

            {/* ── ID card preview ─────────────────────────────────────────────── */}
            <div
                className="relative rounded-2xl p-6 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(14,20,36,0.95) 0%, rgba(22,27,38,0.9) 100%)',
                    border: '1px solid rgba(46,119,255,0.25)',
                    boxShadow: '0 0 40px rgba(46,119,255,0.10)',
                }}
            >
                {/* Holographic shimmer overlay */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{ background: 'linear-gradient(120deg, transparent 30%, rgba(46,119,255,0.05) 50%, transparent 70%)' }}
                    aria-hidden="true" />

                <div className="relative z-10 flex flex-wrap items-start gap-6">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full bg-atlas-blue/20 border-2 border-atlas-blue/40
                                    flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-atlas-blue">AC</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                                <p className="text-display-3 font-bold text-white">Alex Chen</p>
                                <p className="text-body-sm text-white/55 mt-0.5">alex@atlasid.com</p>
                                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-pill"
                                    style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.30)' }}>
                                    <span className="material-symbols-outlined text-sm text-status-success" aria-hidden="true">verified</span>
                                    <span className="text-label font-bold text-status-success">IDENTITY VERIFIED</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-label text-white/35 uppercase tracking-widest">ID Number</p>
                                <p className="text-body-md font-bold text-white font-mono mt-1">ATL-2026-884921</p>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-8 flex-wrap">
                            <div>
                                <p className="text-label text-white/35 uppercase tracking-widest">Issued</p>
                                <p className="text-body-sm font-semibold text-white mt-0.5">01 Mar 2026</p>
                            </div>
                            <div>
                                <p className="text-label text-white/35 uppercase tracking-widest">Valid Through</p>
                                <p className="text-body-sm font-semibold text-white mt-0.5">28 Feb 2029</p>
                            </div>
                            <div>
                                <p className="text-label text-white/35 uppercase tracking-widest">Nationality</p>
                                <p className="text-body-sm font-semibold text-white mt-0.5">British</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Strength + Info row ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Identity Strength */}
                <div
                    className="rounded-2xl p-6 flex flex-col gap-6"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                    <h2 className="text-body-md font-semibold text-white">Identity Strength</h2>

                    {/* Circular gauge */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-28 h-28">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                                <circle
                                    cx="50" cy="50" r="42" fill="none"
                                    stroke="#2e77ff" strokeWidth="10"
                                    strokeDasharray={`${94 * 2.64} ${264}`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-white">94</span>
                                <span className="text-label text-white/40">/100</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {strengths.map(s => <StrengthBar key={s.label} {...s} />)}
                    </div>
                </div>

                {/* Personal Info + Contact Info */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Personal */}
                    <div
                        className="rounded-2xl p-6 flex flex-col gap-5"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <h2 className="text-body-md font-semibold text-white">Personal Information</h2>
                        <div className="flex flex-col gap-4">
                            <InfoField label="Full Name" value="Alex Chen" editable />
                            <InfoField label="Date of Birth" value="14 March 1992" editable />
                            <InfoField label="Nationality" value="British" editable />
                            <InfoField label="Gender" value="Male" editable />
                        </div>
                    </div>

                    {/* Contact */}
                    <div
                        className="rounded-2xl p-6 flex flex-col gap-5"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <h2 className="text-body-md font-semibold text-white">Contact Information</h2>
                        <div className="flex flex-col gap-4">
                            <InfoField label="Email" value="alex@atlasid.com" editable />
                            <InfoField label="Phone" value="+44 7700 900123" editable />
                            <InfoField label="City" value="London, United Kingdom" editable />
                            <InfoField label="Postal Code" value="SW1A 1AA" editable />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CTA ─────────────────────────────────────────────────────────── */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setRequestSent(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-control bg-atlas-blue text-white
                               font-semibold text-body-sm shadow-btn-primary
                               hover:bg-atlas-blue-dim hover:shadow-glow-blue-md
                               active:scale-[0.98] transition-all duration-200"
                >
                    {requestSent ? (
                        <><span className="material-symbols-outlined text-lg" aria-hidden="true">check_circle</span>Request Sent!</>
                    ) : (
                        <><span className="material-symbols-outlined text-lg" aria-hidden="true">credit_card</span>Request Physical ID Card</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default MyIdentityPage;
