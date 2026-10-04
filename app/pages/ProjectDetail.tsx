import { useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "../components/Link";
import { motion, AnimatePresence } from "motion/react";
import { AdminSimpleEntityForm } from "../components/admin/AdminSimpleEntityForm";
import { Section } from "../components/Section";
import { Button } from "../components/Button";
import { VideoPlayer } from "../components/VideoPlayer";
import { PageAdminEditor } from "../components/admin/PageAdminEditor";
import { useAdminSession } from "../hooks/useAdminSession";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTranslation } from "../i18n/useTranslation";
import { useRootData } from "../hooks/useRootData";
import { PageSEO } from "../components/PageSEO";
import { AdminSectionWrapper } from "../components/admin/AdminSectionWrapper";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code2,
  Rocket,
  Zap,
  Monitor,
  Video,
  X,
} from "lucide-react";

export const ProjectDetail = () => {
  const { id } = useParams();
  const { t, lang } = useTranslation();
  const { projects } = useSiteContent();
  const { isAdminAuthenticated } = useAdminSession();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rootData = useRootData();
  const project = projects.find((p) => p.id === id);

  if (!rootData) {
    throw new Error("Root data is not available.");
  }

  if (!project) {
    return (
      <Section className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">{t.common.notFound}</h1>
          <Button to="/projects" variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.common.backHome}
          </Button>
        </div>
      </Section>
    );
  }

  const seoTitle = `${project.title} | Project by Ahmed Magdy`;
  const seoDescription = project.description;

  return (
    <Section className="pt-24 pb-40 relative overflow-hidden bg-gray-50/30 dark:bg-black/20">
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        url={`${rootData.siteUrl}/projects/${id}`}
      />

      {/* Decorative Canvas */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-linear-to-b from-blue-500/5 to-transparent -z-10" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto px-6"
      >
        <Link
          to="/projects"
          className="inline-flex items-center gap-3 text-muted-foreground hover:text-blue-600 transition-all mb-16 group"
        >
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {t.projects.backToList}
          </span>
        </Link>

        {/* Hero Narrative */}
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">
                  Project Profile
                </div>
              </div>
              <h1 className="text-4xl md:text-7xl font-black tracking-tight text-foreground leading-[0.9] mb-8 italic">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:mb-2">
              {project.liveUrl && (
                <Button
                  href={project.liveUrl}
                  external
                  variant="primary"
                  className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-blue-600/20"
                >
                  {t.projects.liveDemo}
                </Button>
              )}
              {project.sourceUrl && (
                <Button
                  href={project.sourceUrl}
                  external
                  variant="outline"
                  className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[11px] border-2"
                >
                  {t.projects.sourceCode}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-gray-100 dark:border-gray-800 mb-20">
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Primary Role
            </div>
            <div className="text-sm font-bold">
              {project.primaryRole || "Engineering Lead"}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Core Tech
            </div>
            <div className="text-sm font-bold">
              {project.coreTech || project.techStack[0]}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Category
            </div>
            <div className="text-sm font-bold">
              {project.category || "Full-Stack Solution"}
            </div>
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Timeline
            </div>
            <div className="text-sm font-bold">
              {project.timeline || "Q2 2026"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-24">
            {project.image && (
              <div
                className="relative group cursor-zoom-in"
                onClick={() => setIsFullscreen(true)}
              >
                <div className="absolute inset-0 bg-blue-600/10 blur-3xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl transition-transform duration-1000 group-hover:scale-[1.01]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-1000 animate-heartbeat group-hover:[animation:none] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-60" />
                </div>
              </div>
            )}

            <div className="space-y-32">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-black tracking-tight mb-8 flex items-center gap-4">
                  <Monitor className="w-5 h-5 text-blue-500" />{" "}
                  {lang === "en" ? "Project Objectives" : "أهداف المشروع"}
                </h2>
                <div className="prose prose-xl dark:prose-invert max-w-none">
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                    {project.fullDescription}
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-12 -left-12 text-[10vw] font-black text-gray-100 dark:text-gray-900 pointer-events-none select-none -z-10 uppercase">
                  STRATEGY
                </div>
                <h2 className="text-2xl font-black tracking-tight mb-10 flex items-center gap-4">
                  <Zap className="w-5 h-5 text-amber-500" />{" "}
                  {t.projects.challenges}
                </h2>
                <div className="p-12 rounded-[3.5rem] bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 shadow-2xl relative overflow-hidden group/card">
                  <Zap className="absolute top-0 right-0 p-12 opacity-5 w-40 h-44 text-amber-500 transition-transform duration-700 group-hover/card:scale-110" />
                  <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed italic relative z-10 font-medium">
                    "{project.challenges}"
                  </p>
                </div>
              </div>

              {project.video && (
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-10 flex items-center gap-4">
                    <Video className="w-5 h-5 text-red-500" /> Live Prototype
                  </h2>
                  <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
                    <VideoPlayer url={project.video} title={project.title} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32 space-y-12">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8 border-l-2 border-blue-600 pl-4">
                  {t.projects.techStack}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-5 py-2.5 bg-white dark:bg-gray-950 text-foreground dark:text-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-800 hover:border-blue-500/50 transition-all cursor-default shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-10 rounded-[3rem] bg-gray-950 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-600/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <h3 className="font-black text-2xl mb-4 relative z-10">
                  Collaboration
                </h3>
                <p className="text-gray-400 text-sm mb-10 leading-relaxed font-medium relative z-10">
                  Interested in building something similar? Let's discuss your
                  next engineering challenge.
                </p>
                <Link
                  to="/contact"
                  className="relative z-10 inline-flex h-14 items-center justify-center px-10 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all w-full shadow-lg"
                >
                  Start Conversation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {isAdminAuthenticated && (
          <AdminSectionWrapper title={`Project Editor: ${project.title}`}>
            <div className="space-y-8">
              <AdminSimpleEntityForm
                title="Metadata Editor"
                description="Update the visual identity, links, and high-level summaries."
                collection="projects"
                itemId={project.id}
                entity={project}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <PageAdminEditor
                  title="Direct JSON Access"
                  description="Modify the full project schema directly."
                  payload={JSON.stringify(project, null, 2)}
                  intent="save-entity"
                  collection="projects"
                  itemId={project.id}
                />
                <PageAdminEditor
                  title="Detail Translations"
                  description="Modify localized strings for project pages."
                  payload={JSON.stringify(
                    {
                      en: rootData.translations.en.projects,
                      ar: rootData.translations.ar.projects,
                    },
                    null,
                    2,
                  )}
                  intent="save-translation-section"
                  section="projects"
                />
              </div>
            </div>
          </AdminSectionWrapper>
        )}
      </motion.div>

      <AnimatePresence>
        {isFullscreen && project.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm cursor-zoom-out"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={project.image}
              alt={project.title}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
};
