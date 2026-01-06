import Link from 'next/link';
import Image from 'next/image';
import bg from '@/public/bg.png';

export default function Page() {
  return (
    <main className="mt-24">
      {/* <Image
        src={bg}
        fill
        priority
        sizes="100vw"
        quality={70}
        placeholder="empty"
        className="object-cover object-top"
        alt="Mountains and forests with two cabins"
      /> */}
      <div className="absolute inset-0 bg-[url('/bg.png')] bg-cover bg-top" aria-hidden />

      <div className="relative z-10 text-center">
        <h1 className="mb-6 text-4xl font-normal tracking-tight text-primary-50 sm:mb-8 sm:text-5xl md:mb-10 md:text-6xl lg:text-7xl xl:text-8xl">
          Welcome to paradise.
        </h1>
        <Link
          href="/cabins"
          className="mx-auto inline-block rounded-md bg-accent-500 px-5 py-3 text-base font-semibold text-primary-800 transition-all hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:ring-offset-2 active:bg-accent-700 sm:px-6 sm:py-4 sm:text-lg md:px-8 md:py-6 lg:mx-0 lg:hover:-translate-y-0.5 lg:hover:shadow-lg"
        >
          Explore luxury cabins
        </Link>
      </div>
    </main>
  );
}
