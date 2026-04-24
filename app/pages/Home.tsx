import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { PageAdminEditor } from "../components/admin/PageAdminEditor";
import { Section } from "../components/Section";
import { useAdminSession } from "../hooks/useAdminSession";
import { useSiteContent } from "../hooks/useSiteContent";
import { useRouteLoaderData } from "react-router";
import { useTranslation } from "../i18n/useTranslation";
import type { loader as rootLoader } from "../root";
import { useFetcher } from "react-router";

const avatarSizeClasses: Record<number, string> = {
  96: "w-24 h-24",
  112: "w-28 h-28",
  128: "w-32 h-32",
  144: "w-36 h-36",
  160: "w-40 h-40",
  176: "w-44 h-44",
  192: "w-48 h-48",
  208: "w-52 h-52",
  224: "w-56 h-56",
  240: "w-60 h-60",
};

const avatarTextSizeClasses: Record<number, string> = {
  96: "text-3xl",
  112: "text-4xl",
  128: "text-5xl",
  144: "text-5xl",
  160: "text-6xl",
  176: "text-6xl",
  192: "text-6xl",
  208: "text-7xl",
  224: "text-7xl",
  240: "text-7xl",
};

const avatarSizeOptions = [96, 112, 128, 144, 160, 176, 192, 208, 224, 240];

const isImageLike = (value: string) =>
  /^https?:\/\//.test(value) || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(value);

export const Home = () => {
  const { t, lang } = useTranslation();
  const { home } = useSiteContent();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const fetcher = useFetcher<{ success?: string; error?: string }>();
  const [avatarValue, setAvatarValue] = useState(home.avatar);
  const [avatarSize, setAvatarSize] = useState(String(home.avatarSize ?? 128));
  const selectedAvatarSize = Number(avatarSize) || 128;
  const avatarContainerSizeClass =
    avatarSizeClasses[selectedAvatarSize] ?? avatarSizeClasses[128];
  const avatarTextSizeClass =
    avatarTextSizeClasses[selectedAvatarSize] ?? avatarTextSizeClasses[128];

  useEffect(() => {
    setAvatarValue(home.avatar);
    setAvatarSize(String(home.avatarSize ?? 128));
  }, [home.avatar, home.avatarSize]);

  if (!rootData) {
    throw new Error("Root data is not available.");
  }

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: home.name,
    jobTitle: "Frontend Web Developer",
    description:
      "Ahmed Magdy is a Frontend Web Developer and Software Engineer in Egypt building modern, high-performance web applications with React, TypeScript, and Next.js.",
    url: `${rootData.siteUrl}/`,
    sameAs: [
      "https://github.com/Ahmed-Magdy28",
      "https://linkedin.com/in/ahmedmagdy2849",
    ],
    knowsAbout: [
      "Frontend Development",
      "Software Engineering",
      "React",
      "TypeScript",
      "Next.js",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "EG",
    },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>

      <Section className="min-h-[calc(100vh-4rem)] flex items-center">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`mx-auto mb-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden text-white ${avatarContainerSizeClass}`}
            >
              {isImageLike(home.avatar) ? (
                <img
                  src={home.avatar}
                  alt={home.name}
                  className={`rounded-full object-cover ${avatarContainerSizeClass}`}
                />
              ) : (
                <span
                  className={`flex items-center justify-center ${avatarTextSizeClass}`}
                >
                  {home.avatar}
                </span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl mb-4"
            >
              {home.name}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl lg:text-4xl mb-6 text-gray-600 dark:text-gray-400"
            >
              {t.home.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            >
              {t.home.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button to="/projects" variant="primary" size="lg">
                {t.home.viewProjects}
              </Button>
              <Button to="/contact" variant="outline" size="lg">
                {t.home.contactMe}
              </Button>
              <Button href={home.cvUrl} external variant="secondary" size="lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {t.home.downloadCV}
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {home.features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div className="mb-4 flex justify-center">
                  {isImageLike(item.icon) ? (
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{item.icon}</span>
                  )}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {isAdminAuthenticated ? (
            <div className="mx-auto mt-12 max-w-4xl space-y-4">
              <fetcher.Form
                method="post"
                action="/__admin/save"
                className="rounded-2xl border border-blue-300/70 bg-blue-50/70 p-5 dark:border-blue-900 dark:bg-blue-950/20"
              >
                <input
                  type="hidden"
                  name="intent"
                  value="save-content-section"
                />
                <input type="hidden" name="section" value="home" />
                <input type="hidden" name="locale" value={lang} />
                <input
                  type="hidden"
                  name="payload"
                  value={JSON.stringify(
                    {
                      ...home,
                      avatar: avatarValue,
                      avatarSize: Number(avatarSize) || 128,
                    },
                    null,
                    2,
                  )}
                />

                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
                      Admin Editor
                    </div>
                    <h3 className="mt-1 text-lg font-semibold">Home avatar</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Change the avatar emoji or image and control its display
                      size.
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
                    disabled={fetcher.state !== "idle"}
                  >
                    {fetcher.state === "submitting"
                      ? "Saving..."
                      : "Save avatar"}
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <div className="mb-2 text-sm font-medium">Avatar</div>
                    <input
                      value={avatarValue}
                      onChange={(event) => setAvatarValue(event.target.value)}
                      placeholder="👨‍💻 or https://example.com/avatar.png"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </label>
                  <label className="block">
                    <div className="mb-2 text-sm font-medium">
                      Avatar size (px)
                    </div>
                    <select
                      value={avatarSize}
                      onChange={(event) => setAvatarSize(event.target.value)}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
                    >
                      {avatarSizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}px
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </fetcher.Form>

              <PageAdminEditor
                title="Home page content"
                description="Edit the name, avatar, CV link, and feature cards shown on the home page."
                payload={JSON.stringify(home, null, 2)}
                intent="save-content-section"
                section="home"
              />
              <PageAdminEditor
                title="Home translations"
                description="Edit the translation keys used on the home page for both English and Arabic."
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
          ) : null}
        </div>
      </Section>
    </>
  );
};
