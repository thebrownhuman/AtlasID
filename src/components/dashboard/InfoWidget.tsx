// src/components/dashboard/InfoWidget.tsx
// Generic stat / info tile — reusable for any numeric or status metric.

import React from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

type TrendDirection = 'up' | 'down' | 'neutral';

interface InfoWidgetProps {
    readonly icon: string;          // Material Symbol name
    readonly label: string;
    readonly value: string | number;
    readonly subtext?: string;
    readonly trend?: TrendDirection;
    readonly trendText?: string;
    /**
     * 'default' = subtle glass tile
     * 'highlight' = blue-tinted with stronger glow
     * 'success' = green accent
     * 'warning' = amber accent
     */
    readonly variant?: 'default' | 'highlight' | 'success' | 'warning';
    readonly className?: string;
}

// ─── Token map ─────────────────────────────────────────────────────────────────

const VARIANT_STYLES = {
    default: {
        bg: 'rgba(255,255,255,0.04)',
        border: 'rgba(255,255,255,0.09)',
        icon: 'text-white/45',
        glow: 'none',
    },
    highlight: {
        bg: 'rgba(46,119,255,0.08)',
        border: 'rgba(46,119,255,0.22)',
        icon: 'text-atlas-blue',
        glow: '0 0 24px rgba(46,119,255,0.15)',
    },
    success: {
        bg: 'rgba(34,197,94,0.07)',
        border: 'rgba(34,197,94,0.20)',
        icon: 'text-status-success',
        glow: '0 0 24px rgba(34,197,94,0.10)',
    },
    warning: {
        bg: 'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.22)',
        icon: 'text-status-warning',
        glow: '0 0 24px rgba(245,158,11,0.12)',
    },
} as const;

const TREND_ICON: Record<TrendDirection, string> = { up: 'trending_up', down: 'trending_down', neutral: 'trending_flat' };
const TREND_COLOR: Record<TrendDirection, string> = { up: 'text-status-success', down: 'text-status-error', neutral: 'text-white/40' };

// ─── InfoWidget ────────────────────────────────────────────────────────────────

export const InfoWidget: React.FC<InfoWidgetProps> = ({
    icon, label, value, subtext, trend, trendText,
    variant = 'default', className = '',
}) => {
    const s = VARIANT_STYLES[variant];

    return (
        <article
            className={`relative rounded-2xl p-5 flex flex-col gap-3 ${className}`}
            aria-label={`${label}: ${value}`}
            style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                boxShadow: s.glow,
            }}
        >
            {/* Header row: icon + label */}
            <div className="flex items-center justify-between">
                <div
                    className="w-9 h-9 rounded-control flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                    aria-hidden="true"
                >
                    <span className={`material-symbols-outlined text-xl ${s.icon}`}>{icon}</span>
                </div>
                {trend && (
                    <span
                        className={`flex items-center gap-0.5 text-label font-medium ${TREND_COLOR[trend]}`}
                        aria-label={trendText}
                    >
                        <span className="material-symbols-outlined text-base" aria-hidden="true">
                            {TREND_ICON[trend]}
                        </span>
                        {trendText}
                    </span>
                )}
            </div>

            {/* Value */}
            <div className="flex flex-col gap-0.5">
                <span className="font-manrope font-bold text-white text-2xl leading-none">{value}</span>
                <span className="text-body-sm text-white/50">{label}</span>
            </div>

            {/* Subtext */}
            {subtext && (
                <p className="text-label text-white/35 leading-relaxed border-t border-white/[0.06] pt-2">
                    {subtext}
                </p>
            )}
        </article>
    );
};

export default InfoWidget;
