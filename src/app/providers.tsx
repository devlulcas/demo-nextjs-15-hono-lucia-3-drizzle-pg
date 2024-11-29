'use client';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';
import type * as React from 'react';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: sempre crie um novo query client
    return makeQueryClient();
  } else {
    /**
     * Browser: crie um novo query client se não tivermos um ainda
     * Isso é muito importate, dessa forma não fazemos um novo client
     * se o react suspender ruante o render inicial. Isso talvez não seja necessário
     * se tivermos uma suspense boundary abaixo da criação do query client
     */
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
    </QueryClientProvider>
  );
}
