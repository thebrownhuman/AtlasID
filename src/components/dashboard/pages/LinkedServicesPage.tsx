// src/components/dashboard/pages/LinkedServicesPage.tsx
// Linked third-party services management with connect/revoke functionality.

import React, { useState } from 'react';

type Category = 'All' | 'Finance' | 'Travel' | 'Healthcare' | 'Government';
type ServiceStatus = 'connected' | 'expired';

interface Service {
    readonly id: string;
    readonly name: string;
    readonly category: Exclude<Category, 'All'>;
    readonly icon: string;
    readonly color: string;
    readonly connectedDate: string;
    readonly permissions: string[];
    readonly status: ServiceStatus;
}

const SERVICES: Service[] = [
    {
        id: '1', name: 'NovaPay Bank', category: 'Finance', icon: 'account_balance',
        color: '#2e77ff', connectedDate: '12 Jan 2026',
        permissions: ['Full Name', 'Date of Birth', 'Email'], status: 'connected',
    },
    {
        id: '2', name: 'TravelCore', category: 'Travel', icon: 'flight',
        color: '#22c55e', connectedDate: '08 Feb 2026',
        permissions: ['Full Name', 'Passport Number'], status: 'connected',
    },
    {
        id: '3', name: 'HealthConnect', category: 'Healthcare', icon: 'local_hospital',
        color: '#06b6d4', connectedDate: '22 Dec 2025',
        permissions: ['Full Name', 'DOB', 'NHS Number'], status: 'connected',
    },
    {
        id: '4', name: 'UK Gov Portal', category: 'Government', icon: 'gavel',
        color: '#a855f7', connectedDate: '01 Nov 2025',
        permissions: ['Full Name', 'Address', 'NI Number'], status: 'connected',
    },
    {
        id: '5', name: 'OldFinance Ltd', category: 'Finance', icon: 'credit_card',
        color: '#ef4444', connectedDate: '03 Mar 2025',
        permissions: ['Full Name', 'Email'], status: 'expired',
    },
];

const CATEGORIES: Category[] = ['All', 'Finance', 'Travel', 'Healthcare', 'Government'];

const DISCOVER = [
    { name: 'Revolut', icon: 'currency_exchange', color: '#2e77ff' },
    { name: 'NHS Digital', icon: 'health_and_safety', color: '#06b6d4' },
    { name: 'HMRC', icon: 'receipt_long', color: '#a855f7' },
];

export const LinkedServicesPage: React.FC = () => {
    const [filter, setFilter] = useState<Category>('All');
    const [revoked, setRevoked] = useState<Set<string>>(new Set());

    const filtered = SERVICES.filter(s => (filter === 'All' || s.category === filter) && !revoked.has(s.id));
    const activeCount = SERVICES.filter(s => s.status === 'connected' && !revoked.has(s.id)).length;

    return (
        <div className="flex flex-col gap-8">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-display-3 font-bold text-white">Linked Services</h1>
                        <p className="text-body-sm text-white/50 mt-1">Control which services can access your AtlasID</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-pill text-label font-bold text-white/60"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                        {activeCount} active
                    </span>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-control bg-atlas-blue text-white
                               font-semibold text-body-sm shadow-btn-primary
                               hover:bg-atlas-blue-dim hover:shadow-glow-blue-md
                               active:scale-[0.98] transition-all duration-200"
                >
                    <span className="material-symbols-outlined text-lg" aria-hidden="true">add</span>
                    Connect New Service
                </button>
            </div>

            {/* ── Category filters ─────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setFilter(cat)}
                        className={[
                            'px-4 py-1.5 rounded-pill text-body-sm font-semibold transition-all duration-150',
                            filter === cat
                                ? 'bg-atlas-blue text-white shadow-btn-primary'
                                : 'text-white/45 hover:text-white/70 border border-white/[0.10]',
                        ].join(' ')}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ── Service cards ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(svc => (
                    <article
                        key={svc.id}
                        className="rounded-2xl p-5 flex flex-col gap-4"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: svc.status === 'expired'
                                ? '1px solid rgba(239,68,68,0.20)'
                                : '1px solid rgba(255,255,255,0.07)',
                        }}
                    >
                        {/* Icon + name */}
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `${svc.color}20`, border: `1px solid ${svc.color}40` }}>
                                <span className="material-symbols-outlined text-xl" style={{ color: svc.color }} aria-hidden="true">
                                    {svc.icon}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-body-sm font-semibold text-white truncate">{svc.name}</p>
                                <span
                                    className="text-label font-semibold px-2 py-0.5 rounded-pill"
                                    style={{ background: `${svc.color}18`, color: svc.color }}
                                >
                                    {svc.category}
                                </span>
                            </div>
                        </div>

                        {/* Permissions */}
                        <div>
                            <p className="text-label text-white/35 uppercase tracking-widest mb-1.5">Shared data</p>
                            <div className="flex flex-wrap gap-1.5">
                                {svc.permissions.map(p => (
                                    <span
                                        key={p}
                                        className="text-label text-white/60 px-2 py-0.5 rounded"
                                        style={{ background: 'rgba(255,255,255,0.06)' }}
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                            <span className="text-label text-white/35">Since {svc.connectedDate}</span>
                            {svc.status === 'expired' ? (
                                <span className="text-label font-bold text-status-error">Connection expired</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setRevoked(prev => new Set([...prev, svc.id]))}
                                    className="text-label font-semibold text-status-error/70 hover:text-status-error
                                               transition-colors duration-150"
                                >
                                    Revoke Access
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            </div>

            {/* ── Discover section ─────────────────────────────────────────────── */}
            <div>
                <h2 className="text-body-md font-semibold text-white mb-4">Discover more services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {DISCOVER.map(d => (
                        <button
                            key={d.name}
                            type="button"
                            className="flex items-center gap-3 p-4 rounded-2xl text-left
                                       border border-white/[0.06] hover:border-atlas-blue/30
                                       hover:bg-white/[0.03] transition-all duration-200 group"
                            style={{ background: 'rgba(255,255,255,0.02)' }}
                        >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `${d.color}18`, border: `1px solid ${d.color}30` }}>
                                <span className="material-symbols-outlined text-lg" style={{ color: d.color }} aria-hidden="true">
                                    {d.icon}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-body-sm font-semibold text-white/60 group-hover:text-white/85 transition-colors">{d.name}</p>
                                <p className="text-label text-white/30">+ Connect</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LinkedServicesPage;
