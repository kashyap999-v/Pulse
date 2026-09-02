"use client";

import { useSession } from "@/components/session-provider";
import { useState } from "react";

export function TopBar() {
  const { session } = useSession();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-bg-primary border-b border-border sticky top-0 z-40">
      <div className="px-8 py-4 flex justify-between items-center">
        {/* Left: Breadcrumb / Title */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {session?.business?.name || "Business"}
          </h2>
          <p className="text-xs text-text-secondary">
            Demo Workspace
          </p>
        </div>

        {/* Right: Notifications + User */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 hover:bg-bg-secondary rounded-md transition"
          >
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
              {session?.user?.email?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="text-sm">
              <p className="font-medium text-text-primary">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-text-secondary">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
