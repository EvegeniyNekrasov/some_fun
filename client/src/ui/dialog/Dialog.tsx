import React, {
    type ReactNode,
    type RefObject,
    forwardRef,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

type Size = "sm" | "md" | "lg" | "xl" | "xxl";

type Title = {
    type: "link" | "text";
    to?: string;
    text: string;
};

const sizeMap: Record<Size, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    xxl: "max-w-4xl",
};

export interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: Title;
    description?: string;
    size?: Size;
    initialFocusRef?: RefObject<HTMLElement>;
    className?: string;
    children: ReactNode;
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
    (
        {
            open,
            onClose,
            title,
            description,
            size = "md",
            initialFocusRef,
            className,
            children,
        },
        forwardedRef
    ) => {
        const portalRoot = useRef<HTMLElement | null>(null);
        const previouslyFocused = useRef<Element | null>(null);

        useEffect(() => {
            portalRoot.current = document.body;
        }, []);

        useEffect(() => {
            if (open) {
                previouslyFocused.current = document.activeElement;
                const nextFocus =
                    initialFocusRef?.current ??
                    (forwardedRef as React.RefObject<HTMLDivElement>)?.current;
                window.setTimeout(() => nextFocus?.focus(), 0);
            } else {
                (previouslyFocused.current as HTMLElement | null)?.focus?.();
            }
        }, [open, initialFocusRef, forwardedRef]);

        const handleKeyDown = useCallback(
            (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    e.stopPropagation();
                    onClose();
                }
            },
            [onClose]
        );

        useEffect(() => {
            if (open) {
                window.addEventListener("keydown", handleKeyDown);
                return () =>
                    window.removeEventListener("keydown", handleKeyDown);
            }
        }, [open, handleKeyDown]);

        const handleBackdropClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            onClose();
        };

        const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

        if (!open && portalRoot.current === null) return null;

        return createPortal(
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="overlay"
                        aria-modal
                        role="dialog"
                        aria-labelledby={title ? "dialog-title" : undefined}
                        aria-describedby={
                            description ? "dialog-desc" : undefined
                        }
                        tabIndex={-1}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}>
                        <motion.div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={handleBackdropClick}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* panel */}
                        <motion.div
                            ref={forwardedRef}
                            role="document"
                            onClick={stopPropagation}
                            className={clsx(
                                "relative z-10 w-full rounded bg-white p-6 shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                                sizeMap[size],
                                className
                            )}
                            tabIndex={-1}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}>
                            {title ? (
                                <>
                                    {title.type === "link" ? (
                                        <Link to={title.to ?? "/"}>
                                            {title.text}
                                        </Link>
                                    ) : null}
                                    {title.type === "text" ? (
                                        <h2
                                            id="dialog-title"
                                            className="text-xl font-semibold text-gray-900">
                                            {title.text}
                                        </h2>
                                    ) : null}
                                </>
                            ) : null}
                            {description && (
                                <p
                                    id="dialog-desc"
                                    className="mt-1 text-sm text-gray-600">
                                    {description}
                                </p>
                            )}

                            <div className="mt-4">{children}</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>,
            portalRoot.current!
        );
    }
);

export default Dialog;
