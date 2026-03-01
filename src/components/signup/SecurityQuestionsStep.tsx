// src/components/signup/SecurityQuestionsStep.tsx
// Step 3 — password creation + two independent security question / answer pairs.

import React, { useState } from 'react';
import { FormField } from '../FormField';
import { SelectField } from '../SelectField';
import type { SecurityData, FieldErrors } from '../../hooks/useSignupForm';
import { SECURITY_QUESTIONS } from '../../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SecurityQuestionsStepProps {
    readonly data: SecurityData;
    readonly errors: FieldErrors;
    readonly onChange: (patch: Partial<SecurityData>) => void;
    readonly className?: string;
}

// ─── Password strength ─────────────────────────────────────────────────────────

function getStrength(pw: string): 0 | 1 | 2 | 3 {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score as 0 | 1 | 2 | 3;
}

const STRENGTH_LABEL: Record<0 | 1 | 2 | 3, string> = {
    0: '', 1: 'Weak', 2: 'Fair', 3: 'Strong',
};
const STRENGTH_COLOR: Record<0 | 1 | 2 | 3, string> = {
    0: 'bg-white/10',
    1: 'bg-status-error',
    2: 'bg-status-warning',
    3: 'bg-status-success',
};

const StrengthMeter: React.FC<{ password: string }> = ({ password }) => {
    const level = getStrength(password);
    if (!password) return null;
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex gap-1.5">
                {([1, 2, 3] as const).map(i => (
                    <div
                        key={i}
                        className={`flex-1 h-1 rounded-pill transition-all duration-300 ${i <= level ? STRENGTH_COLOR[level] : 'bg-white/10'
                            }`}
                    />
                ))}
            </div>
            <p className={`text-label font-medium ${level === 1 ? 'text-status-error'
                    : level === 2 ? 'text-status-warning'
                        : level === 3 ? 'text-status-success'
                            : 'text-white/40'
                }`}>
                {STRENGTH_LABEL[level]}
            </p>
        </div>
    );
};

// ─── SecurityQuestionsStep ─────────────────────────────────────────────────────

export const SecurityQuestionsStep: React.FC<SecurityQuestionsStepProps> = ({
    data, errors, onChange, className = '',
}) => {
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Filter out already-selected question in the paired slot
    const forQ1 = SECURITY_QUESTIONS.filter(q => q.value !== data.question2);
    const forQ2 = SECURITY_QUESTIONS.filter(q => q.value !== data.question1);

    return (
        <section className={`flex flex-col gap-6 ${className}`} aria-label="Security step">
            {/* ── Password fields ────────────────────────────────────────────── */}
            <fieldset className="flex flex-col gap-4 border-none p-0 m-0">
                <legend className="text-label font-semibold text-white/50 uppercase tracking-widest mb-1">
                    Create a password
                </legend>

                {/* Password */}
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <FormField
                            label="Password"
                            name="password"
                            type={showPw ? 'text' : 'password'}
                            value={data.password}
                            placeholder="Min. 8 chars, 1 uppercase, 1 number"
                            autoComplete="new-password"
                            required
                            error={errors.password}
                            onChange={v => onChange({ password: v })}
                            inputClassName="pr-11"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPw(p => !p)}
                            className="absolute right-3 top-[2.35rem] text-white/45 hover:text-white
                         transition-colors duration-150"
                            aria-label={showPw ? 'Hide password' : 'Show password'}
                        >
                            <span className="material-symbols-outlined text-xl" aria-hidden="true">
                                {showPw ? 'visibility_off' : 'visibility'}
                            </span>
                        </button>
                    </div>
                    <StrengthMeter password={data.password} />
                </div>

                {/* Confirm password */}
                <div className="relative">
                    <FormField
                        label="Confirm password"
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        value={data.confirmPassword}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        required
                        error={errors.confirmPassword}
                        onChange={v => onChange({ confirmPassword: v })}
                        inputClassName="pr-11"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(p => !p)}
                        className="absolute right-3 top-[2.35rem] text-white/45 hover:text-white
                       transition-colors duration-150"
                        aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    >
                        <span className="material-symbols-outlined text-xl" aria-hidden="true">
                            {showConfirm ? 'visibility_off' : 'visibility'}
                        </span>
                    </button>
                </div>
            </fieldset>

            {/* Security notice badge */}
            <div
                className="flex items-start gap-3 px-4 py-3 rounded-control glass-1"
                role="note"
            >
                <span className="material-symbols-outlined text-atlas-blue mt-0.5 flex-shrink-0" aria-hidden="true">
                    shield
                </span>
                <p className="text-body-sm text-white/65 leading-relaxed">
                    Your password and answers are hashed and never stored in plain text.
                    AES-256 encryption applies to all security data.
                </p>
            </div>

            <hr className="border-white/[0.08]" />

            {/* ── Security question 1 ────────────────────────────────────────── */}
            <fieldset className="flex flex-col gap-4 border-none p-0 m-0">
                <legend className="text-label font-semibold text-white/50 uppercase tracking-widest mb-1">
                    Security question 1
                </legend>
                <SelectField
                    label="Question"
                    name="question1"
                    value={data.question1}
                    options={forQ1}
                    placeholder="Choose a question…"
                    required
                    error={errors.question1}
                    onChange={v => onChange({ question1: v })}
                />
                <FormField
                    label="Your answer"
                    name="answer1"
                    value={data.answer1}
                    placeholder="Type your answer…"
                    required
                    hint="Case-insensitive. Avoid obvious answers."
                    error={errors.answer1}
                    onChange={v => onChange({ answer1: v })}
                />
            </fieldset>

            <hr className="border-white/[0.08]" />

            {/* ── Security question 2 ────────────────────────────────────────── */}
            <fieldset className="flex flex-col gap-4 border-none p-0 m-0">
                <legend className="text-label font-semibold text-white/50 uppercase tracking-widest mb-1">
                    Security question 2
                </legend>
                <SelectField
                    label="Question"
                    name="question2"
                    value={data.question2}
                    options={forQ2}
                    placeholder="Choose a different question…"
                    required
                    error={errors.question2}
                    onChange={v => onChange({ question2: v })}
                />
                <FormField
                    label="Your answer"
                    name="answer2"
                    value={data.answer2}
                    placeholder="Type your answer…"
                    required
                    hint="Must differ from question 1."
                    error={errors.answer2}
                    onChange={v => onChange({ answer2: v })}
                />
            </fieldset>
        </section>
    );
};

export default SecurityQuestionsStep;
