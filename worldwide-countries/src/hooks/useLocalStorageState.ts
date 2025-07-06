'use client';
import { useState, useEffect } from 'react';

export function useLocalStorageState<T>(
  initialState: T,
  key: string
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initialState);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      try {
        setValue(JSON.parse(storedValue));
      } catch {
        setValue(initialState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
