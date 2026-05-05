import React from 'react';
import Modal from './Modal';

type DeleteModalProps = {
    title: string;
    value?: string;
    message?: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteModal = ({ title, value , message, isOpen, onClose, onConfirm }: DeleteModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            ariaLabelledBy="delete-modal-title"
            maxWidthClassName='max-w-[450px]'
        >
            <div className="p-6 bg-surface">
                <h2 id="delete-modal-title" className="text-xl font-semibold mb-4">{title}</h2>
                {message && <p className="mb-6">{message}</p>}
                {value && (
                    <p className="mb-6">
                       Are you sure you want to delete <span className="font-semibold text-nowrap text-red-500">"{value}"</span> ? This action cannot be undone.
                    </p>
                )}
                <div className="flex gap-2 justify-end">
                    <button
                        className="rounded-md border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-text transition hover:bg-surface-muted"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="rounded-md border border-red-600 bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 cursor-pointer"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteModal;