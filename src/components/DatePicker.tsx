// src/components/DatePicker.tsx
// Custom dark-themed date picker with 3-view navigation:
//   Day grid → click header → Year grid → pick year → Month grid → pick month → Day grid
// Rendered via React portal so it floats above all overflow/scroll containers.

import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';

// ─── Constants ──────────────────────────────────────────────────────────────────

const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES  = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_FULL   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const YEAR_PAGE_SIZE = 16; // 4 × 4 grid

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstWeekday(y: number, m: number) { return new Date(y, m, 1).getDay(); }

type CalView = 'day' | 'month' | 'year';

// ─── Types ───────────────────────────────────────────────────────────────────────

interface CalendarPos { top: number; left: number; width: number; }

interface DatePickerProps {
    readonly label: string;
    readonly name: string;
    readonly value: string;           // YYYY-MM-DD or ''
    readonly error?: string;
    readonly required?: boolean;
    readonly onChange: (value: string) => void;
    readonly className?: string;
}

// ─── DatePicker ──────────────────────────────────────────────────────────────────

export const DatePicker: React.FC<DatePickerProps> = ({
    label, name, value, error, required, onChange, className = '',
}) => {
    const uid    = useId();
    const errorId = `${uid}-err`;

    const today  = new Date();
    const parsed = value ? new Date(value + 'T00:00:00') : null;

    // ── State ──
    const [isOpen,    setIsOpen]    = useState(false);
    const [calPos,    setCalPos]    = useState<CalendarPos>({ top: 0, left: 0, width: 0 });
    const [calView,   setCalView]   = useState<CalView>('day');
    const [viewYear,  setViewYear]  = useState(parsed?.getFullYear()  ?? today.getFullYear() - 20);
    const [viewMonth, setViewMonth] = useState(parsed?.getMonth()     ?? today.getMonth());
    // Year-grid page: starting year of the 4×4 block currently visible
    const [yearPageStart, setYearPageStart] = useState(
        Math.floor((parsed?.getFullYear() ?? today.getFullYear()) / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE
    );

    const triggerRef = useRef<HTMLButtonElement>(null);

    // ── Open: measure trigger position ──
    const open = () => {
        if (triggerRef.current) {
            const r = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - r.bottom;
            const calH = 360;
            const top  = spaceBelow > calH ? r.bottom + 6 : r.top - calH - 6;
            setCalPos({ top, left: r.left, width: r.width });
        }
        setCalView('day');
        setIsOpen(o => !o);
    };

    // ── Close ──
    const close = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        if (!isOpen) return;
        const onKey    = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
        const onScroll = () => close();
        const onMouse  = (e: MouseEvent) => {
            const cal = document.getElementById(`dp-cal-${uid}`);
            if (cal && !cal.contains(e.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(e.target as Node)) close();
        };
        document.addEventListener('keydown',   onKey);
        document.addEventListener('mousedown', onMouse);
        window  .addEventListener('scroll',    onScroll, true);
        return () => {
            document.removeEventListener('keydown',   onKey);
            document.removeEventListener('mousedown', onMouse);
            window  .removeEventListener('scroll',    onScroll, true);
        };
    }, [isOpen, close, uid]);

    // ── Display value ──
    const displayValue = parsed
        ? `${String(parsed.getDate()).padStart(2,'0')}-${String(parsed.getMonth()+1).padStart(2,'0')}-${parsed.getFullYear()}`
        : '';

    const selDay = parsed?.getDate(); const selMonth = parsed?.getMonth(); const selYear = parsed?.getFullYear();

    // ── Day handlers ──
    const handleDay = (day: number) => {
        onChange(`${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`);
        setIsOpen(false);
    };
    const prevMonth = () => viewMonth === 0 ? (setViewMonth(11), setViewYear(y => y-1)) : setViewMonth(m => m-1);
    const nextMonth = () => viewMonth === 11? (setViewMonth(0),  setViewYear(y => y+1)) : setViewMonth(m => m+1);

    // ── Shared style helpers ──
    const headerBtn = "w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-all duration-150";
    const divider   = { borderBottom: '1px solid rgba(255,255,255,0.07)' };
    const footDivider = { borderTop: '1px solid rgba(255,255,255,0.07)' };

    // ══════════════════════════════════════════════════════════════
    // ── VIEW: YEAR GRID ──────────────────────────────────────────
    // ══════════════════════════════════════════════════════════════
    const yearView = (
        <>
            {/* Header */}
            <div style={divider} className="flex items-center justify-between px-4 py-3">
                <button type="button" onClick={() => setYearPageStart(s => s - YEAR_PAGE_SIZE)} className={headerBtn} aria-label="Previous years">
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <span className="text-sm font-bold text-white font-manrope">
                    {yearPageStart} – {yearPageStart + YEAR_PAGE_SIZE - 1}
                </span>
                <button type="button" onClick={() => setYearPageStart(s => s + YEAR_PAGE_SIZE)} className={headerBtn} aria-label="Next years">
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
            </div>

            {/* 4×4 year grid */}
            <div className="grid grid-cols-4 gap-1.5 p-3">
                {Array.from({ length: YEAR_PAGE_SIZE }).map((_, i) => {
                    const yr = yearPageStart + i;
                    const isSelected = yr === selYear;
                    const isCurrent  = yr === today.getFullYear();
                    return (
                        <button key={yr} type="button"
                            onClick={() => { setViewYear(yr); setYearPageStart(Math.floor(yr/YEAR_PAGE_SIZE)*YEAR_PAGE_SIZE); setCalView('month'); }}
                            className={[
                                'h-9 rounded-lg text-sm font-semibold font-manrope transition-all duration-150',
                                isSelected  ? 'bg-[#2e77ff] text-white shadow-[0_0_0_3px_rgba(46,119,255,0.25)]'
                                : isCurrent ? 'border border-[rgba(46,119,255,0.50)] text-[#5b9aff] hover:bg-[rgba(46,119,255,0.12)]'
                                            : 'text-white/65 hover:bg-white/[0.09] hover:text-white',
                            ].join(' ')}>
                            {yr}
                        </button>
                    );
                })}
            </div>
        </>
    );

    // ══════════════════════════════════════════════════════════════
    // ── VIEW: MONTH GRID ─────────────────────────────────────────
    // ══════════════════════════════════════════════════════════════
    const monthView = (
        <>
            {/* Header */}
            <div style={divider} className="flex items-center justify-between px-4 py-3">
                <button type="button" onClick={() => setCalView('year')} className={headerBtn} aria-label="Back to year picker">
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button type="button" onClick={() => setCalView('year')}
                    className="text-sm font-bold text-white font-manrope hover:text-[#5b9aff] transition-colors duration-150">
                    {viewYear}
                </button>
                <div className="w-8" /> {/* spacer */}
            </div>

            {/* 3×4 month grid */}
            <div className="grid grid-cols-3 gap-1.5 p-3">
                {MONTH_NAMES.map((m, i) => {
                    const isSelected = i === selMonth && viewYear === selYear;
                    const isCurrent  = i === today.getMonth() && viewYear === today.getFullYear();
                    return (
                        <button key={m} type="button"
                            onClick={() => { setViewMonth(i); setCalView('day'); }}
                            className={[
                                'h-9 rounded-lg text-sm font-semibold font-manrope transition-all duration-150',
                                isSelected  ? 'bg-[#2e77ff] text-white shadow-[0_0_0_3px_rgba(46,119,255,0.25)]'
                                : isCurrent ? 'border border-[rgba(46,119,255,0.50)] text-[#5b9aff] hover:bg-[rgba(46,119,255,0.12)]'
                                            : 'text-white/65 hover:bg-white/[0.09] hover:text-white',
                            ].join(' ')}>
                            {m}
                        </button>
                    );
                })}
            </div>
        </>
    );

    // ══════════════════════════════════════════════════════════════
    // ── VIEW: DAY GRID ───────────────────────────────────────────
    // ══════════════════════════════════════════════════════════════
    const totalDays = daysInMonth(viewYear, viewMonth);
    const offset    = firstWeekday(viewYear, viewMonth);

    const dayView = (
        <>
            {/* Header */}
            <div style={divider} className="flex items-center justify-between px-4 py-3">
                <button type="button" onClick={prevMonth} className={headerBtn} aria-label="Previous month">
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>

                {/* Clickable month+year — opens year picker */}
                <button type="button" onClick={() => { setYearPageStart(Math.floor(viewYear/YEAR_PAGE_SIZE)*YEAR_PAGE_SIZE); setCalView('year'); }}
                    className="flex items-center gap-1.5 text-sm font-bold text-white font-manrope
                               hover:text-[#5b9aff] transition-colors duration-150 group"
                    aria-label="Pick year and month">
                    {MONTH_FULL[viewMonth]}&nbsp;{viewYear}
                    <span className="material-symbols-outlined text-sm text-white/30 group-hover:text-[#5b9aff] transition-colors">
                        expand_more
                    </span>
                </button>

                <button type="button" onClick={nextMonth} className={headerBtn} aria-label="Next month">
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
            </div>

            {/* Day grid */}
            <div className="p-3">
                <div className="grid grid-cols-7 mb-1">
                    {DAY_HEADERS.map(d => (
                        <div key={d} className="h-7 flex items-center justify-center text-[10px] font-bold text-white/25 uppercase tracking-widest font-manrope">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-y-0.5">
                    {Array.from({ length: offset }).map((_, i) => <div key={`off-${i}`} />)}
                    {Array.from({ length: totalDays }).map((_, i) => {
                        const day = i + 1;
                        const isSelected = day === selDay && viewMonth === selMonth && viewYear === selYear;
                        const isToday    = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                        return (
                            <button key={day} type="button" onClick={() => handleDay(day)}
                                aria-label={`${day} ${MONTH_FULL[viewMonth]} ${viewYear}`}
                                aria-pressed={isSelected}
                                className={[
                                    'h-8 w-full flex items-center justify-center rounded-lg font-manrope',
                                    'text-sm font-medium transition-all duration-150',
                                    isSelected  ? 'bg-[#2e77ff] text-white shadow-[0_0_0_3px_rgba(46,119,255,0.25)]'
                                    : isToday   ? 'border border-[rgba(46,119,255,0.55)] text-[#5b9aff] hover:bg-[rgba(46,119,255,0.12)]'
                                                : 'text-white/65 hover:bg-white/[0.08] hover:text-white',
                                ].join(' ')}>
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div style={footDivider} className="flex items-center justify-between px-4 py-2.5">
                <button type="button" onClick={() => { onChange(''); setIsOpen(false); }}
                    className="text-xs font-semibold text-white/35 hover:text-white/65 font-manrope transition-colors duration-150">
                    Clear
                </button>
                <button type="button" onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}
                    className="text-xs font-semibold text-[#2e77ff] hover:text-white font-manrope transition-colors duration-150">
                    Today
                </button>
            </div>
        </>
    );

    // ── Portal ────────────────────────────────────────────────────────────────────
    const calendar = isOpen ? createPortal(
        <div id={`dp-cal-${uid}`} role="dialog" aria-label="Choose a date"
            style={{
                position: 'fixed', top: calPos.top, left: calPos.left, width: calPos.width,
                zIndex: 99999,
                background: 'rgba(11,15,26,0.98)',
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '12px',
                boxShadow: '0 24px 64px rgba(0,0,0,0.70), 0 0 0 1px rgba(46,119,255,0.08)',
                overflow: 'hidden',
            }}
            className="animate-fade-slide-up">
            {calView === 'year'  && yearView}
            {calView === 'month' && monthView}
            {calView === 'day'   && dayView}
        </div>,
        document.body
    ) : null;

    // ── Render ────────────────────────────────────────────────────────────────────
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label htmlFor={`dp-btn-${uid}`}
                   className="text-label font-semibold text-white/65 uppercase tracking-widest">
                {label}
                {required && <span className="text-atlas-blue ml-0.5" aria-hidden="true">*</span>}
            </label>

            <button ref={triggerRef} type="button" id={`dp-btn-${uid}`}
                onClick={open} aria-haspopup="dialog" aria-expanded={isOpen}
                aria-describedby={error ? errorId : undefined}
                className={[
                    'w-full rounded-control px-4 py-3.5 text-left flex items-center justify-between',
                    'bg-white/[0.05] border transition-all duration-200 focus:outline-none',
                    error   ? 'border-status-error focus:[box-shadow:0_0_0_3px_rgba(239,68,68,0.20)]'
                    : isOpen? 'border-atlas-blue [box-shadow:0_0_0_3px_rgba(46,119,255,0.25)]'
                            : 'border-white/[0.12] hover:border-white/25',
                ].join(' ')}>
                <span className={displayValue ? 'text-white text-body-md font-medium' : 'text-white/30 text-body-md'}>
                    {displayValue || 'DD-MM-YYYY'}
                </span>
                <span className={`material-symbols-outlined text-lg transition-colors duration-200 ${isOpen ? 'text-atlas-blue' : 'text-white/35'}`}
                      aria-hidden="true">calendar_month</span>
            </button>

            {calendar}

            {error && (
                <p id={errorId} role="alert" className="flex items-center gap-1.5 text-label text-status-error">
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">error</span>
                    {error}
                </p>
            )}
        </div>
    );
};

export default DatePicker;
