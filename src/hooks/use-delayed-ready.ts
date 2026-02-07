import { useEffect, useRef, useState } from "react";

interface Args {
  when: boolean;
  delayMs?: number;
}

export function useDelayedReady({
  when,
  delayMs = 120,
}: Args) {
  const [isReady, setIsReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!when) {
      setIsReady(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      setIsReady(true);
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [when, delayMs]);

  return isReady;
}
