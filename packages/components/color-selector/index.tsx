import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';

const defaultColors = [
    "#0b0b0b", // Near-black
    "#ffffff", // White
    "#e11d48", // Rose
    "#16a34a", // Green
    "#2563eb", // Blue
    "#f59e0b", // Amber
    "#a855f7", // Purple
    "#06b6d4", // Cyan
];

const ColorSelector = ({ control, errors }: any) => {
    const [customColors, setCustomColors] = useState<string[]>([]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [newColor, setNewColor] = useState("#ffffff");

    return (
        <div className="mt-3 rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-muted)] to-[var(--color-surface-strong)] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <label className="block text-sm font-semibold tracking-wide text-[var(--color-text)]">Available Colors</label>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">Select multiple tones or add a custom swatch.</p>
                </div>
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text)]">
                    palette
                </span>
            </div>
            <Controller
                name="color"
                control={control}
                render={({ field }) => (
                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                        {[...defaultColors, ...customColors].map((color, index) => {
                            const isSelected = (field.value || []).includes(color);
                            const isLightColor = ["#ffffff", "#f59e0b"].includes(color);
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() =>
                                        field.onChange(
                                            isSelected
                                                ? field.value.filter((c: string) => c !== color)
                                                : [...(field.value || []), color]
                                        )
                                    }
                                    aria-pressed={isSelected}
                                    className={`group relative grid h-9 w-9 place-items-center rounded-full border transition-all duration-200
                                        ${isSelected ? "border-[var(--color-text)] shadow-[0_0_0_3px_rgba(255,255,255,0.14)]" : "border-[var(--color-border)]"}
                                        ${isLightColor ? "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]" : ""}
                                        hover:scale-105 hover:shadow-[0_6px_16px_rgba(0,0,0,0.45)]`}
                                    style={{ backgroundColor: color }}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full bg-white transition-opacity
                                            ${isSelected ? "opacity-95" : "opacity-0 group-hover:opacity-70"}`}
                                    />
                                </button>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="grid h-9 w-9 place-items-center rounded-full border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-text)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.45)]"
                            aria-label="Add custom color"
                        >
                            <Plus size={16} className="text-[var(--color-text)]" />
                        </button>
                        {showColorPicker && (
                            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-2 shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
                                <input
                                    type="color"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    className="h-9 w-10 cursor-pointer rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-0"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!customColors.includes(newColor) && !defaultColors.includes(newColor)) {
                                            setCustomColors([...customColors, newColor]);
                                            setShowColorPicker(false);
                                        }
                                    }}
                                    className="rounded-md bg-[var(--color-text)] px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-surface)] shadow-sm transition hover:bg-white"
                                >
                                    add
                                </button>
                            </div>
                        )}
                    </div>
                )}
            />
        </div>
    );
};

export default ColorSelector;