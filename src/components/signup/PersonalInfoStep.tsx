// src/components/signup/PersonalInfoStep.tsx
// Step 1 — legal name, email, phone, date of birth.

import React from 'react';
import { FormField } from '../FormField';
import { DatePicker } from '../DatePicker';
import type { PersonalInfoData, FieldErrors } from '../../hooks/useSignupForm';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PersonalInfoStepProps {
    readonly data: PersonalInfoData;
    readonly errors: FieldErrors;
    readonly onChange: (patch: Partial<PersonalInfoData>) => void;
    readonly className?: string;
}

// ─── PersonalInfoStep ──────────────────────────────────────────────────────────

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
    data, errors, onChange, className = '',
}) => (
    <section className={`flex flex-col gap-3 ${className}`} aria-label="Personal information">
        <header className="flex flex-col gap-1">
            <h3 className="text-display-3 font-bold text-white">Personal Details</h3>
            <p className="text-body-sm text-white/55 leading-relaxed">
                Please provide your legal name and contact information for verification purposes.
            </p>
        </header>

        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
                label="First name"
                name="firstName"
                value={data.firstName}
                placeholder="Jane"
                autoComplete="given-name"
                required
                error={errors.firstName}
                onChange={v => onChange({ firstName: v })}
            />
            <FormField
                label="Last name"
                name="lastName"
                value={data.lastName}
                placeholder="Smith"
                autoComplete="family-name"
                required
                error={errors.lastName}
                onChange={v => onChange({ lastName: v })}
            />
        </div>

        {/* Email */}
        <FormField
            label="Email address"
            name="email"
            type="email"
            value={data.email}
            placeholder="jane@example.com"
            autoComplete="email"
            required
            error={errors.email}
            onChange={v => onChange({ email: v })}
        />

        {/* Phone */}
        <FormField
            label="Phone number"
            name="phone"
            type="tel"
            value={data.phone}
            placeholder="+1 555 000 0000"
            autoComplete="tel"
            hint="Optional — used for account recovery."
            error={errors.phone}
            onChange={v => onChange({ phone: v })}
        />

        {/* Date of birth */}
        <DatePicker
            label="Date of birth"
            name="dateOfBirth"
            value={data.dateOfBirth}
            required
            error={errors.dateOfBirth}
            onChange={v => onChange({ dateOfBirth: v })}
        />
    </section>
);

export default PersonalInfoStep;
