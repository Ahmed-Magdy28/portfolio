import { useState, type ReactNode } from "react";
import { cn } from "../../ui/utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: ReactNode;
  headerActions?: ReactNode;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
}

export const AdminCard = ({ 
  children, 
  className, 
  title, 
  description, 
  icon, 
  headerActions,
  isCollapsible = false,
  defaultOpen = true
}: AdminCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50 dark:backdrop-blur-sm", className)}>
      {(title || description || icon || headerActions) && (
        <div 
          className={cn(
            "flex items-start justify-between border-b border-gray-50 p-6 dark:border-gray-800/50 md:px-8",
            isCollapsible && "cursor-pointer select-none hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
          )}
          onClick={() => isCollapsible && setIsOpen(!isOpen)}
        >
          <div className="flex gap-4">
            {icon && (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                {title && <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h3>}
                {isCollapsible && (
                  isOpen ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
              {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
            </div>
          </div>
          {headerActions && (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {headerActions}
            </div>
          )}
        </div>
      )}
      {isOpen && (
        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
};
