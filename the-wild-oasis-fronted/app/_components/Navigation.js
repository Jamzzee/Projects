import Link from 'next/link';
import { auth } from '../_lib/auth';
import UserMenu from './UserMenu';

export default async function Navigation() {
  const session = await auth();

  return (
    <nav className="z-10">
      <ul className="flex items-center gap-4 text-sm sm:gap-8 sm:text-base md:gap-12 md:text-xl">
        <li>
          <Link href="/cabins" className="transition-colors hover:text-accent-400">
            Cabins
          </Link>
        </li>

        <li>
          <Link href="/about" className="transition-colors hover:text-accent-400">
            About
          </Link>
        </li>

        <li>
          <UserMenu session={session} />
        </li>
      </ul>
    </nav>
  );
}
