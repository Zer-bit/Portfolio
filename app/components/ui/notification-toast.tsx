"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Coin from "../game/coin";
import { dayTheme } from "../../lib/theme";
import { PixelButton } from "./pixel-button";

interface NotificationToastProps {
    isVisible: boolean;
    message: string;
    onClose: () => void;
}

const NotificationToast = ({ isVisible, message, onClose }: NotificationToastProps) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 1300);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-none"
        >
            <div className="relative group max-w-md w-full pointer-events-auto">
                <div
                    className="relative bg-white pixel-shadow flex flex-col items-center text-center overflow-hidden p-6"
                    style={{ border: `2px solid ${dayTheme.colors.border}` }}
                >
                    <PixelButton
                        variant="brick"
                        size="sm"
                        onClick={onClose}
                        aria-label="Close notification"
                        style={{ position: "absolute", top: 12, right: 12, padding: "4px 6px" }}
                    >
                        <X size={14} />
                    </PixelButton>

                    <div className="w-16 h-16 flex items-center justify-center mb-4">
                        <Coin size={20} />
                    </div>
                    <p className="pixel-text text-gray-600 text-sm leading-relaxed">
                        {message}
                    </p>

                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1 bg-[#9cbd09] rounded-b-2xl"
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default NotificationToast;
