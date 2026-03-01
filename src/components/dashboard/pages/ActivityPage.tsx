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
    { id: '1', type: 'login', icon: 'login', title: 'Sign In', description: 'Signed in via Chrome on Windows', time: '2 hours ago', location: 'London, UK' },
    { id: '2', type: 'verification', icon: 'verified_user', title: 'Identity Verified', description: 'Verified by NovaPay Bank for KYC check', time: '5 hours ago', location: 'Automated' },
    { id: '3', type: 'document', icon: 'upload_file', title: 'Document Uploaded', description: 'Passport added to your identity profile', time: 'Yesterday', location: 'London, UK' },
    { id: '4', type: 'service', icon: 'link', title: 'Service Linked', description: 'TravelCore connected to your AtlasID', time: 'Yesterday', location: 'Automated' },
    { id: '5', type: 'login', icon: 'smartphone', title: 'Sign In', description: 'Signed in via Safari on iPhone', time: '3 days ago', location: 'New York, US' },
    { id: '6', type: 'security', icon: 'security', title: '2FA Code Requested', description: 'Authenticator code used for login', time: '3 days ago', location: 'New York, US' },
    { id: '7', type: 'security', icon: 'lock_reset', title: 'Password Changed', description: 'Account password was updated successfully', time: '5 days ago', location: 'London, UK' },
    { id: '8', type: 'logout', icon: 'logout', title: 'Sign Out', description: 'Session ended on Chrome / Windows', time: '5 days ago', location: 'London, UK' },
    { id: '9', type: 'verification', icon: 'badge', title: 'ID Card Issued', description: 'Digital AtlasID card generated', time: '7 days ago', location: 'Automated' },
    { id: '10', type: 'login', icon: 'computer', title: 'Sign In', description: 'Signed in via Firefox on macOS', time: '10 days ago', location: 'London, UK' },
];

const EVENT_STYLE: Record<EventType, { bg: string; border: string; icon: string }> = {
    login: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.35)', icon: 'text-status-success' },
    verification: { bg: 'rgba(46,119,255,0.15)', border: 'rgba(46,119,255,0.35)', icon: 'text-atlas-blue' },
    document: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)', icon: 'text-status-warning' },
    service: { bg: 'rgba(46,119,255,0.12)', border: 'rgba(46,119,255,0.25)', icon: 'text-atlas-blue' },
    security: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', icon: 'text-status-warning' },
    logout: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', icon: 'text-white/40' },
};

const STATS = [
    { label: 'Total Events', value: '47', icon: 'timeline', color: 'text-atlas-blue' },
    { label: 'Verifications', value: '12', icon: 'verified_user', color: 'text-status-success' },
    { label: 'Failed Attempts', value: '0', icon: 'block', color: 'text-status-success' },
];

export const ActivityPage: React.FC = () => {
    const [visibleCount, setVisibleCount] = useState(6);

    return (
        <div className="flex flex-col gap-8">

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-display-3 font-bold text-white">Activity</h1>
                    <p className="text-body-sm text-white/50 mt-1">Complete audit log of your identity events</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-control"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
                    <span className="material-symbols-outlined text-base text-white/50" aria-hidden="true">calendar_month</span>
                    <span className="text-body-sm text-white/65 font-medium">Last 7 days</span>
                    <span className="material-symbols-outlined text-base text-white/40" aria-hidden="true">expand_more</span>
                </div>
            </div>

            {/* ── Stats row ───────────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-4">
                {STATS.map(stat => (
                    <div
                        key={stat.label}
                        className="rounded-2xl px-5 py-4 flex items-center gap-4"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        <span className={`material-symbols-outlined text-2xl ${stat.color}`} aria-hidden="true">
                            {stat.icon}
                        </span>
                        <div>
                            <p className="text-display-3 font-bold text-white leading-none">{stat.value}</p>
                            <p className="text-label text-white/45 mt-0.5">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Timeline ────────────────────────────────────────────────────── */}
            <div className="rounded-2xl p-6 flex flex-col gap-0"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <h2 className="text-body-md font-semibold text-white mb-6">Timeline</h2>

                <div className="relative flex flex-col gap-0">
                    {/* Vertical line */}
                    <div
                        className="absolute left-5 top-2 bottom-2 w-px"
                        style={{ background: 'linear-gradient(to bottom, rgba(46,119,255,0.40), rgba(46,119,255,0.05))' }}
                        aria-hidden="true"
                    />

                    {ALL_EVENTS.slice(0, visibleCount).map((event, i) => {
                        const style = EVENT_STYLE[event.type];
                        return (
                            <div key={event.id} className={`relative flex gap-5 ${i < visibleCount - 1 ? 'pb-5' : ''}`}>
                                {/* Icon circle */}
                                <div
                                    className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center`}
                                    style={{ background: style.bg, border: `1px solid ${style.border}` }}
                                >
                                    <span className={`material-symbols-outlined text-lg ${style.icon}`} aria-hidden="true">
                                        {event.icon}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pt-1">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div>
                                            <p className="text-body-sm font-semibold text-white">{event.title}</p>
                                            <p className="text-label text-white/50 mt-0.5">{event.description}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-label text-white/40">{event.time}</p>
                                            {event.location && (
                                                <p className="text-label text-white/30 mt-0.5">{event.location}</p>
                                            )}
                                        </div>
                                    </div>
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
                        className="mt-6 self-center flex items-center gap-2 px-5 py-2 rounded-control
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
