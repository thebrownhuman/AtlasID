// src/components/landing/FeaturesSection.tsx
// "Why AtlasID?" — 6-card feature grid section of the landing page.

import React from 'react';
import { FEATURES } from '../../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FeaturesSectionProps {
    readonly className?: string;
}

// ─── FeatureCard ───────────────────────────────────────────────────────────────

interface FeatureItem {
    readonly icon: string;
    readonly title: string;
    readonly body: string;
}

const FeatureCard: React.FC<{ feature: FeatureItem }> = ({ feature }) => (
    <article
        className="group relative flex flex-col gap-4 p-6 rounded-2xl h-full
               transition-all duration-300
               hover:-translate-y-1"
        style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.09)',
        }}
        aria-label={feature.title}
    >
        {/* Hover glow bottom edge */}
        <div
            className="absolute inset-x-4 bottom-0 h-px rounded-full opacity-0
                 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(46,119,255,0.60), transparent)' }}
            aria-hidden="true"
        />

        {/* Icon */}
        <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
                background: 'rgba(46,119,255,0.12)',
                border: '1px solid rgba(46,119,255,0.22)',
            }}
            aria-hidden="true"
        >
            <span className="material-symbols-outlined text-atlas-blue text-2xl">{feature.icon}</span>
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-2">
            <h3 className="font-manrope font-semibold text-white text-lg leading-tight">{feature.title}</h3>
            <p className="text-body-sm text-white/55 leading-relaxed">{feature.body}</p>
        </div>
    </article>
);

// ─── FeaturesSection ───────────────────────────────────────────────────────────

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ className = '' }) => (
    <section
        id="features"
        className={`relative w-full py-24 sm:py-32 overflow-hidden ${className}`}
        style={{ background: '#060810' }}
        aria-labelledby="features-heading"
    >
        {/* Ambient glow */}
        <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 700px 400px at 50% 0%, rgba(46,119,255,0.12), transparent)' }}
            aria-hidden="true"
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 xl:px-16 2xl:px-24 flex flex-col items-center gap-16">

            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="text-center flex flex-col items-center gap-4 max-w-2xl">
                <span
                    className="text-label font-semibold tracking-widest text-atlas-blue"
                    aria-hidden="true"
                >
                    Why AtlasID
                </span>
                <h2 id="features-heading" className="font-manrope font-bold text-white text-4xl sm:text-5xl leading-tight">
                    One identity.{' '}
                    <span style={{ color: 'rgba(91,154,255,1)' }}>Infinite possibilities.</span>
                </h2>
                <p className="text-body-md text-white/55 leading-relaxed">
                    AtlasID is the world's first borderless digital identity layer — built for the era of
                    instant, verified global access.
                </p>
            </div>

            {/* ── Feature grid ──────────────────────────────────────────── */}
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
                role="list"
                aria-label="AtlasID features"
            >
                {FEATURES.map(feature => (
                    <div key={feature.title} role="listitem" className="flex">
                        <FeatureCard feature={feature} />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default FeaturesSection;
