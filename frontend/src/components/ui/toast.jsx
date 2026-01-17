import { useState, createContext, useContext, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ title, description, type = 'default', duration = 3000 }) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, title, description, type, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} onDismiss={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const toastVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const Toast = ({ id, title, description, type, duration, onDismiss }) => {
    useState(() => {
        if (duration > 0) {
            const timer = setTimeout(onDismiss, duration);
            return () => clearTimeout(timer);
        }
    });

    const icons = {
        default: <Info className="h-5 w-5 text-primary" />,
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    };

    const bgColors = {
        default: "bg-background border-border",
        success: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900",
        error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900",
        warning: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900",
    };

    return (
        <motion.div
            layout
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
                "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-6 pr-8 shadow-lg transition-all",
                bgColors[type] || bgColors.default
            )}
        >
            <div className="flex gap-3">
                {icons[type]}
                <div className="grid gap-1">
                    {title && <h3 className="text-sm font-semibold">{title}</h3>}
                    {description && <p className="text-sm opacity-90">{description}</p>}
                </div>
            </div>
            <button
                onClick={onDismiss}
                className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
};
