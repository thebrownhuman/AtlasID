// src/components/dashboard/pages/SettingsPage.tsx
// Account settings — profile, notifications, privacy, appearance, danger zone.

import React, { useState } from 'react';

// ─── Toggle ────────────────────────────────────────────────────────────────────

const Toggle: React.FC<{ id: string; defaultChecked?: boolean }> = ({ id, defaultChecked = false }) => {
    const [on, setOn] = useState(defaultChecked);
    return (
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
    );
};

// ─── Section wrapper ───────────────────────────────────────────────────────────

const Section: React.FC<{ title: string; children: React.ReactNode; danger?: boolean }> = ({
    title, children, danger,
}) => (
    <section
        className="rounded-2xl p-6 flex flex-col gap-5"
        style={{
            background: danger ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.03)',
            border: danger ? '1px solid rgba(239,68,68,0.20)' : '1px solid rgba(255,255,255,0.07)',
        }}
    >
        <h2 className={`text-body-md font-semibold ${danger ? 'text-status-error' : 'text-white'}`}>{title}</h2>
        {children}
    </section>
);

// ─── SettingsPage ──────────────────────────────────────────────────────────────

export const SettingsPage: React.FC = () => {
    const [displayName, setDisplayName] = useState('Alex Chen');
    const [saved, setSaved] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="flex flex-col gap-6 pb-24">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div>
                <h1 className="text-display-3 font-bold text-white">Settings</h1>
                <p className="text-body-sm text-white/50 mt-1">Manage your account preferences</p>
            </div>

            {/* ── Profile ──────────────────────────────────────────────────────── */}
            <Section title="Profile Settings">
                {/* Avatar */}
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-atlas-blue/20 border-2 border-atlas-blue/40
                                    flex items-center justify-center flex-shrink-0">
                        <span className="text-xl font-bold text-atlas-blue">AC</span>
                    </div>
                    <button type="button"
                        className="text-body-sm font-semibold text-atlas-blue hover:text-white transition-colors">
                        Upload photo
                    </button>
                </div>

                {/* Display name */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="display-name" className="text-label font-semibold text-white/40 uppercase tracking-widest">
                        Display Name
                    </label>
                    <input
                        id="display-name"
                        type="text"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        className="w-full px-4 py-3 rounded-control text-body-sm text-white
                                   placeholder-white/25 outline-none transition-all duration-200
                                   focus:border-atlas-blue focus:shadow-glow-blue-sm"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
                    />
                </div>

                {/* Language + timezone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { id: 'lang', label: 'Language', value: 'English (UK)' },
                        { id: 'tz', label: 'Timezone', value: 'GMT+0 London' },
                    ].map(f => (
                        <div key={f.id} className="flex flex-col gap-1.5">
                            <label htmlFor={f.id} className="text-label font-semibold text-white/40 uppercase tracking-widest">
                                {f.label}
                            </label>
                            <select
                                id={f.id}
                                className="w-full px-4 py-3 rounded-control text-body-sm text-white/75
                                           outline-none appearance-none transition-all duration-200"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
                            >
                                <option>{f.value}</option>
                            </select>
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── Notifications ────────────────────────────────────────────────── */}
            <Section title="Notifications">
                {[
                    { id: 'notif-email', label: 'Email alerts', on: true },
                    { id: 'notif-push', label: 'Push notifications', on: true },
                    { id: 'notif-security', label: 'Security alerts', on: true },
                    { id: 'notif-marketing', label: 'Marketing updates', on: false },
                ].map(n => (
                    <div key={n.id} className="flex items-center justify-between">
                        <label htmlFor={n.id} className="text-body-sm text-white/65 cursor-pointer">{n.label}</label>
                        <Toggle id={n.id} defaultChecked={n.on} />
                    </div>
                ))}
            </Section>

            {/* ── Privacy ──────────────────────────────────────────────────────── */}
            <Section title="Privacy">
                {[
                    { id: 'priv-sharing', label: 'Allow anonymous data sharing', on: false },
                    { id: 'priv-analytics', label: 'Enable usage analytics', on: true },
                ].map(n => (
                    <div key={n.id} className="flex items-center justify-between">
                        <label htmlFor={n.id} className="text-body-sm text-white/65 cursor-pointer">{n.label}</label>
                        <Toggle id={n.id} defaultChecked={n.on} />
                    </div>
                ))}
                <button type="button"
                    className="self-start text-body-sm font-semibold text-atlas-blue hover:text-white transition-colors">
                    Manage cookie preferences →
                </button>
            </Section>

            {/* ── Appearance ───────────────────────────────────────────────────── */}
            <Section title="Appearance">
                {[
                    { id: 'app-dark', label: 'Dark mode', on: true },
                    { id: 'app-compact', label: 'Compact view', on: false },
                ].map(n => (
                    <div key={n.id} className="flex items-center justify-between">
                        <label htmlFor={n.id} className="text-body-sm text-white/65 cursor-pointer">{n.label}</label>
                        <Toggle id={n.id} defaultChecked={n.on} />
                    </div>
                ))}
            </Section>

            {/* ── Danger zone ──────────────────────────────────────────────────── */}
            <Section title="Danger Zone" danger>
                <p className="text-body-sm text-white/55">
                    Permanently delete your AtlasID account and all associated data. This action cannot be undone.
                </p>
                {deleteConfirm ? (
                    <div className="flex gap-3 flex-wrap">
                        <button type="button"
                            className="px-5 py-2.5 rounded-control bg-status-error text-white font-semibold text-body-sm
                                       hover:opacity-90 active:scale-[0.98] transition-all duration-200">
                            Yes, permanently delete
                        </button>
                        <button type="button" onClick={() => setDeleteConfirm(false)}
                            className="px-5 py-2.5 rounded-control border border-white/[0.12] text-white/60 font-semibold text-body-sm
                                       hover:text-white hover:border-white/25 transition-all duration-200">
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button type="button" onClick={() => setDeleteConfirm(true)}
                        className="self-start px-5 py-2.5 rounded-control border border-status-error/40 text-status-error
                                   font-semibold text-body-sm hover:bg-status-error/10 transition-all duration-200">
                        Delete Account
                    </button>
                )}
            </Section>

            {/* ── Sticky save footer ───────────────────────────────────────────── */}
            <div
                className="fixed bottom-0 left-64 right-0 flex items-center justify-end gap-3 px-8 py-4 z-20"
                style={{
                    background: 'rgba(6,8,16,0.90)',
                    backdropFilter: 'blur(16px)',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <button type="button"
                    className="px-5 py-2.5 rounded-control border border-white/[0.12] text-white/60 font-semibold text-body-sm
                               hover:text-white hover:border-white/25 transition-all duration-200">
                    Cancel
                </button>
                <button type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-control bg-atlas-blue text-white font-semibold text-body-sm
                               shadow-btn-primary hover:bg-atlas-blue-dim hover:shadow-glow-blue-md
                               active:scale-[0.98] transition-all duration-200">
                    {saved ? (
                        <><span className="material-symbols-outlined text-lg" aria-hidden="true">check</span>Saved!</>
                    ) : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
