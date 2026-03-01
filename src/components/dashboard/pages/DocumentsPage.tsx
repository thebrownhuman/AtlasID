// src/components/dashboard/pages/DocumentsPage.tsx
// Documents management page — filterable document card grid with upload slot.

import React, { useState } from 'react';

type DocStatus = 'verified' | 'pending' | 'expired';
type FilterTab = 'all' | DocStatus;

interface DocumentCard {
    readonly id: string;
    readonly type: string;
    readonly name: string;
    readonly icon: string;
    readonly status: DocStatus;
    readonly issued: string;
    readonly expiry: string;
}

const DOCUMENTS: DocumentCard[] = [
    { id: '1', type: 'Travel', name: 'Passport', icon: 'book', status: 'verified', issued: '15 Jan 2020', expiry: '14 Jan 2030' },
    { id: '2', type: 'Transport', name: "Driver's License", icon: 'directions_car', status: 'verified', issued: '03 Aug 2019', expiry: '02 Aug 2029' },
    { id: '3', type: 'Address', name: 'Proof of Address', icon: 'home_pin', status: 'pending', issued: '22 Feb 2026', expiry: 'N/A' },
    { id: '4', type: 'Finance', name: 'Bank Statement', icon: 'account_balance', status: 'expired', issued: '01 Jan 2024', expiry: '31 Mar 2024' },
];

const STATUS_CONFIG: Record<DocStatus, { label: string; bg: string; border: string; text: string }> = {
    verified: { label: 'VERIFIED', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.30)', text: 'text-status-success' },
    pending: { label: 'PENDING REVIEW', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.30)', text: 'text-status-warning' },
    expired: { label: 'EXPIRED', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.30)', text: 'text-status-error' },
};

const FILTER_TABS: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'verified', label: 'Verified' },
    { id: 'pending', label: 'Pending' },
    { id: 'expired', label: 'Expired' },
];

export const DocumentsPage: React.FC = () => {
    const [filter, setFilter] = useState<FilterTab>('all');

    const filtered = filter === 'all' ? DOCUMENTS : DOCUMENTS.filter(d => d.status === filter);

    return (
        <div className="flex flex-col gap-8">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-display-3 font-bold text-white">Documents</h1>
                    <p className="text-body-sm text-white/50 mt-1">Manage your verified identity documents</p>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-control bg-atlas-blue text-white
                               font-semibold text-body-sm shadow-btn-primary
                               hover:bg-atlas-blue-dim hover:shadow-glow-blue-md
                               active:scale-[0.98] transition-all duration-200"
                >
                    <span className="material-symbols-outlined text-lg" aria-hidden="true">upload</span>
                    Upload Document
                </button>
            </div>

            {/* ── Filter tabs ─────────────────────────────────────────────────── */}
            <div className="flex gap-1 p-1 rounded-control w-fit"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                {FILTER_TABS.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFilter(tab.id)}
                        className={[
                            'px-4 py-1.5 rounded-[6px] text-body-sm font-semibold transition-all duration-150',
                            filter === tab.id
                                ? 'bg-atlas-blue text-white shadow-btn-primary'
                                : 'text-white/45 hover:text-white/70',
                        ].join(' ')}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Document grid ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(doc => {
                    const cfg = STATUS_CONFIG[doc.status];
                    return (
                        <article
                            key={doc.id}
                            className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200
                                       hover:border-atlas-blue/30 hover:shadow-elevation-2"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                            {/* Icon + status */}
                            <div className="flex items-start justify-between">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                                    style={{ background: 'rgba(46,119,255,0.12)', border: '1px solid rgba(46,119,255,0.20)' }}>
                                    <span className="material-symbols-outlined text-xl text-atlas-blue" aria-hidden="true">
                                        {doc.icon}
                                    </span>
                                </div>
                                <span
                                    className={`text-label font-bold px-2.5 py-1 rounded-pill ${cfg.text}`}
                                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                                >
                                    {cfg.label}
                                </span>
                            </div>

                            {/* Name */}
                            <div>
                                <p className="text-body-md font-semibold text-white">{doc.name}</p>
                                <p className="text-label text-white/40 mt-0.5">{doc.type}</p>
                            </div>

                            {/* Dates */}
                            <div className="flex gap-6">
                                <div>
                                    <p className="text-label text-white/35 uppercase tracking-widest">Issued</p>
                                    <p className="text-label font-semibold text-white/75 mt-0.5">{doc.issued}</p>
                                </div>
                                <div>
                                    <p className="text-label text-white/35 uppercase tracking-widest">Expires</p>
                                    <p className={`text-label font-semibold mt-0.5 ${doc.status === 'expired' ? 'text-status-error' : 'text-white/75'}`}>
                                        {doc.expiry}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
                                {[
                                    { icon: 'visibility', label: 'View' },
                                    { icon: 'download', label: 'Download' },
                                ].map(a => (
                                    <button
                                        key={a.icon}
                                        type="button"
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-control
                                                   text-label font-semibold text-white/50
                                                   hover:text-white hover:bg-white/[0.05]
                                                   transition-all duration-150"
                                        aria-label={a.label}
                                    >
                                        <span className="material-symbols-outlined text-base" aria-hidden="true">{a.icon}</span>
                                        {a.label}
                                    </button>
                                ))}
                                <div className="flex-1" />
                                <button
                                    type="button"
                                    className="flex items-center gap-1 px-2 py-1.5 rounded-control
                                               text-label text-status-error/70 hover:text-status-error
                                               hover:bg-status-error/10 transition-all duration-150"
                                    aria-label="Delete document"
                                >
                                    <span className="material-symbols-outlined text-base" aria-hidden="true">delete</span>
                                </button>
                            </div>
                        </article>
                    );
                })}

                {/* Upload slot */}
                <button
                    type="button"
                    className="rounded-2xl p-5 flex flex-col items-center justify-center gap-3 min-h-[200px]
                               text-atlas-blue/60 hover:text-atlas-blue hover:border-atlas-blue/40
                               transition-all duration-200"
                    style={{ border: '2px dashed rgba(46,119,255,0.25)', background: 'rgba(46,119,255,0.04)' }}
                >
                    <span className="material-symbols-outlined text-3xl" aria-hidden="true">add_circle</span>
                    <span className="text-body-sm font-semibold">Upload new document</span>
                </button>
            </div>
        </div>
    );
};

export default DocumentsPage;
