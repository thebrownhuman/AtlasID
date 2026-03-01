// src/components/landing/HowItWorksSection.tsx
// 4-step numbered process timeline with Atlas Blue connector and CTA row.

import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface HowItWorksSectionProps {
    readonly onGetStarted?: () => void;
    readonly className?: string;
}

// ─── StepCard ──────────────────────────────────────────────────────────────────

interface StepItem {
    readonly number: string;
    readonly icon: string;
    readonly title: string;
    readonly body: string;
}

const StepCard: React.FC<{ step: StepItem; index: number }> = ({ step, index }) => (
    <article
        className="relative flex flex-col gap-4 p-6 rounded-2xl h-full"
        style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
        }}
        aria-label={`Step ${index + 1}: ${step.title}`}
    >
        {/* Big backdrop number */}
        <span
            className="absolute top-4 right-4 font-manrope font-bold leading-none select-none"
            style={{ fontSize: '64px', color: 'rgba(46,119,255,0.08)' }}
            aria-hidden="true"
        >
            {step.number}
        </span>


        {/* Icon */}
        <div
            className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(46,119,255,0.14)', border: '1px solid rgba(46,119,255,0.25)' }}
            aria-hidden="true"
        >
            <span className="material-symbols-outlined text-atlas-blue text-2xl">{step.icon}</span>
        </div>



        <div className="relative z-10 flex flex-col gap-2">
            <h3 className="font-manrope font-semibold text-white text-lg">{step.title}</h3>
            <p className="text-body-sm text-white/55 leading-relaxed">{step.body}</p>
        </div>
    </article>
);

// ─── HowItWorksSection ─────────────────────────────────────────────────────────

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
    onGetStarted, className = '',
}) => (
    <section
        id="how-it-works"
        className={`relative w-full py-24 sm:py-32 ${className}`}
        style={{ background: '#0d1117' }}
        aria-labelledby="hiw-heading"
    >
        {/* Subtle separator top */}
        <div
            className="absolute top-0 inset-x-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }}
            aria-hidden="true"
        />

        <div className="max-w-[1400px] mx-auto px-6 xl:px-16 2xl:px-24 flex flex-col items-center gap-16">

            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="text-center flex flex-col items-center gap-4 max-w-2xl">
                <span className="text-label font-semibold tracking-widest uppercase text-atlas-blue">
                    How It Works
                </span>
                <h2 id="hiw-heading" className="font-manrope font-bold text-white text-4xl sm:text-5xl leading-tight">
                    Up and running in under{' '}
                    <span style={{ color: 'rgba(91,154,255,1)' }}>5 minutes</span>
                </h2>
            </div>

            {/* ── Steps grid ─────────────────────────────────────────────── */}
            <div className="relative w-full">
                {/* Desktop connector line */}
                <div
                    className="hidden lg:block absolute top-[52px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px"
                    style={{ background: 'linear-gradient(90deg, rgba(46,119,255,0.25), rgba(46,119,255,0.50), rgba(46,119,255,0.25))' }}
                    aria-hidden="true"
                />

                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                    role="list"
                    aria-label="How AtlasID works"
                >
                    {HOW_IT_WORKS_STEPS.map((step, i) => (
                        <div key={step.number} role="listitem" className="flex">
                            <StepCard step={step} index={i} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CTA ────────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                    type="button"
                    onClick={onGetStarted}
                    className="px-8 py-3.5 rounded-control font-manrope font-semibold text-white
                     bg-atlas-blue hover:bg-atlas-blue-dim
                     transition-all duration-200"
                    style={{ boxShadow: '0 4px 20px rgba(46,119,255,0.35)' }}
                >
                    Get Your AtlasID Free
                </button>
                <button
                    type="button"
                    className="flex items-center gap-2 px-8 py-3.5 rounded-control font-manrope font-semibold
                     text-atlas-blue border border-atlas-blue/50
                     hover:bg-atlas-blue/10 transition-all duration-200"
                >
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">play_circle</span>
                    Watch Demo
                </button>
            </div>
        </div>
    </section>
);

export default HowItWorksSection;
