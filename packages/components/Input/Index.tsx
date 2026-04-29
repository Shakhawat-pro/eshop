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
                {label && <label className='block mb-1 font-medium text-gray-300'>{label}</label>}

                {type === 'textarea' ? (
                    <textarea
                        ref={ref as React.Ref<HTMLTextAreaElement>}
                        className={`w-full px-3 py-2 text-white border border-slate-600 rounded-md focus:outline-none ${className}`}
                        {...(props as TextAreaProps)}
                    />
                ) : (
                    <input
                        ref={ref as React.Ref<HTMLInputElement>}
                        type={type}
                        className={`w-full px-3 py-2 text-white border border-slate-600 text rounded-md focus:outline-none  ${className}`}
                        {...(props as InputProps)}
                    />
                )}

            </div>
        )
    }
)

Input.displayName = 'Input';

export default Input;