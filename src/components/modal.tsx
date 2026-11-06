"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function Modal({ open, onClose, label, className, children, onKeyDown, drawer = false }: {
  open: boolean;
  onClose: () => void;
  label: string;
  className: string;
  children: ReactNode;
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open || !ref.current) return;
    ref.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return <motion.dialog
    ref={ref}
    className={`modal ${className}`}
    aria-label={label}
    initial={false}
    animate={{ opacity: open ? 1 : 0, x: drawer && !open && !reduce ? "100%" : "0%" }}
    transition={reduce ? { duration: 0.1 } : drawer ? { type: "spring", duration: 1, bounce: 0 } : { type: "spring", stiffness: 300, damping: 50, mass: 1 }}
    onAnimationComplete={() => { if (!open) ref.current?.close(); }}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={onKeyDown}
  >{children}</motion.dialog>;
}
