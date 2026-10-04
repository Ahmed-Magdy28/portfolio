import { motion } from "motion/react";
import { Link } from "./Link";
import type { Project } from "../data/types";
import { ArrowUpRight } from "lucide-react";
import { IconValue } from "./IconValue";

interface ProjectCardProps {
  project: Project;
  index: number;
  liveLabel: string;
  sourceLabel: string;
}

export const ProjectCard = ({
  project,
  index,
  liveLabel,
  sourceLabel,
}: ProjectCardProps) => {
  const displayIndex = (index + 1).toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="group relative h-full"
    >
      <div className="relative h-full bg-white dark:bg-gray-950 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 transition-all duration-700 group-hover:border-blue-500/30 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
        {/* Main Card Link - stretched across the card */}
        <Link
          to={`/projects/${project.id}`}
          className="absolute inset-0 z-10"
          aria-label={project.title}
        />

        {/* Glass Reflection Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-30">
          <div className="absolute top-[-100%] left-[-100%] w-[300%] h-[300%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.1)_50%,transparent_55%)] animate-[shine_3s_infinite]" />
        </div>

        {/* Index Number */}
        <div className="absolute top-8 left-8 z-20 mix-blend-difference pointer-events-none">
          <span className="text-[9px] font-black tracking-[0.4em] text-white/30 uppercase">
            Work {displayIndex}
          </span>
        </div>

        {/* Visual Canvas */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              width={600}
              height={375}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-16">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <IconValue
                  value={project.icon || ""}
                  alt={project.title}
                  className="text-8xl relative z-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3"
                  imageClassName="h-32 w-32 object-contain"
                />
              </div>
            </div>
          )}

          <div className="absolute bottom-6 right-6 z-20 scale-75 opacity-0 translate-y-4 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-xl">
              <ArrowUpRight className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Content Space */}
        <div className="flex-1 p-10 flex flex-col pointer-events-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-blue-600/30 group-hover:w-12 transition-all duration-500" />
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 2).map((tech) => (
                <span
                  key={tech}
                  className="text-[9px] font-black uppercase tracking-widest text-blue-600/60 dark:text-blue-400/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <h3 className="text-2xl font-black mb-4 tracking-tight text-foreground leading-tight group-hover:text-blue-600 transition-colors duration-300">
            {project.title}
          </h3>

          <p className="text-gray-500 dark:text-gray-400 mb-8 line-clamp-2 leading-relaxed text-sm font-medium">
            {project.description}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex gap-4 relative z-20 pointer-events-auto">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-blue-600 transition-colors"
                >
                  {liveLabel}
                </a>
              )}
              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-blue-600 transition-colors"
                >
                  {sourceLabel}
                </a>
              )}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
