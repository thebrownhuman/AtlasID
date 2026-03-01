// src/components/HeroLayout.tsx
// Full-width two-column shell: left branding/hero panel + right form slot.
// Responsive: stacks single-column on < lg screens.

import React from 'react';
import {
    BRAND_NAME,
    HERO_HEADLINE,
    HERO_SUBTEXT,
    HERO_FEATURES,
    NAV_LINKS,
    FOOTER_TEXT,
    FOOTER_LINKS,
    type HeroFeature,
} from '../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface HeroLayoutProps {
    readonly children: React.ReactNode;
    readonly className?: string;
    /** Called when the user clicks "Create AtlasID" in the nav */
    readonly onSignup?: () => void;
    /** When true, the nav CTA shows "Sign In" instead of "Create AtlasID" */
    readonly isSignupScreen?: boolean;
    /** Called when the user clicks "Sign In" in the nav (on signup screen) */
    readonly onSignin?: () => void;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const NavBar: React.FC<{ onSignup?: () => void; isSignupScreen?: boolean; onSignin?: () => void }> = ({
    onSignup, isSignupScreen, onSignin,
}) => (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5">
        {/* Wordmark — always left-aligned */}
        <a href="/" className="flex items-center gap-2.5 group" aria-label={BRAND_NAME}>
            <img
                src="/atlasid-logo.png"
                alt="AtlasID"
                className="w-8 h-8 rounded-lg object-contain flex-shrink-0"
            />
            <span className="font-manrope font-bold text-lg tracking-tight text-white">
                {BRAND_NAME}
            </span>
        </a>

        {/* Nav links — hidden on signup screen and mobile */}
        {!isSignupScreen && (
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                {NAV_LINKS.map(link => (
                    <a
                        key={link.label}
                        href={link.href}
                        className="px-4 py-2 rounded-control text-body-sm font-medium text-white/65
                         hover:text-white hover:bg-white/[0.06] transition-all duration-150"
                    >
                        {link.label}
                    </a>
                ))}
            </nav>
        )}

        {/* CTA: "Sign In" during signup, "Create AtlasID" during login */}
        <button
            type="button"
            onClick={isSignupScreen ? onSignin : onSignup}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-control
                 border border-[rgba(46,119,255,0.50)] text-[#2e77ff] text-body-sm font-semibold
                 hover:bg-[rgba(46,119,255,0.10)] hover:border-[#2e77ff]
                 transition-all duration-200"
        >
            {isSignupScreen ? 'Sign In' : 'Create AtlasID'}
        </button>
    </header>
);

const FeatureCard: React.FC<{ feature: HeroFeature; delay: number }> = ({ feature, delay }) => (
    <div
        className="flex items-start gap-4 p-4 rounded-card glass-1 animate-fade-slide-up"
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
        <div
            className="flex-shrink-0 w-10 h-10 rounded-control flex items-center justify-center"
            style={{ background: 'rgba(46,119,255,0.15)' }}
        >
            <span className="material-symbols-outlined text-[#2e77ff] text-xl" aria-hidden="true">
                {feature.icon}
            </span>
        </div>
        <div>
            <p className="text-body-sm font-semibold text-white">{feature.title}</p>
            <p className="text-label text-white/50 mt-1 leading-relaxed">{feature.description}</p>
        </div>
    </div>
);

const FooterStrip: React.FC = () => (
    <footer className="absolute bottom-0 left-0 right-0 z-10 px-8 py-4 flex flex-col sm:flex-row
                     items-center justify-between gap-2">
        <span className="text-label text-white/35">{FOOTER_TEXT}</span>
        <nav className="flex items-center gap-4" aria-label="Footer navigation">
            {FOOTER_LINKS.map(link => (
                <a
                    key={link.label}
                    href={link.href}
                    className="text-label text-white/35 hover:text-white/65 transition-colors duration-150"
                >
                    {link.label}
                </a>
            ))}
        </nav>
    </footer>
);

// ─── HeroLayout ────────────────────────────────────────────────────────────────

export const HeroLayout: React.FC<HeroLayoutProps> = ({
    children, className = '', onSignup, isSignupScreen, onSignin,
}) => (
    <div
        className={`relative h-screen w-full flex overflow-hidden
                bg-[#060810] font-manrope flex-col lg:flex-row
                ${className}`}
    >
        <NavBar onSignup={onSignup} isSignupScreen={isSignupScreen} onSignin={onSignin} />

        {/* ── Left: Hero / branding panel — always visible on lg+ ─────────── */}
        <div
            className="relative hidden lg:flex flex-col justify-center flex-1 h-full overflow-hidden
                        px-8 md:px-16 xl:px-24 2xl:px-32"
            aria-label="AtlasID hero panel"
        >

            {/* Ambient glow layers */}
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                    background: `
          radial-gradient(ellipse 600px 400px at 20% 50%, rgba(46,119,255,0.15), transparent),
          radial-gradient(ellipse 400px 300px at 80% 30%, rgba(124,58,237,0.10), transparent)
        `,
                }}
            />

            {/* Grid pattern overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                aria-hidden="true"
                style={{
                    backgroundImage: `
          linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
        `,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-[640px] xl:max-w-[720px] 2xl:max-w-[840px]">
                {/* Trusted by pill badge */}
                <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill mb-6
                     border border-white/10 animate-fade-slide-up"
                    style={{
                        background: 'rgba(46,119,255,0.10)',
                        animationDelay: '0ms',
                        animationFillMode: 'both',
                    }}
                >
                    <span className="material-symbols-outlined text-[#2e77ff] text-sm" aria-hidden="true">
                        verified
                    </span>
                    <span className="text-label text-[#5b9aff] uppercase tracking-widest">
                        Trusted by 500+ institutions globally
                    </span>
                </div>

                {/* Hero headline */}
                <h1
                    className="text-display-1 font-bold text-white leading-tight mb-5 animate-fade-slide-up"
                    style={{ animationDelay: '100ms', animationFillMode: 'both', fontSize: 'clamp(2.25rem, 3.5vw, 4.5rem)' }}
                >
                    {HERO_HEADLINE}
                </h1>

                {/* Subtext */}
                <p
                    className="text-body-lg text-white/65 leading-relaxed mb-10 animate-fade-slide-up"
                    style={{ animationDelay: '200ms', animationFillMode: 'both' }}
                >
                    {HERO_SUBTEXT}
                </p>

                {/* Feature cards */}
                <div className="flex flex-col gap-3">
                    {HERO_FEATURES.map((feature, i) => (
                        <FeatureCard key={feature.title} feature={feature} delay={300 + i * 80} />
                    ))}
                </div>
            </div>
        </div>

        {/* ── Right: Form slot ─────────────────────────────────────────────────── */}
        <div
            className="relative flex-shrink-0 flex flex-col
                 w-full h-full
                 lg:w-[560px] xl:w-[660px] 2xl:w-[760px] 3xl:w-[860px]"
            aria-label="Authentication panel"
        >
            {/* Subtle panel separator */}
            <div
                className="hidden lg:block absolute left-0 top-0 bottom-0 w-px"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)' }}
                aria-hidden="true"
            />

            {/* Fixed spacer — always stays under the navbar, never scrolls away */}
            <div className="flex-shrink-0 h-24" aria-hidden="true" />

            {/* Scrollable content — only this area scrolls, so content can never go behind the nav */}
            <div className="flex-1 overflow-y-auto scrollbar-hidden px-6 xl:px-10">
                {/* min-h-full ensures justify-center works for short forms (login/OTP)
                    while tall forms (signup) simply overflow and scroll as normal */}
                <div className="min-h-full flex flex-col items-center justify-center py-3">
                    <div className="w-full max-w-auth-card">
                        {children}
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom footer strip — hidden on signup to keep form uncluttered */}
        {!isSignupScreen && <FooterStrip />}
    </div>
);
