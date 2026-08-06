import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

interface VendorCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  hoverEffect?: boolean;
}

export function VendorCard({ 
  children, 
  className, 
  noPadding = false,
  hoverEffect = false,
  ...props 
}: VendorCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={clsx(
        'bg-white rounded-2xl border border-teal-50',
        'shadow-[0_4px_20px_-4px_rgba(0,131,143,0.05)]',
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
