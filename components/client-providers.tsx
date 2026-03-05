"use client";

import { ReactNode } from "react";
import { ConnectionProvider } from "@/contexts/connection-context";
import { DevModeProvider } from "@/contexts/dev-mode-context";
import { DevModeToggle } from "./dev-mode-toggle";
import { DevModeOverlay } from "./dev-mode-overlay";
import { Toaster } from "@/components/ui/sonner";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ConnectionProvider>
      <DevModeProvider>
        {children}
        <Toaster />
        <DevModeToggle />
        <DevModeOverlay />
      </DevModeProvider>
    </ConnectionProvider>
  );
}
