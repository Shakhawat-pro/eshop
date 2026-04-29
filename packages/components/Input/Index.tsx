import React from 'react';
import { forwardRef } from 'react';

interface BaseProps {
    label?: string;
    type?: 'text' | "number" | "password" | "email" | 'textarea';
    className?: string
}

type InputProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>;

type TextAreaProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;


type Props = InputProps | TextAreaProps;


const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
    ({ label, type = "text", className, ...props }, ref) => {
        return (
            <div className='w-full '>
                {label && <label className='block mb-1 text-sm font-semibold tracking-wide text-[var(--color-text)]'>{label}</label>}

                {type === 'textarea' ? (
                    <textarea
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        className={`w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] ${className}`}
                        {...(props as TextAreaProps)}
                    />
                ) : (
                    <input
                        ref={ref as React.Ref<HTMLInputElement>}
                        type={type}
                        className={`w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] ${className}`}
                        {...(props as InputProps)}
                    />
                )}

            </div>
        )
    }
)

Input.displayName = 'Input';

export default Input;