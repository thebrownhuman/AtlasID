// src/components/landing/FooterSection.tsx
// 4-column footer: brand, product, developers, company links + compliance bottom bar.

import React from 'react';
import { FOOTER_LINKS, FOOTER_COLUMNS, BRAND_NAME, TAGLINE } from '../../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FooterSectionProps {
    readonly className?: string;
}

// ─── SocialIcon ────────────────────────────────────────────────────────────────

const SocialButton: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
    <a
        href="#"
        aria-label={label}
        className="w-9 h-9 flex items-center justify-center rounded-control
               border border-white/[0.10] bg-white/[0.04]
               hover:bg-white/[0.09] hover:text-white text-white/45
               transition-all duration-150"
    >
        <span className="material-symbols-outlined text-base" aria-hidden="true">{icon}</span>
    </a>
);

// ─── ComplianceBadge ────────────────────────────────────────────────────────────

const ComplianceBadge: React.FC<{ label: string }> = ({ label }) => (
    <span
        className="text-label font-bold text-white/35 px-2.5 py-1 rounded"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
    >
        {label}
    </span>
);

// ─── FooterSection ─────────────────────────────────────────────────────────────

export const FooterSection: React.FC<FooterSectionProps> = ({ className = '' }) => (
    <footer
        className={`w-full ${className}`}
        style={{ background: '#0d1117', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        aria-label="Site footer"
    >
        <div className="max-w-[1400px] mx-auto px-6 xl:px-16 2xl:px-24">

            {/* ── Top row ─────────────────────────────────────────────────── */}
            <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Brand column */}
                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(46,119,255,0.20)', border: '1px solid rgba(46,119,255,0.40)' }}
                            aria-hidden="true"
                        >
                            <span className="material-symbols-outlined text-atlas-blue" style={{ fontSize: '16px' }}>language</span>
                        </div>
                        <span className="font-manrope font-bold text-white text-lg">{BRAND_NAME}</span>
                    </div>
                    <p className="text-body-sm text-white/45 leading-relaxed">{TAGLINE}</p>
                    <div className="flex gap-2">
                        <SocialButton icon="public" label="X / Twitter" />
                        <SocialButton icon="work" label="LinkedIn" />
                        <SocialButton icon="code" label="GitHub" />
                    </div>
                </div>

                {/* Link columns */}
                {FOOTER_COLUMNS.map(col => (
                    <nav key={col.heading} aria-label={col.heading}>
                        <p className="text-label font-semibold text-white/30 uppercase tracking-widest mb-4">
                            {col.heading}
                        </p>
                        <ul className="flex flex-col gap-2.5">
                            {col.links.map(link => (
                                <li key={link}>
                                    <a
                                        href="#"
                                        className="text-body-sm text-white/50 hover:text-white transition-colors duration-150"
                                    >
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>

            {/* ── Bottom bar ──────────────────────────────────────────────── */}
            <div className="py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center gap-4">
                <p className="text-label text-white/30 sm:flex-1">
                    © 2026 AtlasID Inc. All rights reserved.
                </p>
                <div className="flex gap-2">
                    {['GDPR', 'SOC 2', 'ISO 27001'].map(b => <ComplianceBadge key={b} label={b} />)}
                </div>
                <nav className="flex gap-4 sm:flex-1 sm:justify-end" aria-label="Legal links">
                    {FOOTER_LINKS.map(l => (
                        <a
                            key={l.label}
                            href={l.href}
                            className="text-label text-white/35 hover:text-white/65 transition-colors duration-150"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>
            </div>

        </div>
    </footer>
);

export default FooterSection;
