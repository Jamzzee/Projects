import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo.png';

function Logo() {
  return (
    <Link href="/" className="z-10 flex items-center gap-2 sm:gap-4">
      <Image
        src={logo}
        width={48}
        height={48}
        quality={100}
        alt="The Wild Oasis logo"
        className="h-10 w-10 sm:h-12 sm:w-12"
      />

      <span className="whitespace-nowrap text-lg font-semibold text-primary-100 sm:text-xl">
        The Wild Oasis
      </span>
    </Link>
  );
}

export default Logo;
