import Cabin from '@/app/_components/Cabin';
import Reservation from '@/app/_components/Reservation';
import Spinner from '@/app/_components/Spinner';
import { getCabin, getCabins } from '@/app/_lib/data-service';
import { Suspense } from 'react';

//* Dynamic metadata
export async function generateMetadata({ params }) {
  const { name } = await getCabin(params.cabinId);
  return {
    title: `Cabin ${name}`,
  };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  const cabinId = cabins.map((cab) => ({
    cabinId: String(cab.id),
  }));

  return cabinId;
}

export default async function Page({ params }) {
  const cabin = await getCabin(params.cabinId);

  return (
    <div className="mx-auto max-w-6xl sm:mt-4 md:mt-6 lg:mt-8">
      <Cabin cabin={cabin} />

      <div className="text-center">
        <h2 className="mb-6 text-3xl font-semibold text-accent-400 sm:mb-8 sm:text-4xl md:text-5xl">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
