// import { EyeSlashIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/solid';
// import Image from 'next/image';
// import TextExpander from './TextExpander';

// function Cabin({ cabin }) {
//   const { name, maxCapacity, image, description } = cabin;
//   return (
//     <div className="grid grid-cols-[3fr_4fr] gap-20 border border-primary-800 py-3 px-10 mb-24">
//       <div className="relative scale-[1.15] -translate-x-3">
//         <Image
//           fill
//           className="object-cover"
//           src={image}
//           alt={`Cabin ${name}`}
//         />
//       </div>

//       <div>
//         <h3 className="text-accent-100 font-black text-7xl mb-5 translate-x-[-254px] bg-primary-950 p-6 pb-1 w-[150%]">
//           Cabin {name}
//         </h3>

//         <p className="text-lg text-primary-300 mb-10">
//           <TextExpander>{description}</TextExpander>
//         </p>

//         <ul className="flex flex-col gap-4 mb-7">
//           <li className="flex gap-3 items-center">
//             <UsersIcon className="h-5 w-5 text-primary-600" />
//             <span className="text-lg">
//               For up to <span className="font-bold">{maxCapacity}</span> guests
//             </span>
//           </li>
//           <li className="flex gap-3 items-center">
//             <MapPinIcon className="h-5 w-5 text-primary-600" />
//             <span className="text-lg">
//               Located in the heart of the{' '}
//               <span className="font-bold">Dolomites</span> (Italy)
//             </span>
//           </li>
//           <li className="flex gap-3 items-center">
//             <EyeSlashIcon className="h-5 w-5 text-primary-600" />
//             <span className="text-lg">
//               Privacy <span className="font-bold">100%</span> guaranteed
//             </span>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Cabin;

import { EyeSlashIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import TextExpander from './TextExpander';

function Cabin({ cabin }) {
  const { name, maxCapacity, image, description } = cabin;

  return (
    <div className="mb-12 flex flex-col gap-6 border border-primary-800 p-6 md:grid md:grid-cols-[3fr_4fr] md:gap-20">
      {/* Image */}
      <div className="relative h-64 w-full md:h-auto md:-translate-x-3 md:scale-[1.15]">
        <Image
          src={image}
          alt={`Cabin ${name}`}
          fill
          className="rounded-lg object-cover"
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col">
        <h3 className="mb-5 rounded-md bg-primary-950 p-4 text-3xl font-black text-accent-100 md:p-6 md:text-7xl">
          Cabin {name}
        </h3>

        <p className="mb-6 text-base text-primary-300 md:text-lg">
          <TextExpander>{description}</TextExpander>
        </p>

        <ul className="flex flex-col gap-3 md:gap-4">
          <li className="flex items-center gap-2 md:gap-3">
            <UsersIcon className="h-5 w-5 text-primary-600" />
            <span className="text-sm md:text-lg">
              For up to <span className="font-bold">{maxCapacity}</span> guests
            </span>
          </li>
          <li className="flex items-center gap-2 md:gap-3">
            <MapPinIcon className="h-5 w-5 text-primary-600" />
            <span className="text-sm md:text-lg">
              Located in the heart of the <span className="font-bold">Dolomites</span>{' '}
              (Italy)
            </span>
          </li>
          <li className="flex items-center gap-2 md:gap-3">
            <EyeSlashIcon className="h-5 w-5 text-primary-600" />
            <span className="text-sm md:text-lg">
              Privacy <span className="font-bold">100%</span> guaranteed
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Cabin;
