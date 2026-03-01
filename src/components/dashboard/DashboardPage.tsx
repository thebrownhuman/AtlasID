// src/components/dashboard/DashboardPage.tsx
// Full dashboard page composition — assembles AppShell with all widgets.
// Routing: activeNav state drives which page component is rendered.

import React, { useState, useEffect } from 'react';
import { AppShell } from './AppShell';
import { TopNavigation } from './TopNavigation';
import { Sidebar } from './Sidebar';
import { DigitalIdHeroCard } from './DigitalIdHeroCard';
import { InfoWidget } from './InfoWidget';
import { ActivityList } from './ActivityList';
import { DASHBOARD_STATS } from '../../data/mockData';

// ── Page imports ──────────────────────────────────────────────────────────────
import { MyIdentityPage } from './pages/MyIdentityPage';
import { ActivityPage } from './pages/ActivityPage';
import { LinkedServicesPage } from './pages/LinkedServicesPage';
import { SecurityPage } from './pages/SecurityPage';
import { SettingsPage } from './pages/SettingsPage';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DashboardPageProps {
    readonly userName?: string;
    readonly initials?: string;
    readonly onSignOut?: () => void;
    readonly className?: string;
}

// ─── QuickActions ──────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
    { icon: 'verified_user', label: 'Verify Identity', color: 'rgba(46,119,255,0.15)', text: 'text-atlas-blue', nav: 'my-identity' },
    { icon: 'link', label: 'Link Service', color: 'rgba(91,154,255,0.12)', text: 'text-atlas-blue', nav: 'linked-services' },
    { icon: 'history', label: 'View History', color: 'rgba(255,255,255,0.06)', text: 'text-white/60', nav: 'activity' },
    { icon: 'security', label: 'Security Check', color: 'rgba(34,197,94,0.12)', text: 'text-status-success', nav: 'security' },
] as const;

// ─── OverviewPage (default) ────────────────────────────────────────────────────

const OverviewPage: React.FC<{
    userName: string;
    initials: string;
    onNavigate: (page: string) => void;
}> = ({ userName, initials, onNavigate }) => {
    const today = new Date().toISOString().slice(0, 10);
    const expiry = new Date(Date.now() + 365 * 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    return (
        <div className="max-w-6xl xl:max-w-7xl mx-auto space-y-6 sm:space-y-8 3xl:space-y-10">

            {/* ── Hero ID card ─────────────────────────────────────────────── */}
            <DigitalIdHeroCard
                fullName={userName}
                idNumber="ATL-2026-884921"
                email="alex@atlasid.com"
                initials={initials}
                issuedDate={today}
                expiryDate={expiry}
                verifyScore={94}
            />

            {/* ── Stats grid ───────────────────────────────────────────────── */}
            <div>
                <h2 className="text-body-md font-semibold text-white mb-4">Identity Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {DASHBOARD_STATS.map(stat => (
                        <InfoWidget
                            key={stat.label}
                            icon={stat.icon}
                            label={stat.label}
                            value={stat.value}
                            subtext={stat.subtext}
                            trend={stat.trend}
                            trendText={stat.trendText}
                            variant={stat.variant as 'default' | 'highlight' | 'success' | 'warning'}
                        />
                    ))}
                </div>
            </div>

            {/* ── Lower grid: activity + quick actions ─────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Activity feed */}
                <div className="lg:col-span-2">
                    <ActivityList maxItems={5} onViewAll={() => onNavigate('activity')} />
                </div>

                {/* Quick actions panel */}
                <aside
                    className="rounded-2xl overflow-hidden"
                    aria-label="Quick actions"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                    <div className="px-5 py-4 border-b border-white/[0.06]">
                        <h2 className="text-body-md font-semibold text-white">Quick Actions</h2>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-3">
                        {QUICK_ACTIONS.map(({ icon, label, color, text, nav }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => onNavigate(nav)}
                                className="flex flex-col items-center gap-2.5 p-4 rounded-xl
                                           hover:scale-[1.03] active:scale-[0.97]
                                           transition-all duration-200 border border-white/[0.07]"
                                style={{ background: color }}
                                aria-label={label}
                            >
                                <span className={`material-symbols-outlined text-2xl ${text}`} aria-hidden="true">
                                    {icon}
                                </span>
                                <span className="text-label font-semibold text-white/65 text-center leading-tight">
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Security bar */}
                    <div className="mx-4 mb-4 rounded-xl px-4 py-3"
                        style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)' }}>
                        <div className="flex items-center justify-between">
                            <span className="text-label font-semibold text-white/60">Security Score</span>
                            <span className="text-body-sm font-bold text-status-success">94/100</span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-pill overflow-hidden bg-white/10">
                            <div
                                className="h-full rounded-pill bg-status-success"
                                style={{ width: '94%', transition: 'width 1s ease' }}
                                role="progressbar"
                                aria-valuenow={94}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

// ─── DashboardPage ─────────────────────────────────────────────────────────────

export const DashboardPage: React.FC<DashboardPageProps> = ({
    userName = 'Alex Chen',
    initials = 'AC',
    onSignOut,
    className = '',
}) => {
    const [activeNav, setActiveNav] = useState('overview');
    const [isDark, setIsDark] = useState<boolean>(() => {
        // Persist preference across sessions
        return localStorage.getItem('atlasid-theme') !== 'light';
    });

    useEffect(() => {
        const html = document.documentElement;
        if (isDark) {
            html.classList.remove('light');
            html.classList.add('dark');
            localStorage.setItem('atlasid-theme', 'dark');
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
            localStorage.setItem('atlasid-theme', 'light');
        }
    }, [isDark]);

    const renderPage = () => {
        switch (activeNav) {
            case 'identity': return <MyIdentityPage />;
            case 'activity': return <ActivityPage />;
            case 'linked': return <LinkedServicesPage />;
            case 'verify': return <MyIdentityPage />;
            case 'security': return <SecurityPage />;
            case 'settings': return <SettingsPage />;
            default: return <OverviewPage userName={userName} initials={initials} onNavigate={setActiveNav} />;
        }
    };

    return (
        <div className={className}>
            <AppShell
                sidebar={
                    <Sidebar
                        activeItem={activeNav}
                        onItemClick={setActiveNav}
                    />
                }
                topNav={
                    <TopNavigation
                        initials={initials}
                        userName={userName}
                        onSignOut={onSignOut}
                        onNavigate={setActiveNav}
                        isDark={isDark}
                        onThemeToggle={() => setIsDark(d => !d)}
                    />
                }
            >
                {renderPage()}
            </AppShell>
        </div>
    );
};

export default DashboardPage;
