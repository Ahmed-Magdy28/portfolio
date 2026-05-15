import { lazy, Suspense, useMemo } from "react";
import { useAdminSession } from "../hooks/useAdminSession";
import { useHomeAdminAvatar } from "../hooks/useHomeAdminAvatar";
import { useRootData } from "../hooks/useRootData";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTranslation } from "../i18n/useTranslation";
import { PageSEO } from "../components/PageSEO";
import { AdminSectionWrapper } from "../components/admin/AdminSectionWrapper";
import { AdminAvatarEditor } from "../components/admin/AdminAvatarEditor";

// Lazy loaded components
const Hero = lazy(() =>
  import("../components/home/Hero").then((m) => ({ default: m.Hero })),
);
const TechStack = lazy(() =>
  import("../components/home/TechStack").then((m) => ({
    default: m.TechStack,
  })),
);
const FeaturedProjects = lazy(() =>
  import("../components/home/FeaturedProjects").then((m) => ({
    default: m.FeaturedProjects,
  })),
);
const AboutFeatures = lazy(() =>
  import("../components/home/AboutFeatures").then((m) => ({
    default: m.AboutFeatures,
  })),
);
const ContactCTA = lazy(() =>
  import("../components/home/ContactCTA").then((m) => ({
    default: m.ContactCTA,
  })),
);

const LazyPageAdminEditor = lazy(() =>
  import("../components/admin/PageAdminEditor").then((module) => ({
    default: module.PageAdminEditor,
  })),
);

const SectionSkeleton = () => (
  <div className="w-full h-[400px] flex items-center justify-center animate-pulse bg-gray-50 dark:bg-gray-900/50 rounded-3xl my-8">
    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800" />
  </div>
);

export const Home = () => {
  const { t, lang } = useTranslation();
  const {
    home,
    projects = [],
    languages = [],
    frameworks = [],
    about,
    contact,
  } = useSiteContent();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRootData();
  const { avatarSize, avatarValue, setAvatarSize, setAvatarValue } =
    useHomeAdminAvatar(home);

  const languageSlugs = useMemo(
    () => new Set(languages.map((l) => l.slug)),
    [languages],
  );

  const featuredProjects = useMemo(
    () => projects.filter((p) => p.featured).slice(0, 3),
    [projects],
  );

  const seoTitle = `${home.name} | Professional Frontend Web Developer`;
  const seoDescription =
    "Ahmed Magdy is a Frontend Web Developer and Software Engineer building modern, high-performance web applications with React, TypeScript, and Next.js. Explore my projects and tech stack.";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: home.name,
    url: rootData.siteUrl,
    jobTitle: "Frontend Web Developer",
    sameAs: [
      "https://github.com/Ahmed-Magdy28",
      "https://linkedin.com/in/ahmedmagdy2849",
    ],
    knowsAbout: [
      "React",
      "TypeScript",
      "Next.js",
      "Web Development",
      "Flutter",
      "Django",
    ],
  };

  return (
    <>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        url={`${rootData.siteUrl}/`}
        canonical={`${rootData.siteUrl}/`}
        structuredData={structuredData}
      />

      <Suspense fallback={<SectionSkeleton />}>
        <Hero t={t} home={home} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TechStack
          lang={lang}
          languages={languages}
          frameworks={frameworks}
          languageSlugs={languageSlugs}
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <FeaturedProjects
          t={t}
          lang={lang}
          featuredProjects={featuredProjects}
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <AboutFeatures lang={lang} home={home} about={about} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ContactCTA t={t} contact={contact} />
      </Suspense>

      {isAdminAuthenticated && (
        <AdminSectionWrapper title="Home Page Management">
          <div className="space-y-8">
            <AdminAvatarEditor
              home={home}
              avatarValue={avatarValue}
              avatarSize={avatarSize}
              setAvatarValue={setAvatarValue}
              setAvatarSize={setAvatarSize}
              lang={lang}
            />

            <Suspense
              fallback={
                <div className="p-10 text-center animate-pulse">
                  Loading editor...
                </div>
              }
            >
              <div className="grid gap-6 md:grid-cols-2">
                <LazyPageAdminEditor
                  title="Page Content"
                  description="Edit name, avatar, CV, and features."
                  payload={JSON.stringify(home, null, 2)}
                  intent="save-content-section"
                  section="home"
                />
                <LazyPageAdminEditor
                  title="Translations"
                  description="Edit text keys for EN/AR."
                  payload={JSON.stringify(
                    {
                      en: rootData.translations.en.home,
                      ar: rootData.translations.ar.home,
                    },
                    null,
                    2,
                  )}
                  intent="save-translation-section"
                  section="home"
                />
              </div>
            </Suspense>
          </div>
        </AdminSectionWrapper>
      )}
    </>
  );
};
