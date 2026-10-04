import { motion } from "motion/react";
import { Briefcase, Calendar, MapPin, Sparkles, CheckCircle2 } from "lucide-react";
import type { ExperienceItem } from "../../data/types";
import { Badge } from "../ui/badge";

interface ExperienceSectionProps {
  title: string;
  experiences: ExperienceItem[];
}

export const ExperienceSection = ({
  title,
  experiences,
}: ExperienceSectionProps) => {
  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800">
          <Briefcase className="w-5 h-5" />
        </div>
        <h2 className="text-3xl font-black tracking-tight">{title}</h2>
      </div>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id || `${exp.company}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 p-8 md:p-10 shadow-sm hover:shadow-xl hover:border-blue-500/20 dark:hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {exp.role}
                  </h3>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    @ {exp.company}
                  </span>
                </div>

                {exp.note && (
                  <Badge
                    variant="outline"
                    className="mt-1 px-3 py-1 bg-blue-50/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs font-semibold rounded-full"
                  >
                    <Sparkles className="w-3 h-3 mr-1.5 shrink-0" />
                    {exp.note}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap md:flex-col md:items-end gap-2 text-xs font-semibold text-muted-foreground shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  {exp.period}
                </span>
                {exp.location && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    {exp.location}
                  </span>
                )}
              </div>
            </div>

            <ul className="relative z-10 space-y-3.5">
              {exp.highlights.map((highlight, hIndex) => (
                <li
                  key={hIndex}
                  className="flex items-start gap-3.5 text-gray-600 dark:text-gray-300 leading-relaxed text-base"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
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
