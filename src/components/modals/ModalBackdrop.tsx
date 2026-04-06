"use client";

import { useEffect } from "react";

interface ModalBackdropProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalBackdrop({ onClose, children }: ModalBackdropProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-on-surface/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className="relative z-10 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl overflow-hidden">
        {/* Glassmorphism surface */}
        <div
          className="bg-surface-container-lowest/95 backdrop-blur-xl shadow-ghost-lg overflow-y-auto max-h-[90dvh]"
          style={{ boxShadow: "0 12px 40px rgba(43, 52, 55, 0.06)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
