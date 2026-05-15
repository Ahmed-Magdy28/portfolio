import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CodeBlock } from './CodeBlock';
import { VideoPlayer } from './VideoPlayer';
import type { AccordionItem, ContentBlock } from '../data/types';

interface AccordionProps {
  items: AccordionItem[];
}

export const Accordion = ({ items }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return '';
    }
  };

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
            {block.text}
          </div>
        );
      case 'code':
        return <CodeBlock code={block.code} language={block.language || 'javascript'} />;
      case 'video':
        return <VideoPlayer url={block.url} />;
      case 'image': {
        const aspectClasses = {
          auto: 'aspect-auto',
          square: 'aspect-square',
          video: 'aspect-video',
          wide: 'aspect-[21/9]',
        };
        
        return (
          <div className="flex flex-col gap-2">
            <div 
              className={`relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 ${aspectClasses[block.aspectRatio || 'auto']}`}
              style={{
                width: block.width || '100%',
                height: block.height || 'auto',
                maxWidth: '100%',
              }}
            >
              <img
                src={block.url}
                alt={block.alt || 'Content image'}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
            {block.alt && <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">{block.alt}</span>}
          </div>
        );
      }
      case 'link':
        return (
          <a
            href={block.url}
            target={block.url.startsWith('http') ? '_blank' : undefined}
            rel={block.url.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white transition hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <span>{block.label}</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 3h7m0 0v7m0-7L10 14M5 5h5M5 5v14h14v-5"
              />
            </svg>
          </a>
        );
      case 'hashtags':
        return (
          <div className="flex flex-wrap gap-2">
            {block.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200 uppercase tracking-tighter"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = openItems.has(item.id);

        return (
          <div
            key={item.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-colors"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.title}
                </span>
                {item.difficulty && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                      item.difficulty
                    )}`}
                  >
                    {item.difficulty}
                  </span>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                    {item.blocks && item.blocks.length > 0
                      ? item.blocks.map((block) => <div key={block.id}>{renderBlock(block)}</div>)
                      : null}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
