import { QueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: 60 * 1000, // 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new instance per request to avoid sharing state
    return makeQueryClient();
  }
  // Browser: reuse a singleton so cache persists across client navigations/remounts
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
