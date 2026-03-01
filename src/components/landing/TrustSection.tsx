// src/components/landing/TrustSection.tsx
// Social proof section: stats bar, partner logos, testimonials.

import React from 'react';
import { TRUST_STATS, PARTNER_LOGOS, TESTIMONIALS } from '../../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TrustSectionProps {
    readonly className?: string;
}

// ─── StarRating ────────────────────────────────────────────────────────────────

const StarRating: React.FC<{ count?: number }> = ({ count = 5 }) => (
    <div className="flex gap-0.5" aria-label={`${count} stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
            <span
                key={i}
                className="material-symbols-outlined text-base"
                style={{ color: i < count ? '#f59e0b' : 'rgba(255,255,255,0.15)', fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
            >
                star
            </span>
        ))}
    </div>
);

// ─── TestimonialCard ────────────────────────────────────────────────────────────

interface Testimonial {
    readonly quote: string;
    readonly name: string;
    readonly role: string;
    readonly company: string;
    readonly badge: string;
    readonly initials: string;
}

const TestimonialCard: React.FC<{ item: Testimonial }> = ({ item }) => (
    <blockquote
        className="flex flex-col gap-4 p-6 rounded-2xl"
        style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.09)',
        }}
    >
        <StarRating />
        <p className="text-body-md text-white/75 leading-relaxed italic">"{item.quote}"</p>
        <footer className="flex items-center gap-3 mt-auto pt-2 border-t border-white/[0.06]">
            <div
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center
                   font-manrope font-bold text-sm text-white"
                style={{ background: 'rgba(46,119,255,0.20)', border: '1px solid rgba(46,119,255,0.30)' }}
                aria-hidden="true"
            >
                {item.initials}
            </div>
            <div className="flex flex-col min-w-0">
                <cite className="font-manrope font-semibold text-white text-sm not-italic">{item.name}</cite>
                <span className="text-label text-white/45 truncate">{item.role} · {item.company}</span>
            </div>
            <span
                className="ml-auto flex-shrink-0 text-label font-bold px-2 py-0.5 rounded"
                style={{ background: 'rgba(46,119,255,0.10)', border: '1px solid rgba(46,119,255,0.20)', color: 'rgba(91,154,255,1)' }}
            >
                {item.badge}
            </span>
        </footer>
    </blockquote>
);

// ─── TrustSection ──────────────────────────────────────────────────────────────

export const TrustSection: React.FC<TrustSectionProps> = ({ className = '' }) => (
    <section
        id="trust"
        className={`w-full ${className}`}
        style={{ background: '#060810' }}
        aria-labelledby="trust-heading"
    >
        {/* ── Stats bar ─────────────────────────────────────────────────── */}
        <div
            className="w-full py-8"
            style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
            <div className="max-w-[1400px] mx-auto px-6 xl:px-16 2xl:px-24">
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {TRUST_STATS.map((stat, i) => (
                        <div
                            key={stat.label}
                            className={`flex flex-col items-center gap-1 text-center ${i < 3 ? 'sm:border-r sm:border-white/[0.07]' : ''}`}
                        >
                            <dt className="text-label text-white/40">{stat.label}</dt>
                            <dd className="font-manrope font-bold text-white" style={{ fontSize: '2.25rem' }}>{stat.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 xl:px-16 2xl:px-24 py-24 flex flex-col items-center gap-16">

            {/* ── Partner logos ──────────────────────────────────────────── */}
            <div className="flex flex-col items-center gap-8 w-full">
                <p className="text-label font-semibold tracking-widest uppercase text-white/30">
                    Trusted by industry leaders
                </p>
                <div
                    className="flex flex-wrap justify-center gap-4 w-full"
                    role="list"
                    aria-label="Partner organizations"
                >
                    {PARTNER_LOGOS.map(p => (
                        <div
                            key={p.name}
                            role="listitem"
                            aria-label={p.name}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                            <span className="material-symbols-outlined text-white/30 text-lg" aria-hidden="true">{p.icon}</span>
                            <span className="font-manrope font-semibold text-white/35 text-sm whitespace-nowrap">{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Testimonials ───────────────────────────────────────────── */}
            <div className="w-full flex flex-col gap-4">
                <h2 id="trust-heading" className="sr-only">Customer testimonials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {TESTIMONIALS.map(item => (
                        <TestimonialCard key={item.name} item={item} />
                    ))}
                </div>
            </div>

        </div>
    </section>
);

export default TrustSection;
