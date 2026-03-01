// src/components/dashboard/ActivityList.tsx
// Scrollable chronological event feed for the dashboard.
// Each item shows an icon, event title, detail text, timestamp, and status pill.

import React from 'react';
import { ACTIVITY_ITEMS } from '../../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ActivityStatus = 'success' | 'warning' | 'error' | 'info';

export interface ActivityItem {
    readonly id: string;
    readonly icon: string;   // Material Symbol name
    readonly title: string;
    readonly detail: string;
    readonly timestamp: string;   // Human-readable e.g. "2 hours ago"
    readonly status: ActivityStatus;
}

interface ActivityListProps {
    readonly items?: readonly ActivityItem[];
    readonly maxItems?: number;
    readonly onViewAll?: () => void;
    readonly className?: string;
}

// ─── Status token map ──────────────────────────────────────────────────────────

const STATUS_DOT: Record<ActivityStatus, string> = {
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    error: 'bg-status-error',
    info: 'bg-atlas-blue',
};

const STATUS_ICON_COLOR: Record<ActivityStatus, string> = {
    success: 'text-status-success',
    warning: 'text-status-warning',
    error: 'text-status-error',
    info: 'text-atlas-blue',
};

const STATUS_BG: Record<ActivityStatus, string> = {
    success: 'rgba(34,197,94,0.10)',
    warning: 'rgba(245,158,11,0.10)',
    error: 'rgba(239,68,68,0.10)',
    info: 'rgba(46,119,255,0.10)',
};

// ─── ActivityListItem ──────────────────────────────────────────────────────────

const ActivityListItem: React.FC<{ item: ActivityItem; isLast: boolean }> = ({ item, isLast }) => (
    <li className={`flex items-start gap-3.5 px-5 py-4 ${!isLast ? 'border-b border-white/[0.05]' : ''}`}>
        {/* Icon badge */}
        <div
            className="flex-shrink-0 w-9 h-9 rounded-control flex items-center justify-center mt-0.5"
            style={{ background: STATUS_BG[item.status], border: `1px solid ${STATUS_BG[item.status].replace('0.10', '0.25')}` }}
            aria-hidden="true"
        >
            <span className={`material-symbols-outlined text-base ${STATUS_ICON_COLOR[item.status]}`}>
                {item.icon}
            </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
                <p className="text-body-sm font-semibold text-white truncate">{item.title}</p>
                <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[item.status]}`} aria-hidden="true" />
                    <time className="text-label text-white/35 whitespace-nowrap">{item.timestamp}</time>
                </div>
            </div>
            <p className="text-label text-white/50 mt-0.5 leading-relaxed">{item.detail}</p>
        </div>
    </li>
);

// ─── ActivityList ──────────────────────────────────────────────────────────────

export const ActivityList: React.FC<ActivityListProps> = ({
    items = ACTIVITY_ITEMS, maxItems = 6, onViewAll, className = '',
}) => {
    const visible = items.slice(0, maxItems);

    return (
        <section
            className={`rounded-2xl overflow-hidden ${className}`}
            aria-label="Recent activity"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <h2 className="text-body-md font-semibold text-white">Recent Activity</h2>
                {onViewAll && (
                    <button
                        type="button"
                        onClick={onViewAll}
                        className="text-label font-medium text-atlas-blue hover:text-white
                       transition-colors duration-150"
                    >
                        View all →
                    </button>
                )}
            </div>

            {/* List */}
            {visible.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <span className="material-symbols-outlined text-white/20 text-4xl" aria-hidden="true">
                        history
                    </span>
                    <p className="text-body-sm text-white/35">No activity yet</p>
                </div>
            ) : (
                <ul aria-label="Activity items">
                    {visible.map((item, i) => (
                        <ActivityListItem key={item.id} item={item} isLast={i === visible.length - 1} />
                    ))}
                </ul>
            )}

            {/* Footer show-more */}
            {items.length > maxItems && (
                <button
                    type="button"
                    onClick={onViewAll}
                    className="w-full py-3 text-body-sm font-medium text-white/40
                     hover:text-white/70 hover:bg-white/[0.03]
                     border-t border-white/[0.06] transition-all duration-150"
                >
                    Show {items.length - maxItems} more events
                </button>
            )}
        </section>
    );
};

export default ActivityList;
