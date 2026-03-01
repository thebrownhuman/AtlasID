// src/hooks/useOtpInput.ts
// Manages the 6-digit OTP input array, auto-advance, backspace, and paste handling.

import { useState, useCallback, useRef } from 'react';
import type { KeyboardEvent, ChangeEvent, ClipboardEvent } from 'react';


// ─── Types ─────────────────────────────────────────────────────────────────────

export interface UseOtpInputOptions {
    /** Number of OTP digits (default: 6) */
    readonly length?: number;
    /** Called when all digits are filled */
    readonly onComplete?: (otp: string) => void;
}

export interface UseOtpInputReturn {
    readonly digits: readonly string[];
    readonly inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
    readonly otp: string;
    readonly isComplete: boolean;
    readonly handleChange: (index: number) => (e: ChangeEvent<HTMLInputElement>) => void;
    readonly handleKeyDown: (index: number) => (e: KeyboardEvent<HTMLInputElement>) => void;
    readonly handlePaste: (e: ClipboardEvent<HTMLInputElement>) => void;
    readonly handleFocus: (index: number) => () => void;
    readonly reset: () => void;
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useOtpInput(options: UseOtpInputOptions = {}): UseOtpInputReturn {
    const { length = 6, onComplete } = options;

    const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null));

    const focusAt = useCallback((index: number) => {
        inputRefs.current[Math.max(0, Math.min(index, length - 1))]?.focus();
    }, [length]);

    const updateDigits = useCallback((next: string[]) => {
        setDigits(next);
        const joined = next.join('');
        if (joined.length === length && next.every(d => d !== '')) {
            onComplete?.(joined);
        }
    }, [length, onComplete]);

    const handleChange = useCallback(
        (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value.replace(/\D/g, ''); // digits only
            if (!raw) return;

            // If user somehow types more than one character (mobile IME)
            const char = raw[raw.length - 1];
            const next = [...digits];
            next[index] = char;
            updateDigits(next);

            // Advance focus
            if (index < length - 1) focusAt(index + 1);
        },
        [digits, focusAt, length, updateDigits]
    );

    const handleKeyDown = useCallback(
        (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Backspace') {
                e.preventDefault();
                const next = [...digits];
                if (next[index]) {
                    // Clear current cell
                    next[index] = '';
                    updateDigits(next);
                } else if (index > 0) {
                    // Move back and clear previous
                    next[index - 1] = '';
                    updateDigits(next);
                    focusAt(index - 1);
                }
            } else if (e.key === 'ArrowLeft' && index > 0) {
                focusAt(index - 1);
            } else if (e.key === 'ArrowRight' && index < length - 1) {
                focusAt(index + 1);
            }
        },
        [digits, focusAt, length, updateDigits]
    );

    const handlePaste = useCallback(
        (e: ClipboardEvent<HTMLInputElement>) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
            if (!pasted) return;
            const next = Array(length).fill('');
            pasted.split('').forEach((char, i) => { next[i] = char; });
            updateDigits(next);
            // Focus the cell after last pasted digit
            focusAt(Math.min(pasted.length, length - 1));
        },
        [focusAt, length, updateDigits]
    );

    const handleFocus = useCallback(
        (index: number) => () => {
            // Select text on focus for easy replacement
            inputRefs.current[index]?.select();
        },
        []
    );

    const reset = useCallback(() => {
        setDigits(Array(length).fill(''));
        focusAt(0);
    }, [focusAt, length]);

    const otp = digits.join('');
    const isComplete = otp.length === length && digits.every(d => d !== '');

    return {
        digits,
        inputRefs,
        otp,
        isComplete,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleFocus,
        reset,
    };
}
