"use client";

import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <Sidebar />
      <TopBar />
      <main className="ml-60 mt-14 min-h-[calc(100vh-3.5rem)] overflow-y-auto">
        <div className="max-w-[1040px] mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
