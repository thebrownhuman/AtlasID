// src/hooks/useLoginForm.ts
// Encapsulates all login form state, validation, and submission logic.

import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface LoginFormState {
    readonly email: string;
    readonly password: string;
    readonly rememberMe: boolean;
}

export interface LoginFormErrors {
    readonly email?: string;
    readonly password?: string;
}

export interface UseLoginFormReturn {
    readonly formState: LoginFormState;
    readonly errors: LoginFormErrors;
    readonly isLoading: boolean;
    readonly serverError: string | null;
    readonly handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    readonly handleBlur: (e: ChangeEvent<HTMLInputElement>) => void;
    readonly handleSubmit: (e: FormEvent<HTMLFormElement>, onSuccess?: () => void) => void;
    readonly setFormState: React.Dispatch<React.SetStateAction<LoginFormState>>;
}

// ─── Validation helpers ────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(name: keyof LoginFormState, value: string): string | undefined {
    switch (name) {
        case 'email':
            if (!value) return 'Email address is required.';
            if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address.';
            return undefined;
        case 'password':
            if (!value) return 'Password is required.';
            if (value.length < 8) return 'Password must be at least 8 characters.';
            return undefined;
        default:
            return undefined;
    }
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useLoginForm(
    initialState: LoginFormState = { email: '', password: '', rememberMe: false }
): UseLoginFormReturn {

    const [formState, setFormState] = useState<LoginFormState>(initialState);
    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear field error on change
        if (name in errors) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
        setServerError(null);
    }, [errors]);

    const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const errorMsg = validateField(name as keyof LoginFormState, value);
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    }, []);

    const handleSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>, onSuccess?: () => void) => {
            e.preventDefault();
            setServerError(null);

            // Validate all fields
            const emailError = validateField('email', formState.email);
            const passwordError = validateField('password', formState.password);
            const newErrors: LoginFormErrors = {};
            if (emailError) newErrors.email = emailError;
            if (passwordError) newErrors.password = passwordError;

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            setIsLoading(true);
            try {
                // Simulate API call — replace with real auth endpoint
                await new Promise(resolve => setTimeout(resolve, 1500));
                // On success:
                onSuccess?.();
            } catch {
                setServerError('Something went wrong. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
        [formState]
    );

    return {
        formState,
        errors,
        isLoading,
        serverError,
        handleChange,
        handleBlur,
        handleSubmit,
        setFormState,
    };
}
