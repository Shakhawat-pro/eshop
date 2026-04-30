import { Controller } from 'react-hook-form';

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

const SizeSelector = ({ control, error }: any) => {
    return (
        <div className="mt-3 rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-muted)] to-[var(--color-surface-strong)] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <label className="block text-sm font-semibold tracking-wide text-[var(--color-text)]">Sizes</label>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">Select all available sizes for this product.</p>
                </div>
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text)]">
                    size set
                </span>
            </div>
            <Controller
                name="size"
                control={control}
                render={({ field }) => (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            const isSelected = (field.value || []).includes(size);
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => {
                                        if (isSelected) {
                                            field.onChange((field.value || []).filter((v: string) => v !== size));
                                        } else {
                                            field.onChange([...(field.value || []), size]);
                                        }
                                    }}
                                    className={`min-w-[52px] rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition
                                        ${isSelected
                                            ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-[0_2px_20px_rgba(59,130,246,0.35)]'
                                            : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
                                        }`}
                                    aria-pressed={isSelected}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                )}
            />
            {error && <p className="mt-2 text-sm text-red-500">{error.message}</p>}
        </div>
    );
};

export default SizeSelector;