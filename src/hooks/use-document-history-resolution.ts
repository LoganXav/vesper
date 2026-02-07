import { Session } from "next-auth";
import { useDelayedReady } from "./use-delayed-ready";

interface Args {
  session: Session | null;
  isLoading: boolean;
}

export function useDocumentHistoryResolution({
  session,
  isLoading,
}: Args) {
  const authResolved = session !== undefined;
  const canResolve = authResolved && !isLoading;

  const isReady = useDelayedReady({
    when: canResolve,
    delayMs: 120,
  });

  return {
    isReady,
    isAuthenticated: !!session?.user,
  };
}
