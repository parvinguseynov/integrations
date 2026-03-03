"use client";

import { ChevronLeft, Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function TopBar() {
  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-white border-b border-[var(--border)] flex items-center justify-between px-6 z-10">
      <Link href="/" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </Link>

      <div className="flex items-center gap-4">
        <Button className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white">
          <Plus className="w-4 h-4 mr-1.5" />
          Invite
        </Button>

        <button className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7C3AED] flex items-center justify-center text-white font-semibold text-sm">
            PH
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-[var(--text-primary)]">Parvin Huseynov</div>
            <div className="text-xs text-[var(--text-secondary)]">Owner</div>
          </div>
        </button>
      </div>
    </header>
  );
}
