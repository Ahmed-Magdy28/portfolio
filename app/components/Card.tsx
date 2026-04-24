import type { ReactNode } from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className = '', hover = false, onClick }: CardProps) => {
  const Component = hover ? motion.div : 'div';

  return (
    <Component
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-all ${
        hover ? 'cursor-pointer' : ''
      } ${className}`}
      whileHover={hover ? { y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } : undefined}
    >
      {children}
    </Component>
  );
};
