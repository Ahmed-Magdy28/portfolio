'use client';

import NextLink from 'next/link';
import type { ComponentProps } from 'react';

export type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  to?: string;
  href?: string;
};

export const Link = ({ to, href, ...props }: LinkProps) => {
  const target = (to ?? href) || '#';
  return <NextLink href={target} {...props} />;
};

export default Link;
