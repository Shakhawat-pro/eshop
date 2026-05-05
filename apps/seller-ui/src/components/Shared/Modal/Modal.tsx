"use client";
import React, { useEffect } from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidthClassName?: string;
    contentClassName?: string;
    overlayClassName?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
};

const Modal = ({
    isOpen,
    onClose,
    children,
    maxWidthClassName = 'max-w-2xl',
    contentClassName = '',
    overlayClassName = '',
    ariaLabelledBy,
    ariaDescribedBy
}: ModalProps) => {

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    

    return (
        <div
            className={`fixed inset-0 z-50 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-200`}
            aria-hidden={!isOpen}
        >
            <div
                className={`absolute inset-0 bg-linear-to-br from-black/60 via-black/40 to-black/60 ${overlayClassName}`}
                onClick={onClose}
            />
            <div className={`relative mx-auto flex h-full w-full ${maxWidthClassName} items-center justify-center px-4 py-6`}>
                <div
                    className={`thin-scrollbar w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl transition-transform duration-200 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-2 scale-95'} ${contentClassName}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={ariaLabelledBy}
                    aria-describedby={ariaDescribedBy}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;