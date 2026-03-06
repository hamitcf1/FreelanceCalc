import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastProps {
    toasts: ToastMessage[];
    removeToast: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 max-w-sm w-full">
            {toasts.map((toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        error: <XCircle className="w-5 h-5 text-rose-500" />,
        info: <Info className="w-5 h-5 text-indigo-500" />
    };

    const bgStyles = {
        success: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/20',
        error: 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/20',
        info: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500/20'
    };

    return (
        <div className={`glass w-full p-4 rounded-2xl border flex items-center gap-4 shadow-xl animate-in slide-in-from-right-full duration-500 ${bgStyles[toast.type]}`}>
            <div className="flex-shrink-0">
                {icons[toast.type]}
            </div>
            <p className="flex-1 text-sm font-bold text-gray-700 dark:text-gray-200">
                {toast.message}
            </p>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
