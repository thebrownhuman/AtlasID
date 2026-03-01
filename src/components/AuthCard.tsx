// src/components/AuthCard.tsx
// Glassmorphic container card for any auth form.
// Implements Glass Level 2 surface from the AtlasID design system.

import React from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface AuthCardProps {
    readonly title: string;
    readonly subtitle?: string;
    readonly badge?: React.ReactNode;
    readonly footer?: React.ReactNode;
    readonly children: React.ReactNode;
    readonly className?: string;
}

// ─── AuthCard ──────────────────────────────────────────────────────────────────

export const AuthCard: React.FC<AuthCardProps> = ({
    title,
    subtitle,
    badge,
    footer,
    children,
    className = '',
}) => (
    <article
        className={`relative w-full rounded-card glass-2 shadow-elevation-3 overflow-hidden ${className}`}
        aria-label={title}
    >
        {/* Top blue accent stripe */}
        <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #2e77ff, transparent)' }}
            aria-hidden="true"
        />

        {/* Corner glow */}
        <div
            className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(46,119,255,0.12), transparent 70%)' }}
            aria-hidden="true"
        />

        {/* ── Card body ──────────────────────────────────────────────────────── */}
        <div className="relative z-10 px-6 pt-5 pb-4">
            {/* Header */}
            <header className="mb-4">
                {badge && <div className="mb-3">{badge}</div>}

                <h2 className="text-display-3 font-bold text-white leading-tight">
                    {title}
                </h2>

                {subtitle && (
                    <p className="text-body-sm text-white/60 mt-2 leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </header>

            {/* ── Form slot ────────────────────────────────────────────────────── */}
            <div>{children}</div>
        </div>

        {/* ── Optional footer ─────────────────────────────────────────────────── */}
        {footer && (
            <footer
                className="relative z-10 px-6 py-3 flex items-center justify-center
                   border-t border-white/[0.06]"
                style={{ background: 'rgba(0,0,0,0.15)' }}
            >
                {footer}
            </footer>
        )}
    </article>
);

export default AuthCard;
