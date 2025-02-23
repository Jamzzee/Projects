import Link from 'next/link';
import { auth } from '../_lib/auth';
import UserMenu from './UserMenu';

export default async function Navigation() {
  const session = await auth();

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          <UserMenu session={session} />
          {/* {session?.user?.image ? (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex item-center gap-4"
            >
              <img
                className="h-7 rounded-full"
                src={session.user.image}
                alt={session.user.name}
                referrerPolicy="no-referrer"
              />
              <span>Guest area</span>
            </Link>
          ) : (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors"
            >
              Guest area
            </Link>
          )} */}
        </li>
      </ul>
    </nav>
  );
}
