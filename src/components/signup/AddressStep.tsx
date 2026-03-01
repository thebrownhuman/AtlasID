// src/components/signup/AddressStep.tsx
// Step 2 — country, street address, city, state, postal code.

import React from 'react';
import { FormField } from '../FormField';
import { SelectField } from '../SelectField';
import type { AddressData, FieldErrors } from '../../hooks/useSignupForm';
import { COUNTRY_OPTIONS } from '../../data/mockData';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AddressStepProps {
    readonly data: AddressData;
    readonly errors: FieldErrors;
    readonly onChange: (patch: Partial<AddressData>) => void;
    readonly className?: string;
}

// ─── AddressStep ───────────────────────────────────────────────────────────────

export const AddressStep: React.FC<AddressStepProps> = ({
    data, errors, onChange, className = '',
}) => (
    <section className={`flex flex-col gap-5 ${className}`} aria-label="Address information">
        <header className="flex flex-col gap-1">
            <h3 className="text-display-3 font-bold text-white">Your Address</h3>
            <p className="text-body-sm text-white/55 leading-relaxed">
                We use your address to comply with local identity regulations.
                All data is encrypted in transit and at rest.
            </p>
        </header>

        {/* Country */}
        <SelectField
            label="Country / Region"
            name="country"
            value={data.country}
            options={COUNTRY_OPTIONS}
            placeholder="Select country…"
            required
            error={errors.country}
            onChange={v => onChange({ country: v })}
        />

        {/* Street line 1 */}
        <FormField
            label="Street address"
            name="streetLine1"
            value={data.streetLine1}
            placeholder="123 Main Street"
            autoComplete="address-line1"
            required
            error={errors.streetLine1}
            onChange={v => onChange({ streetLine1: v })}
        />

        {/* Street line 2 */}
        <FormField
            label="Apt / Suite / Floor"
            name="streetLine2"
            value={data.streetLine2}
            placeholder="Apt 4B (optional)"
            autoComplete="address-line2"
            onChange={v => onChange({ streetLine2: v })}
        />

        {/* City + State row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
                label="City"
                name="city"
                value={data.city}
                placeholder="San Francisco"
                autoComplete="address-level2"
                required
                error={errors.city}
                onChange={v => onChange({ city: v })}
            />
            <FormField
                label="State / Province"
                name="state"
                value={data.state}
                placeholder="CA"
                autoComplete="address-level1"
                error={errors.state}
                onChange={v => onChange({ state: v })}
            />
        </div>

        {/* Postal code */}
        <FormField
            label="Postal / ZIP code"
            name="postalCode"
            value={data.postalCode}
            placeholder="94105"
            autoComplete="postal-code"
            required
            error={errors.postalCode}
            onChange={v => onChange({ postalCode: v })}
        />
    </section>
);

export default AddressStep;
