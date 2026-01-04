'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import UserMenu from './UserMenu';

export default function MobileMenu({ session }) {
  const [open, setOpen] = useState(false);

  const linkClasses = 'transition-colors hover:text-accent-400';

  return (
    <div className="relative z-50 sm:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="p-2 text-primary-100"
      >
        {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {/* Slide-out menu */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-64 bg-primary-900 p-6 shadow-lg transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex cursor-pointer flex-col gap-4 text-lg text-primary-50">
          <Link href="/cabins" className={linkClasses} onClick={() => setOpen(false)}>
            Cabins
          </Link>
          <Link href="/about" className={linkClasses} onClick={() => setOpen(false)}>
            About
          </Link>
          <UserMenu session={session} onClick={() => setOpen(false)} />
        </nav>
      </div>

      {/* Background overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
      )}
    </div>
  );
}
