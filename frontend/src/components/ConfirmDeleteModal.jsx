import { useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const ANIMATION_DURATION_MS = 200;

const getFocusableElements = (container) => {
    if (!container) return [];

    return Array.from(
        container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
    ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
};

const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete message?',
    message = 'Are you sure you want to delete this message?',
    description = 'This action cannot be undone.',
    isDeleting = false
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(isOpen);
    const backdropRef = useRef(null);
    const dialogRef = useRef(null);
    const focusTimeoutRef = useRef(null);
    const previousActiveElementRef = useRef(null);
    const onCloseRef = useRef(onClose);
    const isDeletingRef = useRef(isDeleting);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        isDeletingRef.current = isDeleting;
    }, [isDeleting]);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const animationFrame = requestAnimationFrame(() => setIsVisible(true));
            return () => cancelAnimationFrame(animationFrame);
        }

        setIsVisible(false);
        const hideTimeout = setTimeout(() => setShouldRender(false), ANIMATION_DURATION_MS);
        return () => clearTimeout(hideTimeout);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        previousActiveElementRef.current = document.activeElement;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        focusTimeoutRef.current = setTimeout(() => {
            const focusable = getFocusableElements(dialogRef.current);
            if (focusable.length > 0) {
                focusable[0].focus();
            } else {
                dialogRef.current?.focus();
            }
        }, 0);

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                if (!isDeletingRef.current) onCloseRef.current?.();
                return;
            }

            if (event.key !== 'Tab') return;

            const focusable = getFocusableElements(dialogRef.current);
            if (focusable.length === 0) {
                event.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;

            if (dialogRef.current && !dialogRef.current.contains(active)) {
                event.preventDefault();
                if (event.shiftKey) {
                    last.focus();
                } else {
                    first.focus();
                }
                return;
            }

            if (event.shiftKey && active === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && active === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            clearTimeout(focusTimeoutRef.current);
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = originalOverflow;
            if (previousActiveElementRef.current instanceof HTMLElement) {
                previousActiveElementRef.current.focus();
            }
        };
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div
            ref={backdropRef}
            className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-200 ${
                isVisible ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/0'
            }`}
            onMouseDown={(event) => {
                if (event.target === backdropRef.current && !isDeleting) {
                    onClose();
                }
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-delete-title"
                aria-describedby="confirm-delete-description"
                tabIndex={-1}
                className={`w-full max-w-md rounded-3xl border border-white/15 bg-gray-950/95 p-6 shadow-2xl transition-all duration-200 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
            >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-300">
                    <AlertTriangle className="h-6 w-6" />
                </div>

                <h2 id="confirm-delete-title" className="text-center text-xl font-bold text-white">
                    {title}
                </h2>
                <p className="mt-3 text-center text-base text-gray-200">{message}</p>
                <p id="confirm-delete-description" className="mt-1 text-center text-sm text-gray-400">
                    {description}
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
