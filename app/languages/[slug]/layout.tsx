'use client';

import { LanguageDetail } from '../../pages/LanguageDetail';

export default function LanguageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageDetail>{children}</LanguageDetail>;
}
