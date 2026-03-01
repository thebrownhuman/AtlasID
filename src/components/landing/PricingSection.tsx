// src/components/landing/PricingSection.tsx
// 3-tier pricing cards: Free / Pro (featured) / Enterprise, with billing toggle.

import React, { useState } from 'react';
import { PRICING_PLANS } from '../../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PricingSectionProps {
    readonly onGetStarted?: () => void;
    readonly className?: string;
}

interface PricingPlan {
    readonly tier: string;
    readonly badge?: string;
    readonly monthlyPrice: string;
    readonly annualPrice: string;
    readonly subtitle: string;
    readonly features: readonly string[];
    readonly cta: string;
    readonly variant: 'default' | 'featured' | 'enterprise';
}

// ─── FeatureItem ───────────────────────────────────────────────────────────────

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
    <li className="flex items-start gap-2.5">
        <span
            className="material-symbols-outlined text-base flex-shrink-0 mt-0.5 text-status-success"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
        >
            check_circle
        </span>
        <span className="text-body-sm text-white/65">{text}</span>
    </li>
);

// ─── PricingCard ───────────────────────────────────────────────────────────────

const PricingCard: React.FC<{ plan: PricingPlan; annual: boolean; onGetStarted?: () => void }> = ({
    plan, annual, onGetStarted,
}) => {
    const isFeatured = plan.variant === 'featured';
    const isEnterprise = plan.variant === 'enterprise';
    const price = annual ? plan.annualPrice : plan.monthlyPrice;

    return (
        <article
            className={`relative flex flex-col gap-6 p-7 rounded-2xl
                  ${isFeatured ? 'ring-2 ring-atlas-blue/60 scale-[1.02]' : ''}`}
            style={{
                background: isFeatured
                    ? 'linear-gradient(135deg, rgba(46,119,255,0.10) 0%, rgba(14,20,36,0.90) 100%)'
                    : isEnterprise
                        ? 'rgba(14,20,36,0.85)'
                        : 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
                border: isFeatured
                    ? '1px solid rgba(46,119,255,0.40)'
                    : '1px solid rgba(255,255,255,0.09)',
                boxShadow: isFeatured ? '0 0 40px rgba(46,119,255,0.20)' : 'none',
            }}
            aria-label={`${plan.tier} pricing plan`}
        >
            {/* Badge */}
            {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                        className="text-label font-bold text-white px-3 py-1 rounded-pill whitespace-nowrap"
                        style={{ background: '#2e77ff', boxShadow: '0 4px 16px rgba(46,119,255,0.40)' }}
                    >
                        {plan.badge}
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-1 pt-2">
                <h3 className="font-manrope font-bold text-white text-xl">{plan.tier}</h3>
                <p className="text-body-sm text-white/45">{plan.subtitle}</p>
            </div>

            {/* Price */}
            <div className="flex items-end gap-1">
                {isEnterprise ? (
                    <span className="font-manrope font-bold text-white text-3xl">Custom</span>
                ) : (
                    <>
                        <span className="font-manrope font-bold text-white text-4xl">{price}</span>
                        <span className="text-body-sm text-white/40 mb-1">/month</span>
                    </>
                )}
            </div>
            {!isEnterprise && annual && (
                <p className="text-label text-status-success -mt-4">Billed annually</p>
            )}

            {/* Features */}
            <ul className="flex flex-col gap-3 flex-1" aria-label={`${plan.tier} features`}>
                {plan.features.map(f => <FeatureItem key={f} text={f} />)}
            </ul>

            {/* CTA */}
            <button
                type="button"
                onClick={onGetStarted}
                className={`w-full py-3.5 rounded-control font-manrope font-semibold text-white
                    transition-all duration-200
                    ${isFeatured
                        ? 'bg-atlas-blue hover:bg-atlas-blue-dim'
                        : 'border border-atlas-blue/40 hover:bg-atlas-blue/10 text-atlas-blue'}`}
                style={isFeatured ? { boxShadow: '0 4px 20px rgba(46,119,255,0.30)' } : {}}
            >
                {plan.cta}
            </button>
        </article>
    );
};

// ─── PricingSection ────────────────────────────────────────────────────────────

export const PricingSection: React.FC<PricingSectionProps> = ({ onGetStarted, className = '' }) => {
    const [annual, setAnnual] = useState(true);

    return (
        <section
            id="pricing"
            className={`relative w-full py-24 sm:py-32 overflow-hidden ${className}`}
            style={{ background: '#060810' }}
            aria-labelledby="pricing-heading"
        >
            {/* Ambient glow */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 600px 300px at 50% 0%, rgba(46,119,255,0.09), transparent)' }}
                aria-hidden="true"
            />

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 xl:px-16 2xl:px-24 flex flex-col items-center gap-16">

                {/* ── Header ──────────────────────────────────────────────── */}
                <div className="text-center flex flex-col items-center gap-6">
                    <span className="text-label font-semibold tracking-widest uppercase text-atlas-blue">
                        Simple Pricing
                    </span>
                    <h2 id="pricing-heading" className="font-manrope font-bold text-white text-4xl sm:text-5xl leading-tight max-w-xl">
                        Choose the plan that fits your needs
                    </h2>

                    {/* Billing toggle */}
                    <div
                        className="flex items-center gap-3 p-1 rounded-control"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
                        role="group"
                        aria-label="Billing period"
                    >
                        {(['Monthly', 'Annual'] as const).map(period => {
                            const isAnn = period === 'Annual';
                            const active = isAnn === annual;
                            return (
                                <button
                                    key={period}
                                    type="button"
                                    onClick={() => setAnnual(isAnn)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded text-body-sm font-semibold
                              transition-all duration-200 ${active ? 'text-white' : 'text-white/45'}`}
                                    style={active ? { background: '#2e77ff' } : {}}
                                    aria-pressed={active}
                                >
                                    {period}
                                    {isAnn && (
                                        <span
                                            className="text-label font-bold px-1.5 rounded"
                                            style={{ background: 'rgba(34,197,94,0.18)', color: '#22c55e', fontSize: '10px' }}
                                        >
                                            −20%
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Plan cards ──────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-start" role="list">
                    {PRICING_PLANS.map(plan => (
                        <div key={plan.tier} role="listitem">
                            <PricingCard plan={plan as PricingPlan} annual={annual} onGetStarted={onGetStarted} />
                        </div>
                    ))}
                </div>

                {/* Compliance note */}
                <p className="text-body-sm text-white/35 text-center max-w-lg">
                    All plans include end-to-end encryption, GDPR compliance, and zero data monetization.
                </p>
            </div>
        </section>
    );
};

export default PricingSection;
