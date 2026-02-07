"use client";

import { useEffect, useRef, RefObject } from "react";

interface UseAutoScrollOptions {
  enabled?: boolean;
  dependencies?: unknown[];
  behavior?: ScrollBehavior;
  offset?: number;
  threshold?: number;
}

export function useAutoScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseAutoScrollOptions = {},
): RefObject<T> {
  const {
    enabled = true,
    dependencies = [],
    behavior = "smooth",
    offset = 0,
    threshold = 150,
  } = options;

  const containerRef = useRef<T | null>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    // Track user scroll to detect manual scrolling
    const handleScroll = () => {
      isUserScrollingRef.current = true;
      clearTimeout(scrollTimeoutRef.current as NodeJS.Timeout);
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1000);
    };

    container.addEventListener("scroll", handleScroll);

    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      if (!container) return;

      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight;

      // Only scroll if we're near the bottom (within threshold)
      // This prevents scrolling if user has scrolled up to read old messages
      const currentScrollTop = container.scrollTop;
      const distanceFromBottom = maxScrollTop - currentScrollTop;
      const isNearBottom = distanceFromBottom < threshold;

      // Always scroll if it's a new message (not user scrolling)
      // Or if user is already near bottom
      if (!isUserScrollingRef.current || isNearBottom) {
        container.scrollTo({
          top: scrollHeight - clientHeight + offset,
          behavior,
        });
      }
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeoutRef.current as NodeJS.Timeout);
    };
  }, [enabled, behavior, offset, threshold, ...dependencies]);

  return containerRef as RefObject<T>;
}

/**
 * Hook specifically for chat interfaces that scrolls only when the user sends a message.
 * Does not scroll when the model responds (new or streaming).
 */
export function useChatAutoScroll(
  messages: unknown[],
  options: Omit<UseAutoScrollOptions, "dependencies"> = {},
) {
  const lastMessage = messages[messages.length - 1];
  const lastIsUser =
    lastMessage &&
    typeof lastMessage === "object" &&
    "role" in lastMessage &&
    lastMessage.role === "user";
  // When user sends, the UI adds user + model placeholder in one update, so last is model "Thinking..."
  const lastIsPlaceholder =
    lastMessage &&
    typeof lastMessage === "object" &&
    "role" in lastMessage &&
    lastMessage.role === "model" &&
    "content" in lastMessage &&
    String(lastMessage.content) === "Thinking...";

  const shouldScroll =
    (options.enabled ?? true) && (!!lastIsUser || !!lastIsPlaceholder);

  return useAutoScroll({
    ...options,
    enabled: shouldScroll,
    dependencies: [messages.length, lastIsUser, lastIsPlaceholder],
  });
}
