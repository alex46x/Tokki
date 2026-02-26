import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

const ANIMATION_MS = 220;
const SWIPE_CLOSE_THRESHOLD = 110;

const getFocusableElements = (container) => {
    if (!container) return [];

    return Array.from(
        container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
    ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
};

const InfoSheetModal = ({ isOpen, onClose, title, descriptionId, children }) => {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    const backdropRef = useRef(null);
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousActiveElementRef = useRef(null);
    const focusTimeoutRef = useRef(null);
    const dragStartYRef = useRef(0);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const frame = requestAnimationFrame(() => setIsVisible(true));
            return () => cancelAnimationFrame(frame);
        }

        setIsVisible(false);
        setDragOffset(0);
        const hideTimeout = setTimeout(() => setShouldRender(false), ANIMATION_MS);
        return () => clearTimeout(hideTimeout);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;

        previousActiveElementRef.current = document.activeElement;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        focusTimeoutRef.current = setTimeout(() => {
            closeButtonRef.current?.focus();
        }, 0);

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
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
                first.focus();
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
    }, [isOpen, onClose]);

    if (!shouldRender) return null;

    const handleTouchStart = (event) => {
        if (event.touches.length !== 1) return;
        dragStartYRef.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
        if (event.touches.length !== 1) return;
        const nextOffset = event.touches[0].clientY - dragStartYRef.current;
        setDragOffset(nextOffset > 0 ? nextOffset : 0);
    };

    const handleTouchEnd = () => {
        if (dragOffset > SWIPE_CLOSE_THRESHOLD) {
            onClose();
        } else {
            setDragOffset(0);
        }
    };

    return (
        <div
            ref={backdropRef}
            className={`fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4 transition-all duration-200 ${
                isVisible ? 'bg-black/65 backdrop-blur-sm' : 'bg-black/0'
            }`}
            onMouseDown={(event) => {
                if (event.target === backdropRef.current) onClose();
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="info-sheet-title"
                aria-describedby={descriptionId}
                className={`w-full max-w-2xl bg-white text-gray-900 shadow-2xl border border-white/40 rounded-t-3xl sm:rounded-3xl max-h-[88vh] sm:max-h-[85vh] overflow-hidden transition-all duration-200 ${
                    isVisible ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-8 sm:scale-95'
                }`}
                style={dragOffset > 0 ? { transform: `translateY(${dragOffset}px)` } : undefined}
            >
                <div
                    className="sm:hidden px-6 pt-3 pb-2"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                >
                    <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300" />
                </div>

                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-sm px-5 py-4">
                    <h2 id="info-sheet-title" className="text-lg font-bold tracking-tight">
                        {title}
                    </h2>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-start/50"
                        aria-label={`Close ${title}`}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div
                    id={descriptionId}
                    className="overflow-y-auto px-5 pb-7 pt-5 sm:px-6 sm:pb-8 text-sm leading-6 text-gray-700 max-h-[calc(88vh-72px)] sm:max-h-[calc(85vh-72px)]"
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default InfoSheetModal;
