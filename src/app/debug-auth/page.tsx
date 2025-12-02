"use client";

import { trpc } from "@/src/lib/trpc";

export default function DebugAuthPage() {
  const { data, isLoading, error } = trpc.auth.health.useQuery();

  if (isLoading) return <div>Loading auth health...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Auth health: {data?.status}</div>;
}
