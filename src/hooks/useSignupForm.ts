// src/hooks/useSignupForm.ts
// Shared state, per-step validation, and navigation for the 5-step sign-up flow.
// Steps: 0=Personal, 1=Address, 2=Security, 3=Google Auth Setup, 4=Review

import { useState, useCallback } from 'react';

// ─── Step definition ───────────────────────────────────────────────────────────

export const SIGNUP_STEPS = ['Personal Info', 'Address', 'Security', '2FA Setup', 'Review'] as const;
export type SignupStep = 0 | 1 | 2 | 3 | 4;

// ─── Form shape ────────────────────────────────────────────────────────────────

export interface PersonalInfoData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
}

export interface AddressData {
    country: string;
    streetLine1: string;
    streetLine2: string;
    city: string;
    state: string;
    postalCode: string;
}

export interface SecurityData {
    password: string;
    confirmPassword: string;
    question1: string;
    answer1: string;
    question2: string;
    answer2: string;
}

export interface SignupFormData {
    personal: PersonalInfoData;
    address: AddressData;
    security: SecurityData;
    google2faVerified: boolean;
}

export type FieldErrors = Partial<Record<string, string>>;
export type StepErrors = [FieldErrors, FieldErrors, FieldErrors, FieldErrors, FieldErrors];

// ─── Initial state ─────────────────────────────────────────────────────────────

const INITIAL_DATA: SignupFormData = {
    personal: { firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '' },
    address: { country: '', streetLine1: '', streetLine2: '', city: '', state: '', postalCode: '' },
    security: { password: '', confirmPassword: '', question1: '', answer1: '', question2: '', answer2: '' },
    google2faVerified: false,
};

// ─── Validators ────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validatePersonal(d: PersonalInfoData): FieldErrors {
    const e: FieldErrors = {};
    if (!d.firstName.trim()) e.firstName = 'First name is required.';
    if (!d.lastName.trim()) e.lastName = 'Last name is required.';
    if (!d.email.trim()) e.email = 'Email is required.';
    else if (!EMAIL_RE.test(d.email)) e.email = 'Enter a valid email address.';
    if (d.phone && !PHONE_RE.test(d.phone)) e.phone = 'Enter a valid phone number.';
    if (!d.dateOfBirth) e.dateOfBirth = 'Date of birth is required.';
    else if (!DATE_RE.test(d.dateOfBirth)) e.dateOfBirth = 'Use YYYY-MM-DD format.';
    return e;
}

function validateAddress(d: AddressData): FieldErrors {
    const e: FieldErrors = {};
    if (!d.country.trim()) e.country = 'Country is required.';
    if (!d.streetLine1.trim()) e.streetLine1 = 'Street address is required.';
    if (!d.city.trim()) e.city = 'City is required.';
    if (!d.postalCode.trim()) e.postalCode = 'Postal / ZIP code is required.';
    return e;
}

// At least 8 chars, one uppercase, one digit
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function validateSecurity(d: SecurityData): FieldErrors {
    const e: FieldErrors = {};
    if (!d.password) e.password = 'Password is required.';
    else if (!PASSWORD_RE.test(d.password))
        e.password = 'Min 8 characters, 1 uppercase letter, 1 number.';
    if (!d.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (d.password && d.confirmPassword !== d.password)
        e.confirmPassword = 'Passwords do not match.';
    if (!d.question1) e.question1 = 'Select a security question.';
    if (!d.answer1.trim()) e.answer1 = 'Answer is required.';
    if (!d.question2) e.question2 = 'Select a second security question.';
    if (d.question2 && d.question1 && d.question2 === d.question1)
        e.question2 = 'Choose a different question.';
    if (!d.answer2.trim()) e.answer2 = 'Answer is required.';
    return e;
}

// Step 3 (Google Auth) — validation handled inline in GoogleAuthSetupStep via onVerified callback
// Step 4 (Review) — no new fields

const STEP_VALIDATORS = [
    (d: SignupFormData) => validatePersonal(d.personal),
    (d: SignupFormData) => validateAddress(d.address),
    (d: SignupFormData) => validateSecurity(d.security),
    () => ({} as FieldErrors),   // 2FA step — validated by the step component
    () => ({} as FieldErrors),   // Review step — no new fields
] as const;

// ─── Hook ──────────────────────────────────────────────────────────────────────

export interface UseSignupFormReturn {
    readonly formData: SignupFormData;
    readonly currentStep: SignupStep;
    readonly errors: FieldErrors;
    readonly allStepErrors: StepErrors;
    readonly isSubmitting: boolean;
    readonly isComplete: boolean;
    readonly updatePersonal: (patch: Partial<PersonalInfoData>) => void;
    readonly updateAddress: (patch: Partial<AddressData>) => void;
    readonly updateSecurity: (patch: Partial<SecurityData>) => void;
    readonly set2faVerified: () => void;
    readonly validateStep: (step?: SignupStep) => boolean;
    readonly goNext: () => void;
    readonly goBack: () => void;
    readonly goToStep: (s: SignupStep) => void;
    readonly handleSubmit: () => Promise<void>;
}

export function useSignupForm(): UseSignupFormReturn {
    const [formData, setFormData] = useState<SignupFormData>(INITIAL_DATA);
    const [currentStep, setCurrentStep] = useState<SignupStep>(0);
    const [allStepErrors, setAllStepErrors] = useState<StepErrors>([{}, {}, {}, {}, {}]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const errors = allStepErrors[currentStep];

    // ── Field updaters ──────────────────────────────────────────────────────
    const updatePersonal = useCallback((patch: Partial<PersonalInfoData>) => {
        setFormData(prev => ({ ...prev, personal: { ...prev.personal, ...patch } }));
        setAllStepErrors(prev => {
            const next = [...prev] as StepErrors;
            next[0] = Object.fromEntries(Object.entries(next[0]).filter(([k]) => !Object.keys(patch).includes(k)));
            return next;
        });
    }, []);

    const updateAddress = useCallback((patch: Partial<AddressData>) => {
        setFormData(prev => ({ ...prev, address: { ...prev.address, ...patch } }));
        setAllStepErrors(prev => {
            const next = [...prev] as StepErrors;
            next[1] = Object.fromEntries(Object.entries(next[1]).filter(([k]) => !Object.keys(patch).includes(k)));
            return next;
        });
    }, []);

    const updateSecurity = useCallback((patch: Partial<SecurityData>) => {
        setFormData(prev => ({ ...prev, security: { ...prev.security, ...patch } }));
        setAllStepErrors(prev => {
            const next = [...prev] as StepErrors;
            next[2] = Object.fromEntries(Object.entries(next[2]).filter(([k]) => !Object.keys(patch).includes(k)));
            return next;
        });
    }, []);

    const set2faVerified = useCallback(() => {
        setFormData(prev => ({ ...prev, google2faVerified: true }));
    }, []);

    // ── Validation ──────────────────────────────────────────────────────────
    const validateStep = useCallback((step: SignupStep = currentStep): boolean => {
        const errs = STEP_VALIDATORS[step](formData);
        setAllStepErrors(prev => {
            const next = [...prev] as StepErrors;
            next[step] = errs;
            return next;
        });
        return Object.keys(errs).length === 0;
    }, [currentStep, formData]);

    // ── Navigation ──────────────────────────────────────────────────────────
    const goNext = useCallback(() => {
        if (!validateStep()) return;
        setCurrentStep(s => Math.min(s + 1, 4) as SignupStep);
    }, [validateStep]);

    const goBack = useCallback(() => {
        setCurrentStep(s => Math.max(s - 1, 0) as SignupStep);
    }, []);

    const goToStep = useCallback((s: SignupStep) => {
        if (s <= currentStep) setCurrentStep(s);
    }, [currentStep]);

    // ── Submit ──────────────────────────────────────────────────────────────
    const handleSubmit = useCallback(async () => {
        if (!validateStep(4)) return;
        setIsSubmitting(true);
        try {
            await new Promise(res => setTimeout(res, 2000));
            setIsComplete(true);
        } finally {
            setIsSubmitting(false);
        }
    }, [validateStep]);

    return {
        formData, currentStep, errors, allStepErrors,
        isSubmitting, isComplete,
        updatePersonal, updateAddress, updateSecurity, set2faVerified,
        validateStep, goNext, goBack, goToStep, handleSubmit,
    };
}
