"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
interface SiteProps {
  children: React.ReactNode;
}

export const QueryClientContextProvider = ({ children }: SiteProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Prevent refetch on window focus globally
        staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes globally
        retry: false,
      },
    },
  });

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
};

export default QueryClientContextProvider;
