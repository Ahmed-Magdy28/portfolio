import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';

interface Tab {
  label: string;
  path: string;
}

interface TabsProps {
  tabs: Tab[];
}

export type { Tab };

export const Tabs = ({ tabs }: TabsProps) => {
  const location = useLocation();

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
      <nav className="flex gap-8 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="relative py-4 px-1 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <span
                className={
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
