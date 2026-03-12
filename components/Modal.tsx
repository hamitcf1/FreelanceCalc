import React, { useEffect } from 'react';
import { X, AlertCircle, HelpCircle } from 'lucide-react';
import Button from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onConfirm?: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'info' | 'danger' | 'question';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    onConfirm,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    type = 'info'
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const icons = {
        info: <AlertCircle className="w-10 h-10 text-indigo-500" />,
        danger: <AlertCircle className="w-10 h-10 text-rose-500" />,
        question: <HelpCircle className="w-10 h-10 text-amber-500" />
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative glass bg-white/80 dark:bg-gray-900/80 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-300 border-white/20">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 p-4 bg-gray-100/50 dark:bg-gray-800/50 rounded-3xl">
                        {icons[type]}
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-10">
                        {message}
                    </p>

                    <div className="flex w-full gap-4">
                        <Button
                            variant="secondary"
                            className="flex-1"
                            onClick={onClose}
                        >
                            {cancelLabel}
                        </Button>
                        {onConfirm && (
                            <Button
                                variant={type === 'danger' ? 'danger' : 'primary'}
                                className="flex-1 shadow-xl"
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                {confirmLabel}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
