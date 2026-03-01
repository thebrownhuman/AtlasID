// src/components/dashboard/pages/SecurityPage.tsx
// Security management — 2FA, passwords, sessions, alerts, recommendations.

import React, { useState } from 'react';
import { ChangePasswordModal } from '../ChangePasswordModal';

// ─── Toggle ────────────────────────────────────────────────────────────────────

const Toggle: React.FC<{ id: string; label: string; defaultChecked?: boolean }> = ({
    id, label, defaultChecked = false,
}) => {
    const [on, setOn] = useState(defaultChecked);
    return (
        <label htmlFor={id} className="flex items-center justify-between gap-4 cursor-pointer group">
            <span className="text-body-sm text-white/70 group-hover:text-white/90 transition-colors">{label}</span>
            <button
                id={id}
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => setOn(p => !p)}
                className={[
                    'relative flex-shrink-0 w-11 h-6 rounded-pill transition-all duration-200',
                    on ? 'bg-atlas-blue shadow-glow-blue-sm' : 'bg-white/[0.12]',
                ].join(' ')}
            >
                <span className={[
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-elevation-1 transition-all duration-200',
                    on ? 'left-[calc(100%-1.375rem)]' : 'left-0.5',
                ].join(' ')} />
            </button>
        </label>
    );
};

// ─── SecurityPage ─────────────────────────────────────────────────────────────

const SESSIONS = [
    { device: 'Chrome / Windows', location: 'London, UK', time: 'Now', current: true },
    { device: 'Safari / iPhone', location: 'London, UK', time: '2 hours ago', current: false },
    { device: 'Firefox / macOS', location: 'New York, US', time: '3 days ago', current: false },
];

export const SecurityPage: React.FC = () => {
    const [revokedSessions, setRevokedSessions] = useState<Set<string>>(new Set());
    const [changePwOpen, setChangePwOpen] = useState(false);

    return (
        <>
            <ChangePasswordModal
                isOpen={changePwOpen}
                onClose={() => setChangePwOpen(false)}
                maskedEmail="j***@atlasid.com"
            />

            <div className="flex flex-col gap-6">

                {/* ── Header ─────────────────────────────────────────────────────── */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-display-3 font-bold text-white">Security</h1>
                        <p className="text-body-sm text-white/50 mt-1">Manage your account protection settings</p>
                    </div>
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-pill"
                        style={{
                            background: 'rgba(34,197,94,0.10)',
                            border: '1px solid rgba(34,197,94,0.25)',
                        }}
                    >
                        <span className="material-symbols-outlined text-lg text-status-success" aria-hidden="true">shield</span>
                        <span className="text-body-sm font-bold text-status-success">94/100 — Excellent</span>
                    </div>
                </div>

                {/* ── 2FA ────────────────────────────────────────────────────────── */}
                <section
                    className="rounded-2xl p-6"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    aria-label="Two-factor authentication"
                >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-body-md font-semibold text-white">Two-Factor Authentication</h2>
                            <p className="text-body-sm text-white/50 mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <span
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-label font-bold text-status-success"
                            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-status-success" aria-hidden="true" />
                            ENABLED
                        </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between p-4 rounded-xl"
                        style={{ background: 'rgba(46,119,255,0.07)', border: '1px solid rgba(46,119,255,0.15)' }}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-xl text-atlas-blue" aria-hidden="true">smartphone</span>
                            <div>
                                <p className="text-body-sm font-semibold text-white">Authenticator App</p>
                                <p className="text-label text-white/45">Google Authenticator — linked 15 Jan 2026</p>
                            </div>
                        </div>
                        <button type="button"
                            className="text-body-sm font-semibold text-atlas-blue hover:text-white transition-colors">
                            Change Method
                        </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-label text-white/40">Backup codes: 8 remaining</p>
                        <button type="button"
                            className="text-label font-semibold text-atlas-blue hover:text-white transition-colors">
                            View backup codes
                        </button>
                    </div>
                </section>

                {/* ── Password ────────────────────────────────────────────────────── */}
                <section
                    className="rounded-2xl p-6"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    aria-label="Password settings"
                >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h2 className="text-body-md font-semibold text-white">Password</h2>
                            <p className="text-body-sm text-white/50 mt-1">Last changed 30 days ago</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setChangePwOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-control bg-atlas-blue text-white
                                       font-semibold text-body-sm shadow-btn-primary
                                       hover:bg-atlas-blue-dim transition-all duration-200"
                        >
                            <span className="material-symbols-outlined text-lg">key</span>
                            Change Password
                        </button>
                    </div>
                    <p className="mt-3 text-label text-white/40">
                        To change your password, you'll verify your email and confirm with Google Authenticator.
                    </p>
                </section>

                {/* ── Active sessions ─────────────────────────────────────────────── */}
                <section
                    className="rounded-2xl p-6"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    aria-label="Active sessions"
                >
                    <h2 className="text-body-md font-semibold text-white mb-4">Active Sessions</h2>
                    <div className="flex flex-col gap-3">
                        {SESSIONS.filter(s => !revokedSessions.has(s.device)).map(session => (
                            <div key={session.device}
                                className="flex items-center justify-between p-4 rounded-xl"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-xl text-white/40" aria-hidden="true">
                                        {session.device.includes('iPhone') ? 'smartphone' : 'computer'}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-body-sm font-medium text-white">{session.device}</p>
                                            {session.current && (
                                                <span className="text-label font-bold text-status-success px-2 py-0.5 rounded-pill"
                                                    style={{ background: 'rgba(34,197,94,0.12)' }}>
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-label text-white/40">{session.location} · {session.time}</p>
                                    </div>
                                </div>
                                {!session.current && (
                                    <button
                                        type="button"
                                        onClick={() => setRevokedSessions(p => new Set([...p, session.device]))}
                                        className="text-label font-semibold text-status-error/70 hover:text-status-error transition-colors"
                                    >
                                        Revoke
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Login alerts ────────────────────────────────────────────────── */}
                <section
                    className="rounded-2xl p-6 flex flex-col gap-5"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    aria-label="Login alert settings"
                >
                    <h2 className="text-body-md font-semibold text-white">Login Alerts</h2>
                    <Toggle id="alert-new-device" label="Login from new device" defaultChecked />
                    <Toggle id="alert-failed" label="Failed login attempts" defaultChecked />
                    <Toggle id="alert-password" label="Password reset attempts" defaultChecked />
                    <Toggle id="alert-new-ip" label="New IP address detected" />
                </section>

                {/* ── Recommendations ─────────────────────────────────────────────── */}
                <section
                    className="rounded-2xl p-6 flex flex-col gap-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    aria-label="Security recommendations"
                >
                    <h2 className="text-body-md font-semibold text-white mb-1">Recommendations</h2>
                    {[
                        { done: true, text: '2FA enabled' },
                        { done: true, text: 'Strong password set' },
                    ].map(r => (
                        <div key={r.text} className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg text-status-success" aria-hidden="true">check_circle</span>
                            <span className="text-body-sm text-white/65">{r.text}</span>
                        </div>
                    ))}
                    <div className="flex items-center justify-between p-3 rounded-xl mt-1"
                        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.20)' }}>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-lg text-status-warning" aria-hidden="true">warning</span>
                            <span className="text-body-sm text-white/80">Add a recovery email</span>
                        </div>
                        <button type="button"
                            className="text-label font-bold text-status-warning hover:text-white transition-colors">
                            Add Now
                        </button>
                    </div>
                </section>
            </div>
        </>
    );
};

export default SecurityPage;
