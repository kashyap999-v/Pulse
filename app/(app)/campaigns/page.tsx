"use client";

import { useSession } from "@/components/session-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CampaignsPage() {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth/login");
    }
  }, [session, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
        <p className="text-gray-600 mt-2">Create and manage marketing campaigns</p>
      </div>
      <div className="card">
        <p className="text-gray-600">Campaigns module coming soon...</p>
      </div>
    </div>
  );
}
