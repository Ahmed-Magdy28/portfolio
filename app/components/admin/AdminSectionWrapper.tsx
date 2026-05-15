import type { ReactNode } from "react";
import { Section } from "../Section";

interface AdminSectionWrapperProps {
  children: ReactNode;
  title?: string;
}

export const AdminSectionWrapper = ({
  children,
  title = "Admin Controls",
}: AdminSectionWrapperProps) => (
  <Section className="mt-32 space-y-6 pt-16 border-t border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-2 mb-8">
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">
        {title}
      </span>
      <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
    </div>
    <div className="mx-auto max-w-5xl">
        {children}
    </div>
  </Section>
);
