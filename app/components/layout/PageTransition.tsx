'use client';

/**
 * PageTransition — Route-level fade animation wrapper.
 *
 * Wraps page content in a Framer Motion `motion.div` that fades in/out
 * whenever the route changes. Uses `AnimatePresence` keyed on the current
 * pathname so Next.js App Router route changes trigger the animation.
 *
 * Animation: simple opacity fade with a 300ms ease-out duration (≤ 400ms).
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4
 */

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Framer Motion variants for the page-level fade transition.
 * Duration is 300ms — well within the 400ms ceiling from Requirement 11.4.
 */
const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
