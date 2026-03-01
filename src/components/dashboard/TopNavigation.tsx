// src/components/dashboard/TopNavigation.tsx
// Sticky top bar for the dashboard: hamburger menu (mobile), breadcrumb,
// global search, notification bell, and user avatar menu.

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BRAND_NAME } from '../../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TopNavigationProps {
    /** Avatar initials to display */
    readonly initials?: string;
    readonly userName?: string;
    /** Injected by AppShell via cloneElement */
    readonly onMenuClick?: () => void;
    readonly onSignOut?: () => void;
    readonly onNavigate?: (page: string) => void;
    readonly isDark?: boolean;
    readonly onThemeToggle?: () => void;
    readonly className?: string;
}

// ─── SearchBar ─────────────────────────────────────────────────────────────────

const SearchBar: React.FC = () => {
    const [focused, setFocused] = useState(false);
    return (
        <div
            className={[
                'hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-control',
                'border transition-all duration-200',
                focused
                    ? 'border-atlas-blue bg-white/[0.06] shadow-glow-blue-sm'
                    : 'border-white/[0.10] bg-white/[0.04]',
                'max-w-xs 3xl:max-w-md w-full',
            ].join(' ')}
        >
            <span className="material-symbols-outlined text-white/35 text-base" aria-hidden="true">
                search
            </span>
            <input
                type="search"
                placeholder="Search AtlasID…"
                aria-label="Search"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="flex-1 bg-transparent text-white text-body-sm placeholder:text-white/30
                   focus:outline-none min-w-0"
            />
            <kbd className="hidden md:block text-white/25 text-xs px-1 py-0.5 rounded border border-white/10
                      font-mono leading-none">
                ⌘K
            </kbd>
        </div>
    );
};

// ─── NotificationBell ──────────────────────────────────────────────────────────

const NotificationBell: React.FC<{ count?: number }> = ({ count = 3 }) => (
    <button
        type="button"
        className="relative w-9 h-9 rounded-control flex items-center justify-center
               border border-white/[0.10] bg-white/[0.04]
               hover:bg-white/[0.08] hover:border-white/20
               transition-all duration-200"
        aria-label={`${count} notifications`}
    >
        <span className="material-symbols-outlined text-white/65 text-xl" aria-hidden="true">
            notifications
        </span>
        {count > 0 && (
            <span
                className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-pill
                   bg-atlas-blue text-white text-[10px] font-bold flex items-center
                   justify-center px-0.5"
                aria-hidden="true"
            >
                {count > 9 ? '9+' : count}
            </span>
        )}
    </button>
);

// ─── AvatarMenu ────────────────────────────────────────────────────────────────

const AvatarMenu: React.FC<{
    initials: string;
    userName: string;
    onSignOut?: () => void;
    onNavigate?: (page: string) => void;
    isDark?: boolean;
    onThemeToggle?: () => void;
}> = ({ initials, userName, onSignOut, onNavigate, isDark = true, onThemeToggle }) => {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, right: 0, width: 0 });
    const btnRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Calculate fixed position from button rect when opening
    const handleToggle = () => {
        if (!open && btnRef.current) {
            const r = btnRef.current.getBoundingClientRect();
            setPos({
                top: r.bottom + 8,
                right: window.innerWidth - r.right,
                width: Math.max(r.width, 160),
            });
        }
        setOpen(o => !o);
    };

    // Close only when clicking OUTSIDE both the button AND the dropdown
    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => {
            const inBtn = btnRef.current?.contains(e.target as Node);
            const inMenu = dropdownRef.current?.contains(e.target as Node);
            if (!inBtn && !inMenu) setOpen(false);
        };
        const closeOnScroll = () => setOpen(false);
        document.addEventListener('mousedown', close);
        document.addEventListener('scroll', closeOnScroll, true);
        return () => {
            document.removeEventListener('mousedown', close);
            document.removeEventListener('scroll', closeOnScroll, true);
        };
    }, [open]);

    const dropdown = open ? createPortal(
        <div
            ref={dropdownRef}
            style={{
                position: 'fixed',
                top: pos.top,
                right: pos.right,
                minWidth: pos.width,
                zIndex: 99999,
            }}
            className="rounded-card py-1 glass-2 border border-white/[0.10]
                        shadow-elevation-3 animate-fade-slide-up"
            role="menu"
            aria-label="Account options"
        >
            {[
                { icon: 'person',   label: 'Profile',        page: 'identity' },
                { icon: 'settings', label: 'Settings',        page: 'settings' },
                { icon: 'help',     label: 'Help & Support',  page: null },
            ].map(({ icon, label, page }) => (
                <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => { setOpen(false); if (page) onNavigate?.(page); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-white/70
                     hover:text-white hover:bg-white/[0.06] transition-colors duration-150 whitespace-nowrap"
                >
                    <span className="material-symbols-outlined text-base text-white/40" aria-hidden="true">
                        {icon}
                    </span>
                    {label}
                </button>
            ))}

            {/* Theme toggle */}
            <button
                type="button"
                role="menuitem"
                onClick={onThemeToggle}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-white/70
                 hover:text-white hover:bg-white/[0.06] transition-colors duration-150 whitespace-nowrap"
            >
                <span className="material-symbols-outlined text-base text-white/40" aria-hidden="true">
                    {isDark ? 'light_mode' : 'dark_mode'}
                </span>
                {isDark ? 'Light mode' : 'Dark mode'}
            </button>

            <div className="border-t border-white/[0.08] mt-1 pt-1">
                <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setOpen(false); onSignOut?.(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-body-sm
                     text-status-error/70 hover:text-status-error hover:bg-status-error/[0.06]
                     transition-colors duration-150 whitespace-nowrap"
                >
                    <span className="material-symbols-outlined text-base" aria-hidden="true">logout</span>
                    Sign out
                </button>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={handleToggle}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Account menu"
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-control
                   border border-white/[0.10] bg-white/[0.04]
                   hover:bg-white/[0.08] hover:border-white/20
                   transition-all duration-200"
            >
                <div
                    className="w-7 h-7 rounded-full flex items-center justify-center
                     text-xs font-bold text-white flex-shrink-0"
                    style={{
                        background: 'linear-gradient(135deg,rgba(46,119,255,0.60),rgba(91,154,255,0.35))',
                        border: '1px solid rgba(46,119,255,0.40)',
                    }}
                    aria-hidden="true"
                >
                    {initials.slice(0, 2).toUpperCase()}
                </div>
                <span className="hidden md:block text-body-sm font-medium text-white/80 max-w-[80px] truncate">
                    {userName}
                </span>
                <span className="material-symbols-outlined text-white/40 text-base" aria-hidden="true">
                    expand_more
                </span>
            </button>
            {dropdown}
        </>
    );
};

// ─── TopNavigation ─────────────────────────────────────────────────────────────

export const TopNavigation: React.FC<TopNavigationProps> = ({
    initials = 'AC', userName = 'Alex Chen', onMenuClick, onSignOut,
    onNavigate, isDark = true, onThemeToggle, className = '',
}) => (
    <nav
        className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-6 h-14 sm:h-16 3xl:h-20
                border-b border-white/[0.06] glass-2 ${className}`}
        aria-label="Top navigation"
    >
        {/* Hamburger (mobile only) */}
        <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-control
                 border border-white/[0.10] bg-white/[0.04]
                 hover:bg-white/[0.08] transition-colors duration-150"
            aria-label="Open navigation menu"
        >
            <span className="material-symbols-outlined text-white/65 text-xl" aria-hidden="true">menu</span>
        </button>

        {/* Brand (mobile) */}
        <span className="lg:hidden font-manrope font-bold text-white tracking-tight text-lg">
            {BRAND_NAME}
        </span>

        <div className="flex-1" />

        <SearchBar />
        <NotificationBell count={3} />
        <AvatarMenu
            initials={initials}
            userName={userName}
            onSignOut={onSignOut}
            onNavigate={onNavigate}
            isDark={isDark}
            onThemeToggle={onThemeToggle}
        />
    </nav>
);

export default TopNavigation;
