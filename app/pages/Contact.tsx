import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { motion } from "motion/react";
import { useRouteLoaderData } from "react-router";
import { PageAdminEditor } from "../components/admin/PageAdminEditor";
import { Section } from "../components/Section";
import { Button } from "../components/Button";
import { useAdminSession } from "../hooks/useAdminSession";
import { useSiteContent } from "../hooks/useSiteContent";
import { useTranslation } from "../i18n/useTranslation";
import type { loader as rootLoader } from "../root";

const iconMap = {
  github: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  ),

  linkedin: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),

  email: (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),

  whatsapp: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.52 3.48A11.82 11.82 0 0012.06 0C5.48 0 .13 5.35.13 11.93c0 2.1.55 4.15 1.6 5.97L0 24l6.26-1.63a11.9 11.9 0 005.8 1.48h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.18-1.24-6.16-3.48-8.44zM12.07 21.4a9.42 9.42 0 01-4.8-1.31l-.34-.2-3.71.97.99-3.61-.22-.37a9.4 9.4 0 01-1.44-5.01c0-5.2 4.23-9.43 9.43-9.43 2.52 0 4.88.98 6.66 2.76a9.35 9.35 0 012.77 6.66c0 5.2-4.23 9.43-9.44 9.43zm5.17-7.07c-.28-.14-1.65-.82-1.9-.91-.25-.09-.43-.14-.61.14-.18.28-.7.91-.86 1.1-.16.18-.31.21-.59.07-.28-.14-1.17-.43-2.23-1.36-.82-.73-1.37-1.63-1.53-1.91-.16-.28-.02-.43.12-.57.13-.13.28-.34.43-.52.14-.18.19-.31.28-.52.09-.21.05-.39-.02-.54-.07-.14-.61-1.48-.83-2.03-.22-.53-.44-.46-.61-.47h-.52c-.18 0-.47.07-.72.34-.25.28-.95.93-.95 2.27s.98 2.63 1.12 2.82c.14.18 1.93 2.95 4.67 4.14.65.28 1.16.45 1.56.58.66.21 1.27.18 1.75.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32z" />
    </svg>
  ),

  phone: (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.52l.7 2.8a2 2 0 01-.45 1.92l-1.27 1.27a16 16 0 006.36 6.36l1.27-1.27a2 2 0 011.92-.45l2.8.7A2 2 0 0119 16.72V19a2 2 0 01-2 2h-1C7.16 21 3 16.84 3 12V5z"
      />
    </svg>
  ),

  facebook: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.46h-1.25c-1.23 0-1.62.76-1.62 1.54V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0022 12z" />
    </svg>
  ),
} as const;

export const Contact = () => {
  const { t } = useTranslation();
  const { contact } = useSiteContent();
  const { isAdminAuthenticated } = useAdminSession();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  if (!rootData) {
    throw new Error("Root data is not available.");
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl mb-4">{t.contact.title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          {contact.intro}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6 ">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-gray-900 dark:text-white"
                >
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === "sending"}
                className="w-full"
              >
                {status === "sending" ? t.contact.sending : t.contact.send}
              </Button>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg"
                >
                  {t.contact.success}
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg"
                >
                  {t.contact.error}
                </motion.div>
              )}
            </form>
          </div>

          <div className="space-y-8 self-start">
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                {contact.connectTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {contact.connectText}
              </p>

              <div className="space-y-4">
                {contact.links.map((link) => (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target={link.url.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.url.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
                  >
                    {iconMap[link.icon]}
                    <div className="flex-1">
                      <div className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {link.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {link.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isAdminAuthenticated ? (
          <div className="mt-12 space-y-4">
            <PageAdminEditor
              title="Contact page content"
              description="Edit the intro text, connect block, and contact links shown on this page."
              payload={JSON.stringify(contact, null, 2)}
              intent="save-content-section"
              section="contact"
            />
            <PageAdminEditor
              title="Contact translations"
              description="Edit the translated form labels and messages for the contact page."
              payload={JSON.stringify(
                {
                  en: rootData.translations.en.contact,
                  ar: rootData.translations.ar.contact,
                },
                null,
                2,
              )}
              intent="save-translation-section"
              section="contact"
            />
          </div>
        ) : null}
      </motion.div>
    </Section>
  );
};
