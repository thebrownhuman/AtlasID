// src/components/dashboard/AppShell.tsx
// Root layout: collapsible sidebar (desktop) + top nav + scrollable main area.
// On mobile the sidebar collapses into a slide-over drawer.

import React, { useState, useCallback } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AppShellProps {
    readonly sidebar: React.ReactNode;
    readonly topNav: React.ReactNode;
    readonly children: React.ReactNode;
    readonly className?: string;
}

// ─── AppShell ──────────────────────────────────────────────────────────────────

export const AppShell: React.FC<AppShellProps> = ({
    sidebar, topNav, children, className = '',
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const openSidebar = useCallback(() => setSidebarOpen(true), []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    return (
        <div className={`flex h-screen overflow-hidden bg-surface-void ${className}`}>

            {/* ── Mobile backdrop ─────────────────────────────────────────────── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* ── Sidebar slot ────────────────────────────────────────────────── */}
            <aside
                className={[
                    'fixed inset-y-0 left-0 z-30 w-72 3xl:w-80 flex-shrink-0',
                    'transition-transform duration-300 ease-in-out',
                    'lg:relative lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                ].join(' ')}
            >
                {/* Inject open/close into sidebar children via context or clone */}
                {React.isValidElement(sidebar)
                    ? React.cloneElement(sidebar as React.ReactElement<{ onClose?: () => void }>, { onClose: closeSidebar })
                    : sidebar}
            </aside>

            {/* ── Main column ─────────────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                {/* Top nav with hamburger trigger */}
                <header className="flex-shrink-0">
                    {React.isValidElement(topNav)
                        ? React.cloneElement(topNav as React.ReactElement<{ onMenuClick?: () => void }>, { onMenuClick: openSidebar })
                        : topNav}
                </header>

                {/* Scrollable page content */}
                <main
                    className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10 3xl:p-14"
                    id="main-content"
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppShell;
