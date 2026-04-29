import { Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

const CustomProperties = ({ control, errors }: any) => {
    // Local state for properties; synced to react-hook-form via Controller.
    const [properties, setProperties] = useState<{ label: string; value: string[] }[]>([]);
    const [newLabel, setNewLabel] = useState('');
    const [newValues, setNewValues] = useState<Record<number, string>>({});

    console.log(newValues[1])

    return (
        <div className="">
            <div className="flex flex-col gap-6">
                <Controller
                    name={`customProperties`}
                    control={control}
                    rules={{ required: 'Property Name Is Required' }}
                    render={({ field }) => {
                        // Keep the form field value in sync with local state.
                        useEffect(() => {
                            field.onChange(properties);
                        }, [properties]);

                        // Add a new property group by label.
                        const addProperty = () => {
                            if (!newLabel.trim()) return;
                            setProperties([...properties, { label: newLabel.trim(), value: [] }]);
                            setNewLabel('');
                        };

                        // Add a value to a specific property.
                        const addValue = (index: number) => {
                            const nextValue = (newValues[index] || '').trim();
                            if (!nextValue) return;
                            // const updatedProperties = [...properties];
                            // updatedProperties[index].value.push(nextValue);
                            // setProperties(updatedProperties);
                            // setNewValues((prev) => ({ ...prev, [index]: '' }));
                            const updatedProperties = properties.map((prop, i) => {
                                if (i === index) {
                                    if (prop.value.includes(nextValue)) return prop;
                                    return { ...prop, value: [...prop.value, nextValue] };
                                } return prop;
                            });
                            setProperties(updatedProperties);
                            setNewValues((prev) => ({ ...prev, [index]: '' }));
                        };

                        // Remove a property group by index.
                        const removeProperty = (index: number) => {
                            setProperties(properties.filter((_, i) => i !== index));
                        };

                        // Remove a value from a specific property.
                        const removeValue = (propIndex: number, valIndex: number) => {
                            const updatedProperties = properties.map((prop, i) => {
                                if (i === propIndex) {
                                    return { ...prop, value: prop.value.filter((_, j) => j !== valIndex) };
                                } return prop;
                            });
                            setProperties(updatedProperties);
                        };

                        return (
                            <div className="mt-2">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <label className="block mb-1 text-sm font-semibold tracking-wide text-[var(--color-text)]">
                                            Custom Properties
                                        </label>
                                        <p className="text-xs text-[var(--color-text-muted)]">
                                            Add a property name, then add values for it.
                                        </p>
                                    </div>
                                    <span className="text-xs text-[var(--color-text-muted)]">
                                        {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-col gap-3">
                                    {/* Empty state when no properties exist. */}
                                    {properties.length === 0 && (
                                        <div className="rounded-md border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-muted)]">
                                            No custom properties yet. Add one below.
                                        </div>
                                    )}
                                    {/* Property groups. */}
                                    {properties.map((property, index) => (
                                        <div
                                            key={index}
                                            className="border border-[var(--color-border)] rounded-md p-3 bg-[var(--color-surface)]"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <span className="font-medium text-[var(--color-text)]">
                                                        {property.label}
                                                    </span>
                                                    <p className="text-xs text-[var(--color-text-muted)]">
                                                        {property.value.length} values
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeProperty(index)}
                                                    className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                                                    aria-label={`Remove ${property.label}`}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>

                                            {/* Value input and action for this property. */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <input
                                                    type="text"
                                                    value={newValues[index] || ''}
                                                    onChange={(e) =>
                                                        setNewValues((prev) => ({
                                                            ...prev,
                                                            [index]: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="e.g., 10 hours, 1.5 kg, Stainless Steel"
                                                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => addValue(index)}
                                                    className="flex items-center cursor-pointer gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
                                                    aria-label={`Add value to ${property.label}`}
                                                    disabled={!(newValues[index] || '').trim()}
                                                >
                                                    <Plus size={14} strokeWidth={3} />
                                                    <span>Value</span>
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {property.value.map((val, valIndex) => (
                                                    <div
                                                        onClick={() => removeValue(index, valIndex)}
                                                        key={valIndex}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm bg-[var(--color-surface-muted)] text-[var(--color-text)] cursor-pointer hover:bg-[var(--color-surface-strong)] transition-colors group relative`}
                                                    >
                                                        {val}
                                                        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded bg-[rgba(0,0,0,0.6)]'>
                                                            <X size={12} className="text-red-500" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add a new property group. */}
                                    <div className="rounded-md p-3 border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-muted)] to-[var(--color-surface-strong)]">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={newLabel}
                                                onChange={(e) => setNewLabel(e.target.value)}
                                                placeholder="Property Name (e.g., Duration, Weight, Material)"
                                                className="w-full rounded-md border border-[var(--color-border)] bg-surface-muted px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
                                            />
                                            <button
                                                type="button"
                                                onClick={addProperty}
                                                className="flex items-center cursor-pointer gap-2 whitespace-nowrap rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--color-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
                                                aria-label="Add property"
                                                disabled={!newLabel.trim()}
                                            >
                                                <Plus size={14} strokeWidth={3} />
                                                <span>Property</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {errors?.customProperties && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.customProperties.message ||
                                            'Please fix the errors in the properties.'}
                                    </p>
                                )}
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default CustomProperties;
