import { Session } from "next-auth";
import { useState, useEffect } from "react";
import { useDelayedReady } from "@/hooks/use-delayed-ready";

interface Args {
  session: Session | null | undefined;
  chatId?: string;
  isLoadingChats: boolean;
  chatData: unknown;
  delayMs?: number;
}

export function useChatInterfaceResolution({
  session,
  chatId,
  isLoadingChats,
  chatData,
  delayMs = 120, // delay for fade-in
}: Args) {
  const [resolvedSession, setResolvedSession] =
    useState<Session | null | undefined>(undefined);

  // Freeze session once resolved
  useEffect(() => {
    if (session !== undefined && resolvedSession === undefined) {
      setResolvedSession(session);
    }
  }, [session, resolvedSession]);

  const authResolved = resolvedSession !== undefined;
  const userLoggedIn = !!resolvedSession?.user;

  const chatResolved =
    authResolved &&
    (
      !userLoggedIn || // logged out users don't need chat data
      (!isLoadingChats && !!chatId && chatData !== undefined)
    );

  const isReady = useDelayedReady({ when: chatResolved, delayMs });

  return {
    session: resolvedSession ?? null,
    isReady,
    isAuthenticated: userLoggedIn,
  };
}
