import { useRef, useCallback } from "react";

/**
 * Returns a memoized function that will only call the passed function when it hasn't been called for the wait period
 * @param func The function to be called
 * @param wait Wait period after function hasn't been called for
 * @returns A memoized function that is debounced
 */
export function useDebouncedCallback<
  T extends (...args: Parameters<T>) => void
>(func: T, wait: number): (...args: Parameters<T>) => void {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      timeout.current = setTimeout(() => {
        func(...args);
      }, wait);
    },
    [func, wait]
  );
}
