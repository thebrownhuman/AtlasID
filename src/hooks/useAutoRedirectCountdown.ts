// src/hooks/useAutoRedirectCountdown.ts
// Counts down from `seconds` to 0, then fires `onRedirect`. User can cancel.

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface UseAutoRedirectCountdownOptions {
    /** Seconds before auto-redirect (default: 5) */
    readonly seconds?: number;
    /** Fires when countdown reaches 0 (unless cancelled) */
    readonly onRedirect: () => void;
    /** Start paused — don't begin counting until `start()` is called */
    readonly startPaused?: boolean;
}

export interface UseAutoRedirectCountdownReturn {
    /** Seconds remaining */
    readonly secondsLeft: number;
    /** 0–1 progress fraction (1 = full time, 0 = done) */
    readonly progress: number;
    readonly isCancelled: boolean;
    /** Cancel and stop the countdown permanently */
    readonly cancel: () => void;
    /** Start after startPaused */
    readonly start: () => void;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAutoRedirectCountdown({
    seconds = 5,
    onRedirect,
    startPaused = false,
}: UseAutoRedirectCountdownOptions): UseAutoRedirectCountdownReturn {

    const [secondsLeft, setSecondsLeft] = useState(seconds);
    const [isCancelled, setIsCancelled] = useState(false);
    const [isRunning, setIsRunning] = useState(!startPaused);

    const onRedirectRef = useRef(onRedirect);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Keep callback ref fresh so we never capture a stale closure
    useEffect(() => { onRedirectRef.current = onRedirect; }, [onRedirect]);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Main countdown effect
    useEffect(() => {
        if (!isRunning || isCancelled) return;
        clearTimer();
        intervalRef.current = setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) {
                    clearTimer();
                    onRedirectRef.current();
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return clearTimer;
    }, [isRunning, isCancelled, clearTimer]);

    const cancel = useCallback(() => {
        clearTimer();
        setIsCancelled(true);
    }, [clearTimer]);

    const start = useCallback(() => {
        if (!isCancelled) setIsRunning(true);
    }, [isCancelled]);

    const progress = secondsLeft / seconds;

    return { secondsLeft, progress, isCancelled, cancel, start };
}
