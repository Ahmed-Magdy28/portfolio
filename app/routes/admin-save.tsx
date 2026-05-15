import { requireAdmin } from "../lib/admin-auth.server";
import { readSiteContent, writeSiteContent } from "../lib/content.server";
import { readAllLocales, writeLocale } from "../lib/translations.server";
import type { Locale } from "../i18n/translations";

const parsePayload = (value: FormDataEntryValue | null) =>
  JSON.parse(String(value ?? "null"));

export async function action({ request }: { request: Request }) {
  await requireAdmin(request);

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const localeParam = formData.get("locale");
  const locale =
    localeParam === "en" || localeParam === "ar" ? localeParam : "en";

  try {
    if (intent === "save-content-section") {
      const section = String(formData.get("section") ?? "");
      const payload = parsePayload(formData.get("payload"));
      const content = await readSiteContent(locale);

      if (section === "home" || section === "about" || section === "contact") {
        await writeSiteContent({ ...content, [section]: payload }, locale);
        return { success: `${section} content updated for ${locale}.` };
      }
    }

    if (intent === "save-collection") {
      const collection = String(formData.get("collection") ?? "");
      const payload = parsePayload(formData.get("payload"));
      const content = await readSiteContent(locale);

      if (
        collection === "projects" ||
        collection === "languages" ||
        collection === "frameworks"
      ) {
        await writeSiteContent({ ...content, [collection]: payload }, locale);
        return { success: `${collection} updated for ${locale}.` };
      }
    }

    if (intent === "save-entity") {
      const collection = String(formData.get("collection") ?? "");
      const itemId = String(formData.get("itemId") ?? "");
      const payload = parsePayload(formData.get("payload"));
      const content = await readSiteContent(locale);

      if (collection === "projects") {
        await writeSiteContent(
          {
            ...content,
            projects: content.projects.map((item) =>
              item.id === itemId ? payload : item,
            ),
          },
          locale,
        );
        return { success: `Project updated for ${locale}.` };
      }

      if (collection === "languages") {
        await writeSiteContent(
          {
            ...content,
            languages: content.languages.map((item) =>
              item.slug === itemId ? payload : item,
            ),
          },
          locale,
        );
        return { success: `Language updated for ${locale}.` };
      }

      if (collection === "frameworks") {
        await writeSiteContent(
          {
            ...content,
            frameworks: content.frameworks.map((item) =>
              item.slug === itemId ? payload : item,
            ),
          },
          locale,
        );
        return { success: `Framework updated for ${locale}.` };
      }
    }

    if (intent === "save-entity-field") {
      const collection = String(formData.get("collection") ?? "");
      const itemId = String(formData.get("itemId") ?? "");
      const field = String(formData.get("field") ?? "");
      const value = String(formData.get("value") ?? "");
      const content = await readSiteContent(locale);

      if (field !== "roadmapUrl") {
        return { error: "Unsupported entity field." };
      }

      if (collection === "languages") {
        await writeSiteContent(
          {
            ...content,
            languages: content.languages.map((item) =>
              item.slug === itemId
                ? { ...item, [field]: value.trim() || undefined }
                : item,
            ),
          },
          locale,
        );
        return { success: `Language ${field} updated for ${locale}.` };
      }

      if (collection === "frameworks") {
        await writeSiteContent(
          {
            ...content,
            frameworks: content.frameworks.map((item) =>
              item.slug === itemId
                ? { ...item, [field]: value.trim() || undefined }
                : item,
            ),
          },
          locale,
        );
        return { success: `Framework ${field} updated for ${locale}.` };
      }
    }

    if (intent === "save-translation-section") {
      const section = String(formData.get("section") ?? "");
      const localeParam = formData.get("locale");
      const translationLocale =
        localeParam === "en" || localeParam === "ar" ? localeParam : undefined;
      const payload = parsePayload(formData.get("payload")) as Record<
        Locale,
        unknown
      >;
      const locales = await readAllLocales();

      if (translationLocale) {
        await writeLocale(translationLocale, {
          ...locales[translationLocale],
          [section]: payload[translationLocale],
        });

        return {
          success: `${section} ${translationLocale} translations updated.`,
        };
      }

      for (const locale of ["en", "ar"] as const) {
        await writeLocale(locale, {
          ...locales[locale],
          [section]: payload[locale],
        });
      }

      return { success: `${section} translations updated.` };
    }

    return { error: "Unknown admin save action." };
  } catch {
    return { error: "Invalid JSON. Please fix the payload and try again." };
  }
}
