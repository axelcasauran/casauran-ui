'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface CurrentLinkProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly href: string;
}

export function CurrentLink({ children, className, href }: CurrentLinkProps) {
  const pathname = usePathname();
  const current = href === '/' ? pathname === href : pathname.startsWith(href);
  return (
    <Link aria-current={current ? 'page' : undefined} className={className} href={href}>
      {children}
    </Link>
  );
}
