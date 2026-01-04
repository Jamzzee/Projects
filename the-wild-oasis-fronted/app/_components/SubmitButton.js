'use client';
import { useFormStatus } from 'react-dom';

export default function SubmitButton({ pendingLabel, children }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-accent-500 px-4 py-2 text-base font-semibold text-primary-800 transition-all hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300 sm:px-6 sm:py-3 sm:text-lg"
      disabled={pending}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
