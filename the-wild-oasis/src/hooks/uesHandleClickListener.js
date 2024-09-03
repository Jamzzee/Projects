import { useEffect, useRef } from 'react';

export function useHandleClick(fn, listenCapturring = true) {
  const ref = useRef();
  useEffect(
    function () {
      function handleClick(event) {
        if (ref.current && !ref.current.contains(event.target)) fn();
      }
      document.addEventListener('click', handleClick, listenCapturring);

      return () =>
        document.removeEventListener('click', handleClick, listenCapturring);
    },
    [fn, listenCapturring]
  );

  return { ref };
}
