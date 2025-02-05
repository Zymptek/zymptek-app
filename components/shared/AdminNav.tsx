'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/admin/verifications',
    label: 'Verifications',
  },
  {
    href: '/admin/attributes',
    label: 'Attributes',
  },
  {
    href: '/admin/categories',
    label: 'Categories',
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6 border-b border-border h-[60px] px-6 bg-background">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-brand-100 border-b-2 border-brand-100 h-[60px] flex items-center'
              : 'text-muted-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
} 