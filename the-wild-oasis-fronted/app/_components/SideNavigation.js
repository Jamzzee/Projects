'use client';

import { CalendarDaysIcon, HomeIcon, UserIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignOutButton from './SignOutButton';

const navLinks = [
  {
    name: 'Home',
    href: '/account',
    icon: <HomeIcon className="h-5 w-5 shrink-0 text-primary-600" />,
  },
  {
    name: 'Reservations',
    href: '/account/reservations',
    icon: <CalendarDaysIcon className="h-5 w-5 shrink-0 text-primary-600" />,
  },
  {
    name: 'Guest profile',
    href: '/account/profile',
    icon: <UserIcon className="h-5 w-5 shrink-0 text-primary-600" />,
  },
];

export default function SideNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-primary-900 sm:mb-4 md:mb-6 lg:border-b-0 lg:border-r">
      <ul className="flex flex-nowrap items-center gap-1 overflow-x-auto px-2 py-2 lg:h-full lg:flex-col lg:items-stretch lg:gap-2 lg:px-0 lg:py-4">
        {navLinks.map((link) => (
          <li key={link.name} className="shrink-0">
            <Link
              href={link.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-primary-200 transition-colors hover:bg-primary-900 hover:text-primary-100 sm:px-4 lg:px-5 lg:py-3 lg:text-lg ${pathname === link.href ? 'bg-primary-900' : ''} `}
            >
              {link.icon}

              {/* hide text on very small screens */}
              <span className="hidden whitespace-nowrap sm:inline">{link.name}</span>
            </Link>
          </li>
        ))}

        {/* Sign out */}
        <li className="ml-auto shrink-0 lg:ml-0 lg:mt-auto">
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
}
