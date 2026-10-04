import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "../../lib/admin-auth.server";
import { readSiteContent, writeSiteContent, type ContentLocale } from "../../lib/content.server";
import { readAllLocales, writeLocale } from "../../lib/translations.server";
import type { Locale } from "../../i18n/translations";

const parsePayload = (value: FormDataEntryValue | null) =>
  JSON.parse(String(value ?? "null"));

export async function POST(request: Request) {
  const authenticated = await isAuthenticatedAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");
  const localeParam = formData.get("locale");
  const locale: ContentLocale =
    localeParam === "en" || localeParam === "ar" ? localeParam : "en";

  try {
    if (intent === "save-content-section") {
      const section = String(formData.get("section") ?? "");
      const payload = parsePayload(formData.get("payload"));
      const content = await readSiteContent(locale);

      if (section === "home" || section === "about" || section === "contact") {
        await writeSiteContent({ ...content, [section]: payload }, locale);
        return NextResponse.json({ success: `${section} content updated for ${locale}.` });
      }
    }

    if (intent === "save-collection") {
      const collection = String(formData.get("collection") ?? "");
      const payload = parsePayload(formData.get("payload"));
      const content = await readSiteContent(locale);

      if (
        collection === "projects" ||
        collection === "languages" ||
        collection === "frameworks" ||
        collection === "projectCategories"
      ) {
        await writeSiteContent({ ...content, [collection]: payload }, locale);
        return NextResponse.json({ success: `${collection} updated for ${locale}.` });
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
        return NextResponse.json({ success: `Project updated for ${locale}.` });
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
        return NextResponse.json({ success: `Language updated for ${locale}.` });
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
        return NextResponse.json({ success: `Framework updated for ${locale}.` });
      }
    }

    if (intent === "save-entity-field") {
      const collection = String(formData.get("collection") ?? "");
      const itemId = String(formData.get("itemId") ?? "");
      const field = String(formData.get("field") ?? "");
      const value = String(formData.get("value") ?? "");
      const content = await readSiteContent(locale);

      if (field !== "roadmapUrl") {
        return NextResponse.json({ error: "Unsupported entity field." }, { status: 400 });
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
        return NextResponse.json({ success: `Language ${field} updated for ${locale}.` });
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
        return NextResponse.json({ success: `Framework ${field} updated for ${locale}.` });
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

        return NextResponse.json({
          success: `${section} ${translationLocale} translations updated.`,
        });
      }

      for (const loc of ["en", "ar"] as const) {
        await writeLocale(loc, {
          ...locales[loc],
          [section]: payload[loc],
        });
      }

      return NextResponse.json({ success: `${section} translations updated.` });
    }

    return NextResponse.json({ error: "Unknown admin save action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid payload" },
      { status: 400 },
    );
  }
}
