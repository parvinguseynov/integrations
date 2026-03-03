"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Shield, Lock } from "lucide-react";
import { ProviderLogo } from "./provider-logos";
import { motion, AnimatePresence } from "framer-motion";
import { useConnections } from "@/contexts/connection-context";
import { useRouter } from "next/navigation";

type ModalState = "connecting" | "authorizing" | "success" | "error";

interface OAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider?: {
    id: string;
    name: string;
    category: string;
  };
}

export function OAuthModal({ open, onOpenChange, provider }: OAuthModalProps) {
  const [state, setState] = useState<ModalState>("connecting");
  const { connect } = useConnections();
  const router = useRouter();

  useEffect(() => {
    if (open && provider) {
      setState("connecting");
      // Auto-advance from connecting to authorizing after 2s
      const timer = setTimeout(() => {
        setState("authorizing");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [open, provider]);

  const handleAuthorize = () => {
    setState("success");
    if (provider) {
      connect(provider.category as any, provider.id);
    }
  };

  const handleGoToSettings = () => {
    onOpenChange(false);
    if (provider?.category === "task") {
      router.push("/task-settings");
    } else if (provider?.category === "messaging") {
      router.push("/messaging-settings");
    }
  };

  const handleDone = () => {
    onOpenChange(false);
  };

  const handleTryAgain = () => {
    setState("connecting");
    setTimeout(() => setState("authorizing"), 2000);
  };

  if (!provider) return null;

  const logoKey = provider.id as any;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {state === "connecting" && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 py-6"
            >
              <ProviderLogo provider={logoKey} className="w-14 h-14" />
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Connect {provider.name}</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  You'll be redirected to authorize StaffCo
                </p>
                <Loader2 className="w-8 h-8 mx-auto text-[var(--primary)] animate-spin" />
                <p className="text-sm text-[var(--text-muted)] mt-4">
                  Redirecting to {provider.name}...
                </p>
              </div>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </motion.div>
          )}

          {state === "authorizing" && (
            <motion.div
              key="authorizing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Fake Browser Chrome */}
              <div className="rounded-t-lg bg-slate-100 p-2">
                <div className="flex items-center gap-2 bg-white rounded px-3 py-1.5">
                  <Lock className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-[var(--text-muted)] font-mono">
                    {provider.name.toLowerCase().replace(/\s+/g, "")}.com/oauth/authorize
                  </span>
                </div>
              </div>

              {/* Authorization Content */}
              <div className="p-6 pt-2">
                <div className="flex items-center gap-3 mb-4">
                  <ProviderLogo provider={logoKey} className="w-10 h-10" />
                  <h2 className="text-lg font-semibold">Authorize StaffCo</h2>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  StaffCo would like to:
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2 text-sm">
                    <Shield className="w-4 h-4 text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
                    <span>Read your projects and workspaces</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Shield className="w-4 h-4 text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
                    <span>Read tasks, issues, and assignments</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Shield className="w-4 h-4 text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
                    <span>Read user profiles and email addresses</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                    onClick={handleAuthorize}
                  >
                    Authorize
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <CheckCircle className="w-16 h-16 text-[var(--success)]" />
              </motion.div>
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">
                  {provider.name} Connected!
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Projects and tasks will begin syncing shortly.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                {(provider.category === "task" || provider.category === "messaging") && (
                  <Button
                    className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                    onClick={handleGoToSettings}
                  >
                    Go to Settings
                  </Button>
                )}
                <Button variant="ghost" className="w-full" onClick={handleDone}>
                  Done
                </Button>
              </div>
            </motion.div>
          )}

          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 py-8"
            >
              <XCircle className="w-16 h-16 text-[var(--error)]" />
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Connection Failed</h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Could not connect. Please try again.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                  onClick={handleTryAgain}
                >
                  Try Again
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
