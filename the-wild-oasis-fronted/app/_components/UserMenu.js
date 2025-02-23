'use client';

import Image from 'next/image';
import Link from 'next/link';

function UserMenu({ session }) {
  return (
    <>
      {session?.user?.image ? (
        <Link
          href="/account"
          className="hover:text-accent-400 transition-colors flex item-center gap-4"
        >
          <Image
            className="h-6 rounded-full"
            width={24}
            height={24}
            src={session.user.image}
            alt={session.user.name}
            referrerPolicy="no-referrer"
          />
          <span>Welcome, {session.user.name.split(' ')[0]}</span>
        </Link>
      ) : (
        <Link
          href="/account"
          className="hover:text-accent-400 transition-colors"
        >
          Guest area
        </Link>
      )}
    </>
  );
}

export default UserMenu;
