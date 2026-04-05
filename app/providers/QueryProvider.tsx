// providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Configure query client with optimal settings for mobile
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache & Stale Time
      staleTime: 5 * 60 * 1000, // 5 minutes - data becomes "stale"
      gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time

      // Refetch behavior (conservative for mobile)
      refetchOnMount: false, // Don't refetch when component mounts
      refetchOnReconnect: false, // Don't refetch on reconnect (saves bandwidth)
      refetchOnWindowFocus: false, // Don't refetch when app comes to foreground

      // Retry logic
      retry: 2, // Retry failed queries twice
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Performance
      networkMode: "online", // Only run queries when online
      enabled: true,
    },
    mutations: {
      retry: 1,
      networkMode: "online",
    },
  },
});


export default function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
