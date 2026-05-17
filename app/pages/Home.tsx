import { lazy, Suspense, useMemo } from "react";
import { useAdminSession } from "../hooks/useAdminSession";
import { useHomeAdminAvatar } from "../hooks/useHomeAdminAvatar";
import { useRootData } from "../hooks/useRootData";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTranslation } from "../i18n/useTranslation";
import { PageSEO } from "../components/PageSEO";
import { AdminSectionWrapper } from "../components/admin/AdminSectionWrapper";
import { AdminAvatarEditor } from "../components/admin/AdminAvatarEditor";
import { AdminCard } from "../components/admin/ui/AdminCard";
import { AdminEntityCollectionEditor } from "../components/admin/AdminEntityCollectionEditor";
import { Sparkles, Code2, FolderGit2, LayoutDashboard, Globe } from "lucide-react";

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
    () => projects.filter((p) => p.featuredPro).slice(0, 3),
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

        <TechStack
          lang={lang}
          languages={languages}
          frameworks={frameworks}
          languageSlugs={languageSlugs}
        />

        <FeaturedProjects
          t={t}
          lang={lang}
          featuredProjects={featuredProjects}
        />

        <AboutFeatures
          lang={lang}
          home={home}
          about={about}
        />

        <ContactCTA
          t={t}
          contact={contact}
        />
      </Suspense>

      {isAdminAuthenticated && (
        <AdminSectionWrapper title="Home Page Management">
          <div className="space-y-6">
            <Suspense
              fallback={
                <div className="p-10 text-center animate-pulse">
                  Loading management console...
                </div>
              }
            >
              {/* Identity & Avatar */}
              <AdminAvatarEditor
                home={home}
                avatarValue={avatarValue}
                avatarSize={avatarSize}
                setAvatarValue={setAvatarValue}
                setAvatarSize={setAvatarSize}
                lang={lang}
              />

              {/* Hero Management */}
              <AdminCard
                title="Hero & Professional Titles"
                description="Manage your display name and rotation of professional titles."
                icon={<Sparkles className="w-6 h-6 text-yellow-500" />}
                className="border-t-4 border-t-yellow-500"
                isCollapsible={true}
                defaultOpen={false}
              >
                <LazyPageAdminEditor
                  title="Hero Titles & Data"
                  description="Edit your name and the 'titles' array."
                  payload={JSON.stringify(home, null, 2)}
                  intent="save-content-section"
                  section="home"
                />
              </AdminCard>

              {/* Tech Stack Management */}
              <AdminCard
                title="Tech Stack Management"
                description="Manage your programming languages and frameworks."
                icon={<Code2 className="w-6 h-6 text-emerald-500" />}
                className="border-t-4 border-t-emerald-500"
                isCollapsible={true}
                defaultOpen={false}
              >
                <div className="space-y-8">
                  <AdminEntityCollectionEditor
                    title="Languages"
                    description="Programming languages you specialize in."
                    items={languages}
                    collection="languages"
                    createItem={() => ({
                      slug: "new-language",
                      title: "New Language",
                      description: "Short description",
                      icon: "👨‍💻",
                      insights: [],
                      interviewQuestions: [],
                    })}
                    getId={(item) => item.slug}
                    getEditPath={(item) => `/languages/${item.slug}`}
                  />
                  <AdminEntityCollectionEditor
                    title="Frameworks"
                    description="Libraries and frameworks in your toolkit."
                    items={frameworks}
                    collection="frameworks"
                    createItem={() => ({
                      slug: "new-framework",
                      title: "New Framework",
                      description: "Short description",
                      icon: "🚀",
                      insights: [],
                      interviewQuestions: [],
                    })}
                    getId={(item) => item.slug}
                    getEditPath={(item) => `/frameworks/${item.slug}`}
                  />
                </div>
              </AdminCard>

              {/* Projects Management */}
              <AdminCard
                title="Projects Showcase"
                description="Curate the projects featured on your home page."
                icon={<FolderGit2 className="w-6 h-6 text-purple-500" />}
                className="border-t-4 border-t-purple-500"
                isCollapsible={true}
                defaultOpen={false}
              >
                <AdminEntityCollectionEditor
                  title="Featured Projects"
                  description="Manage the main project collection."
                  items={projects}
                  collection="projects"
                  createItem={() => ({
                    id: `project-${Date.now()}`,
                    title: "New Project",
                    description: "Short summary",
                    featured: true,
                    techStack: [],
                    fullDescription: "Detailed overview",
                    challenges: "Challenges and solutions",
                  })}
                  getId={(item) => item.id}
                  getEditPath={(item) => `/projects/${item.id}`}
                />
              </AdminCard>

              {/* Content & Copy Management */}
              <AdminCard
                title="Content & Copy"
                description="Manage the text content for About and Contact sections."
                icon={<LayoutDashboard className="w-6 h-6 text-orange-500" />}
                className="border-t-4 border-t-orange-500"
                isCollapsible={true}
                defaultOpen={false}
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <LazyPageAdminEditor
                    title="Features Cards"
                    description="Edit the technical expertise cards."
                    payload={JSON.stringify(home.features, null, 2)}
                    intent="save-content-section"
                    section="home"
                  />
                  <LazyPageAdminEditor
                    title="About Text"
                    description="Edit the summary paragraphs."
                    payload={JSON.stringify(about, null, 2)}
                    intent="save-content-section"
                    section="about"
                  />
                  <LazyPageAdminEditor
                    title="Contact Info"
                    description="Edit contact intro and links."
                    payload={JSON.stringify(contact, null, 2)}
                    intent="save-content-section"
                    section="contact"
                  />
                </div>
              </AdminCard>

              {/* Advanced Translation Management */}
              <AdminCard
                title="Internationalization (i18n)"
                description="Edit global translation keys for English and Arabic."
                icon={<Globe className="w-6 h-6 text-cyan-500" />}
                className="border-t-4 border-t-cyan-500"
                isCollapsible={true}
                defaultOpen={false}
              >
                <LazyPageAdminEditor
                  title="Home Page Translations"
                  description="Edit text keys for UI components."
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
              </AdminCard>
            </Suspense>
          </div>
        </AdminSectionWrapper>
      )}
    </>
  );
};
