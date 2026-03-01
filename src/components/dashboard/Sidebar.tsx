// src/components/dashboard/Sidebar.tsx
// Collapsible left navigation with branding, nav groups, and user meta.
// Accepts onClose prop injected by AppShell for mobile drawer close.

import React from 'react';
import { BRAND_NAME, SIDEBAR_NAV_ITEMS } from '../../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SidebarProps {
    /** Currently active route/section */
    readonly activeItem?: string;
    readonly onItemClick?: (id: string) => void;
    /** Injected by AppShell via cloneElement — closes mobile drawer */
    readonly onClose?: () => void;
    readonly className?: string;
}

// ─── NavItem ───────────────────────────────────────────────────────────────────

interface NavItemData {
    readonly id: string;
    readonly icon: string;
    readonly label: string;
    readonly badge?: number;
}

const NavItem: React.FC<{
    item: NavItemData;
    active: boolean;
    onClick: () => void;
}> = ({ item, active, onClick }) => (
    <li>
        <button
            type="button"
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
            className={[
                'w-full flex items-center gap-3 px-3 py-2.5 3xl:py-3.5 3xl:px-4 rounded-control transition-all duration-150',
                'text-body-sm 3xl:text-base font-medium group',
                active
                    ? 'bg-atlas-blue/15 text-white border border-atlas-blue/25 shadow-glow-blue-sm'
                    : 'text-white/55 hover:text-white/85 hover:bg-white/[0.05] border border-transparent',
            ].join(' ')}
        >
            <span
                className={`material-symbols-outlined text-xl flex-shrink-0 transition-colors duration-150 ${active ? 'text-atlas-blue' : 'text-white/35 group-hover:text-white/55'
                    }`}
                aria-hidden="true"
            >
                {item.icon}
            </span>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
                <span
                    className="flex-shrink-0 min-w-[18px] h-4.5 rounded-pill bg-atlas-blue
                     text-white text-[10px] font-bold flex items-center justify-center px-1"
                    aria-label={`${item.badge} items`}
                >
                    {item.badge}
                </span>
            )}
        </button>
    </li>
);

// ─── Sidebar ───────────────────────────────────────────────────────────────────

export const Sidebar: React.FC<SidebarProps> = ({
    activeItem = 'overview', onItemClick, onClose, className = '',
}) => (
    <div
        className={`h-full w-full flex flex-col glass-3 ${className}`}
    >
        {/* ── Brand ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 h-16 3xl:h-20 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
                <img
                    src="/atlasid-logo.png"
                    alt="AtlasID logo"
                    className="w-8 h-8 rounded-lg flex-shrink-0 object-contain"
                />
                <span className="font-manrope font-bold text-white text-lg tracking-tight">
                    {BRAND_NAME}
                </span>
            </div>
            {/* Close button — mobile only */}
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="lg:hidden w-7 h-7 flex items-center justify-center rounded text-white/40
                     hover:text-white/70 transition-colors duration-150"
                    aria-label="Close navigation"
                >
                    <span className="material-symbols-outlined text-lg" aria-hidden="true">close</span>
                </button>
            )}
        </div>

        {/* ── Nav groups ──────────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Primary navigation">
            {SIDEBAR_NAV_ITEMS.map(group => (
                <div key={group.group}>
                    <p className="px-3 mb-2 text-label font-semibold text-white/30 uppercase tracking-widest">
                        {group.group}
                    </p>
                    <ul className="space-y-0.5">
                        {group.items.map(item => (
                            <NavItem
                                key={item.id}
                                item={item}
                                active={item.id === activeItem}
                                onClick={() => { onItemClick?.(item.id); onClose?.(); }}
                            />
                        ))}
                    </ul>
                </div>
            ))}
        </nav>

    </div>
);

export default Sidebar;
