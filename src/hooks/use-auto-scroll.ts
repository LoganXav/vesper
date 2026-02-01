"use client";

import { useEffect, useRef, RefObject } from "react";

interface UseAutoScrollOptions {
  /**
   * Whether auto-scroll is enabled
   */
  enabled?: boolean;
  /**
   * Dependencies that trigger scroll when they change
   */
  dependencies?: unknown[];
  /**
   * Behavior for scrolling - 'smooth' or 'instant'
   */
  behavior?: ScrollBehavior;
  /**
   * Offset from bottom (in pixels) to maintain when scrolling
   */
  offset?: number;
  /**
   * Threshold in pixels - only auto-scroll if user is within this distance from bottom
   */
  threshold?: number;
}

/**
 * Hook to automatically scroll a container to the bottom when dependencies change
 * Useful for chat interfaces, logs, etc.
 */
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
 * Hook specifically for chat interfaces that scrolls on new messages
 * Optimized for streaming responses - uses instant scroll for content updates
 */
export function useChatAutoScroll(
  messages: unknown[],
  options: Omit<UseAutoScrollOptions, "dependencies"> = {},
) {
  const lastMessageCountRef = useRef(0);
  const lastContentRef = useRef<string>("");

  // Get the last message content for comparison
  const lastMessage = messages[messages.length - 1];
  const lastContent =
    lastMessage && typeof lastMessage === "object" && "content" in lastMessage
      ? String(lastMessage.content)
      : "";

  // Detect if it's a new message or content update to existing message
  const isNewMessage = messages.length > lastMessageCountRef.current;
  const isContentUpdate =
    messages.length === lastMessageCountRef.current &&
    lastContent !== lastContentRef.current &&
    lastContent.length > lastContentRef.current.length;

  useEffect(() => {
    lastMessageCountRef.current = messages.length;
    lastContentRef.current = lastContent;
  }, [messages, lastContent]);

  return useAutoScroll({
    ...options,
    // Use instant scroll for streaming updates (content growing), smooth for new messages
    behavior:
      isContentUpdate && !isNewMessage
        ? "instant"
        : options.behavior || "smooth",
    dependencies: [messages.length, lastContent],
  });
}
