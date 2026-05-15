import { motion } from "motion/react";

interface SkillGroupProps {
  category: string;
  items: string[];
  index: number;
}

export const SkillGroup = ({ category, items, index }: SkillGroupProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 dark:border-gray-800 dark:bg-gray-900/50"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-colors" />
    
    <h3 className="relative z-10 text-xl font-black mb-6 tracking-tight text-blue-600 dark:text-blue-400 uppercase">
      {category}
    </h3>
    <ul className="relative z-10 space-y-4">
      {items.map((skill) => (
        <li
          key={skill}
          className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium group/item"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover/item:scale-150 transition-transform" />
          {skill}
        </li>
      ))}
    </ul>
  </motion.div>
);
