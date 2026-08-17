"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dayTheme } from "../../lib/theme";
import { PixelButton } from "./pixel-button";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "coin" | "brick" | "pipe";
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  variant = "coin",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[rgba(13,27,42,0.98)] border-4 border-black p-6 space-y-6 shadow-[8px_8px_0px_#000] text-center"
          >
            {/* Header Title */}
            <h2
              className="pixel-text text-sm md:text-base font-bold tracking-wider"
              style={{
                color: variant === "brick" ? dayTheme.colors.mario : dayTheme.colors.coin,
              }}
            >
              {title}
            </h2>

            {/* Message Body */}
            <p className="text-xs md:text-sm font-mono text-white leading-relaxed px-2">
              {message}
            </p>

            {/* Actions */}
            <div className="flex gap-4 justify-center pt-2">
              <PixelButton
                variant={variant}
                size="md"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? "PROCESSING..." : confirmText}
              </PixelButton>
              <PixelButton
                variant="pipe"
                size="md"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelText}
              </PixelButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
