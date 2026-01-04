import Navigation from '@/app/_components/Navigation';
import Logo from '@/app/_components/Logo';
import MobileMenu from './MobileMenu';
import { auth } from '../_lib/auth';

async function Header() {
  const session = await auth();
  return (
    <header className="border-b border-primary-900 px-8 py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Logo />

        <div className="hidden sm:flex">
          <Navigation />
        </div>

        <MobileMenu session={session} />
      </div>
    </header>
  );
}

export default Header;
