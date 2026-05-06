'use client';

/**
 * PageTransition — Route-level fade-in animation wrapper.
 *
 * Wraps page content in a Framer Motion `motion.div` that fades in whenever
 * the route changes. Uses the pathname as the key so React remounts the
 * motion.div on every navigation, triggering a fresh entrance animation.
 *
 * No AnimatePresence / exit animation — the App Router doesn't unmount the
 * previous page before mounting the new one, so exit animations cause content
 * to get stuck invisible.
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4
 */

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}
