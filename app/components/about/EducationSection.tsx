import { motion } from "motion/react";
import { GraduationCap, Calendar, CheckCircle2 } from "lucide-react";
import type { EducationItem } from "../../data/types";

interface EducationSectionProps {
  title: string;
  education: EducationItem[];
}

export const EducationSection = ({
  title,
  education,
}: EducationSectionProps) => {
  if (!education || education.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
          <GraduationCap className="w-5 h-5" />
        </div>
        <h2 className="text-3xl font-black tracking-tight">{title}</h2>
      </div>

      <div className="space-y-8">
        {education.map((edu, index) => (
          <motion.div
            key={edu.id || `${edu.institution}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8 md:p-10 shadow-sm hover:shadow-xl hover:border-indigo-500/20 dark:hover:border-indigo-500/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                  {edu.degree}
                </h3>
                <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                  {edu.institution}
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 text-xs font-semibold text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  {edu.period}
                </span>
              </div>
            </div>

            <ul className="relative z-10 space-y-3.5">
              {edu.highlights.map((highlight, hIndex) => (
                <li
                  key={hIndex}
                  className="flex items-start gap-3.5 text-gray-600 dark:text-gray-300 leading-relaxed text-base"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
