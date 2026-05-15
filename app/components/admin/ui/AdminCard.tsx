import type { ReactNode } from "react";
import { cn } from "../../ui/utils";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: ReactNode;
  headerActions?: ReactNode;
}

export const AdminCard = ({ children, className, title, description, icon, headerActions }: AdminCardProps) => (
  <div className={cn("overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50 dark:backdrop-blur-sm", className)}>
    {(title || description || icon || headerActions) && (
      <div className="flex items-start justify-between border-b border-gray-50 p-6 dark:border-gray-800/50 md:px-8">
        <div className="flex gap-4">
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {icon}
            </div>
          )}
          <div>
            {title && <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h3>}
            {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
        </div>
        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
      </div>
    )}
    <div className="p-6 md:p-8">
      {children}
    </div>
  </div>
);
