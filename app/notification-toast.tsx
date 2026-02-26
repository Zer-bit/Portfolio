"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

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
            }, 1300); // 1.3s delay + 0.2s exit = 1.5s total
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-none"
                >
                    <div className="relative group max-w-md w-full pointer-events-auto">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                        <div className="relative bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center holographic-border overflow-hidden">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center text-violet-500 mb-4 animate-pulse">
                                <AlertCircle size={32} />
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {message}
                            </p>

                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 1.5, ease: "linear" }}
                                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-b-2xl"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationToast;
