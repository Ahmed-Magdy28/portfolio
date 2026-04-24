import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export const Section = ({ children, className = '' }: SectionProps) => {
  return (
    <section className={`py-12 md:py-20 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {children}
      </div>
    </section>
  );
};
