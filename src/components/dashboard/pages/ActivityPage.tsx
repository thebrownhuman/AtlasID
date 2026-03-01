// src/components/dashboard/pages/ActivityPage.tsx
// Activity log with timeline, stats, and load-more.

import React, { useState } from 'react';

type EventType = 'login' | 'verification' | 'document' | 'service' | 'security' | 'logout';

interface ActivityEvent {
    readonly id: string;
    readonly type: EventType;
    readonly title: string;
    readonly description: string;
    readonly time: string;
    readonly location?: string;
    readonly icon: string;
}

const ALL_EVENTS: ActivityEvent[] = [
    { id: '1',  type: 'login',        icon: 'login',        title: 'Sign In',             description: 'Signed in via Chrome on Windows',              time: '2 hours ago',  location: 'London, UK'  },
    { id: '2',  type: 'verification', icon: 'verified_user', title: 'Identity Verified',   description: 'Verified by NovaPay Bank for KYC check',        time: '5 hours ago',  location: 'Automated'   },
    { id: '3',  type: 'document',     icon: 'upload_file',   title: 'Document Uploaded',   description: 'Passport added to your identity profile',       time: 'Yesterday',    location: 'London, UK'  },
    { id: '4',  type: 'service',      icon: 'link',          title: 'Service Linked',      description: 'TravelCore connected to your AtlasID',          time: 'Yesterday',    location: 'Automated'   },
    { id: '5',  type: 'login',        icon: 'smartphone',    title: 'Sign In',             description: 'Signed in via Safari on iPhone',                time: '3 days ago',   location: 'New York, US'},
    { id: '6',  type: 'security',     icon: 'security',      title: '2FA Code Requested',  description: 'Authenticator code used for login',             time: '3 days ago',   location: 'New York, US'},
    { id: '7',  type: 'security',     icon: 'lock_reset',    title: 'Password Changed',    description: 'Account password was updated successfully',     time: '5 days ago',   location: 'London, UK'  },
    { id: '8',  type: 'logout',       icon: 'logout',        title: 'Sign Out',            description: 'Session ended on Chrome / Windows',            time: '5 days ago',   location: 'London, UK'  },
    { id: '9',  type: 'verification', icon: 'badge',         title: 'ID Card Issued',      description: 'Digital AtlasID card generated',               time: '7 days ago',   location: 'Automated'   },
    { id: '10', type: 'login',        icon: 'computer',      title: 'Sign In',             description: 'Signed in via Firefox on macOS',               time: '10 days ago',  location: 'London, UK'  },
];

const EVENT_STYLE: Record<EventType, { bg: string; border: string; icon: string }> = {
    login:        { bg: 'rgba(34,197,94,0.15)',   border: 'rgba(34,197,94,0.35)',   icon: 'text-status-success'  },
    verification: { bg: 'rgba(46,119,255,0.15)',  border: 'rgba(46,119,255,0.35)',  icon: 'text-atlas-blue'      },
    document:     { bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.35)',  icon: 'text-status-warning'  },
    service:      { bg: 'rgba(46,119,255,0.12)',  border: 'rgba(46,119,255,0.25)',  icon: 'text-atlas-blue'      },
    security:     { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  icon: 'text-status-warning'  },
    logout:       { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', icon: 'text-white/40'        },
};

const STATS = [
    { label: 'Total Events',    value: '47', icon: 'timeline',     color: 'text-atlas-blue'     },
    { label: 'Verifications',   value: '12', icon: 'verified_user', color: 'text-status-success' },
    { label: 'Failed Attempts', value: '0',  icon: 'block',         color: 'text-status-success' },
];

export const ActivityPage: React.FC = () => {
    const [visibleCount, setVisibleCount] = useState(6);

    return (
        <div className="flex flex-col gap-5 sm:gap-8">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-display-3 font-bold text-white">Activity</h1>
                    <p className="text-body-sm text-white/50 mt-0.5">Complete audit log of your identity events</p>
                </div>
                <div
                    className="flex items-center gap-1.5 px-3 py-2 rounded-control flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
                >
                    <span className="material-symbols-outlined text-base text-white/50" aria-hidden="true">calendar_month</span>
                    <span className="text-body-sm text-white/65 font-medium whitespace-nowrap">Last 7 days</span>
                    <span className="material-symbols-outlined text-base text-white/40" aria-hidden="true">expand_more</span>
                </div>
            </div>

            {/* ── Stats row ───────────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {STATS.map(stat => (
                    <div
                        key={stat.label}
                        className="rounded-xl sm:rounded-2xl px-3 py-3 sm:px-5 sm:py-4
                                   flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <span className={`material-symbols-outlined text-xl sm:text-2xl ${stat.color}`} aria-hidden="true">
                            {stat.icon}
                        </span>
                        <div className="text-center sm:text-left">
                            <p className="text-lg sm:text-display-3 font-bold text-white leading-none">{stat.value}</p>
                            <p className="text-[10px] sm:text-label text-white/45 mt-0.5 leading-tight">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Timeline ────────────────────────────────────────────────────── */}
            <div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-0"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
                <h2 className="text-body-md font-semibold text-white mb-5">Timeline</h2>

                <div className="relative flex flex-col gap-0">
                    {/* Vertical connector line */}
                    <div
                        className="absolute left-4 top-2 bottom-2 w-px"
                        style={{ background: 'linear-gradient(to bottom, rgba(46,119,255,0.40), rgba(46,119,255,0.05))' }}
                        aria-hidden="true"
                    />

                    {ALL_EVENTS.slice(0, visibleCount).map((event, i) => {
                        const style = EVENT_STYLE[event.type];
                        const isLast = i === Math.min(visibleCount, ALL_EVENTS.length) - 1;
                        return (
                            <div key={event.id} className={`relative flex gap-3 sm:gap-5 ${!isLast ? 'pb-4 sm:pb-5' : ''}`}>

                                {/* Icon circle */}
                                <div
                                    className="relative z-10 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10
                                               rounded-full flex items-center justify-center"
                                    style={{ background: style.bg, border: `1px solid ${style.border}` }}
                                >
                                    <span className={`material-symbols-outlined text-base sm:text-lg ${style.icon}`} aria-hidden="true">
                                        {event.icon}
                                    </span>
                                </div>

                                {/* Content — always stacked, time inline at bottom */}
                                <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                                    {/* Title + time on same row (desktop), stacked (mobile) */}
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-body-sm font-semibold text-white leading-snug">
                                            {event.title}
                                        </p>
                                        {/* Time — always shown top-right, never wraps */}
                                        <span className="text-label text-white/40 whitespace-nowrap flex-shrink-0">
                                            {event.time}
                                        </span>
                                    </div>
                                    <p className="text-label text-white/50 mt-0.5 leading-snug">
                                        {event.description}
                                    </p>
                                    {event.location && (
                                        <p className="text-label text-white/30 mt-1 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs" aria-hidden="true">location_on</span>
                                            {event.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Load more */}
                {visibleCount < ALL_EVENTS.length && (
                    <button
                        type="button"
                        onClick={() => setVisibleCount(prev => Math.min(prev + 4, ALL_EVENTS.length))}
                        className="mt-5 self-center flex items-center gap-2 px-5 py-2 rounded-control
                                   text-body-sm font-semibold text-white/55 hover:text-white
                                   border border-white/[0.10] hover:border-white/25 hover:bg-white/[0.04]
                                   transition-all duration-200"
                    >
                        <span className="material-symbols-outlined text-base" aria-hidden="true">expand_more</span>
                        Load more
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActivityPage;
