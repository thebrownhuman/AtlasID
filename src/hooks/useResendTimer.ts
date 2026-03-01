// src/hooks/useResendTimer.ts
// Countdown timer for OTP resend. Resets on demand and tracks resend attempt count.

import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface UseResendTimerOptions {
    /** Initial cooldown in seconds (default: 30) */
    readonly initialSeconds?: number;
    /** Max number of resend attempts allowed (default: 3) */
    readonly maxAttempts?: number;
}

export interface UseResendTimerReturn {
    readonly secondsLeft: number;
    readonly canResend: boolean;
    readonly attemptsMade: number;
    readonly maxAttempts: number;
    readonly isExhausted: boolean;
    readonly handleResend: () => Promise<void>;
    readonly isResending: boolean;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useResendTimer(
    onResend: () => Promise<void>,
    options: UseResendTimerOptions = {}
): UseResendTimerReturn {
    const { initialSeconds = 30, maxAttempts = 3 } = options;

    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const [attemptsMade, setAttemptsMade] = useState(0);
    const [isResending, setIsResending] = useState(false);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Start countdown
    const startTimer = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setSecondsLeft(initialSeconds);
        intervalRef.current = setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) {
                    clearInterval(intervalRef.current!);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
    }, [initialSeconds]);

    // Start on mount
    useEffect(() => {
        startTimer();
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [startTimer]);

    const canResend = secondsLeft === 0 && attemptsMade < maxAttempts;
    const isExhausted = attemptsMade >= maxAttempts;

    const handleResend = useCallback(async () => {
        if (!canResend || isResending) return;
        setIsResending(true);
        try {
            await onResend();
            setAttemptsMade(n => n + 1);
            startTimer();
        } finally {
            setIsResending(false);
        }
    }, [canResend, isResending, onResend, startTimer]);

    return {
        secondsLeft,
        canResend,
        attemptsMade,
        maxAttempts,
        isExhausted,
        handleResend,
        isResending,
    };
}
