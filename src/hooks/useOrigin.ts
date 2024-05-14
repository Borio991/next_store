import { useEffect, useState } from 'react';

export const useOrigin = () => {
  const [isMounted, setIsMounted] = useState(false);
  /**
   * Returns the origin of the current window, or an empty string if the window is undefined.
   * @returns {string} The origin of the current window, or an empty string if the window is undefined.
   */
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  if (!isMounted) {
    return '';
  }
  const origin = typeof window !== undefined && window?.location?.origin ? window.location.origin : '';
  return origin;
};
