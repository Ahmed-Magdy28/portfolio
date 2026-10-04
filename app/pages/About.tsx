import { motion } from "motion/react";
import { PageAdminEditor } from "../components/admin/PageAdminEditor";
import { VideoPlayer } from "../components/VideoPlayer";
import { Section } from "../components/Section";
import { useAdminSession } from "../hooks/useAdminSession";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTranslation } from "../i18n/useTranslation";
import { useRootData } from "../hooks/useRootData";
import { PageSEO } from "../components/PageSEO";
import { ExperienceSection } from "../components/about/ExperienceSection";
import { EducationSection } from "../components/about/EducationSection";
import { SkillGroup } from "../components/about/SkillGroup";
import { AboutCTA } from "../components/about/AboutCTA";
import { AdminSectionWrapper } from "../components/admin/AdminSectionWrapper";

export const About = () => {
  const { about } = useSiteContent();
  const { t, lang } = useTranslation();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRootData();

  if (!rootData) {
    throw new Error("Root data is not available.");
  }

  const seoTitle = "About Ahmed Magdy | Front-End & Full-Stack Web Developer";
  const seoDescription =
    "Learn more about Ahmed Magdy, a results-driven Front-End and Full-Stack Web Developer with agency experience delivering high-performance web applications.";

  return (
    <Section>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        url={`${rootData.siteUrl}/about`}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-12 tracking-tight">{t.about.title}</h1>

        <div className="prose prose-xl dark:prose-invert max-w-none mb-16">
          <p className="text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-semibold">
            {t.about.description}
          </p>

          <div className="mt-8 space-y-6">
            {about.paragraphs.map((paragraph, index) => (
                <p
                key={`${paragraph.slice(0, 20)}-${index}`}
                className="text-lg text-muted-foreground leading-relaxed"
                >
                {paragraph}
                </p>
            ))}
          </div>
        </div>

        {about.video && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-24"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-3xl font-black tracking-tight">Personal Narrative</h2>
              <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                Video Showcase
              </div>
            </div>
            <VideoPlayer url={about.video} title={`${t.about.title} video`} />
          </motion.div>
        )}

        {about.experiences && about.experiences.length > 0 && (
          <ExperienceSection
            title={t.about.experienceTitle || "Work Experience"}
            experiences={about.experiences}
          />
        )}

        {about.education && about.education.length > 0 && (
          <EducationSection
            title={t.about.educationTitle || "Education & Professional Training"}
            education={about.education}
          />
        )}

        <div className="mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-8">
              {t.about.skillsTitle || "Technical Expertise"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {about.skills.map((skillGroup, index) => (
                <SkillGroup 
                    key={skillGroup.category} 
                    category={skillGroup.category} 
                    items={skillGroup.items} 
                    index={index} 
                />
            ))}
            </div>
        </div>

        <AboutCTA 
            title={about.ctaTitle}
            text={about.ctaText}
            linkLabel={about.ctaLinkLabel}
            linkUrl={about.ctaLinkUrl}
        />

        {isAdminAuthenticated && (
          <AdminSectionWrapper title="About Page Content">
            <div className="grid gap-6 md:grid-cols-2">
                <PageAdminEditor
                    title="Narrative & Skills"
                    description="Edit paragraphs, expertise categories, and CTA."
                    payload={JSON.stringify(about, null, 2)}
                    intent="save-content-section"
                    section="about"
                />
                <PageAdminEditor
                    title="Translations"
                    description="Edit core page headers and short descriptions."
                    payload={JSON.stringify(
                        { [lang]: rootData.translations[lang].about },
                        null,
                        2,
                    )}
                    intent="save-translation-section"
                    section="about"
                    locale={lang}
                />
            </div>
          </AdminSectionWrapper>
        )}
      </motion.div>
    </Section>
  );
};
