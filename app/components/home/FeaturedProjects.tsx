import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../Button";
import { Section } from "../Section";
import { ProjectCard } from "../ProjectCard";

interface FeaturedProjectsProps {
  t: any;
  lang: string;
  featuredProjects: any[];
}

export const FeaturedProjects = ({
  t,
  lang,
  featuredProjects,
}: FeaturedProjectsProps) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const xRight = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <Section id="projects" className="relative overflow-hidden py-32">
      {/* 3D Background Parallax Text */}
      <div className="absolute top-1/2 left-0 w-full pointer-events-none select-none -translate-y-1/2 opacity-[0.03] dark:opacity-[0.07] overflow-hidden whitespace-nowrap z-0">
        <motion.div
          style={{ x: xLeft }}
          className="text-[15vw] font-black uppercase leading-none mb-4"
        >
          Engineering Excellence • Innovation • Design
        </motion.div>
        <motion.div
          style={{ x: xRight }}
          className="text-[15vw] font-black uppercase leading-none"
        >
          Creative Solutions • Future • Performance
        </motion.div>
      </div>

      <div className="relative z-10" ref={containerRef}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
          <div className="max-w-2xl text-center lg:text-left rtl:lg:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <Sparkles className="w-3 h-3" /> Selected Works
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-[0.9]">
              {t.home.viewProjects}
            </h2>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              {lang === "en"
                ? "A showcase of high-impact engineering solutions, ranging from scalable full-stack platforms to elegant mobile experiences."
                : "معرض للحلول الهندسية عالية التأثير، تتراوح من المنصات المتكاملة القابلة للتطوير إلى تجارب الهاتف المحمول الأنيقة."}
            </p>
          </div>
          <Button
            to="/projects"
            variant="outline"
            className="rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[11px] group self-center lg:self-end border-2"
          >
            {lang === "en" ? "Explore Archive" : "استكشاف الأرشيف"}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:2000px]">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              whileHover={{
                y: -15,
                transition: { duration: 0.4 },
              }}
              className="transform-gpu"
            >
              <ProjectCard
                project={project}
                index={index}
                liveLabel={t.projects.liveDemo}
                sourceLabel={t.projects.sourceCode}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
