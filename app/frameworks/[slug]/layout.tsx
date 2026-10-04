'use client';

import { FrameworkDetail } from '../../pages/FrameworkDetail';

export default function FrameworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FrameworkDetail>{children}</FrameworkDetail>;
}
