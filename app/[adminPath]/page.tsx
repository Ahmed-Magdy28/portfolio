import { notFound } from "next/navigation";
import {
  getAdminRoutePath,
  isAuthenticatedAdmin,
} from "../lib/admin-auth.server";
import {
  readSiteContent,
  readAllSiteContentLocales,
} from "../lib/content.server";
import { readAllLocales } from "../lib/translations.server";
import { AdminView } from "../components/admin/AdminView";

interface AdminPageProps {
  params: Promise<{
    adminPath: string;
  }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { adminPath } = await params;
  const expectedPath = getAdminRoutePath();

  if (adminPath !== expectedPath) {
    notFound();
  }

  const authenticated = await isAuthenticatedAdmin();

  const [siteContent, siteContentLocales, translationLocales] = authenticated
    ? await Promise.all([
        readSiteContent("en"),
        readAllSiteContentLocales(),
        readAllLocales(),
      ])
    : [null, null, null];

  return (
    <AdminView
      adminRoutePath={expectedPath}
      authenticated={authenticated}
      siteContent={siteContent}
      siteContentLocales={siteContentLocales}
      translationLocales={translationLocales}
    />
  );
}
