"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProviderLogo } from "./provider-logos";
import { AlertTriangle } from "lucide-react";

interface DisconnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provider?: {
    id: string;
    name: string;
  };
  onConfirm: () => void;
}

export function DisconnectModal({
  open,
  onOpenChange,
  provider,
  onConfirm,
}: DisconnectModalProps) {
  if (!provider) return null;

  const logoKey = provider.id as any;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <ProviderLogo provider={logoKey} className="w-11 h-11" />
            <DialogTitle className="text-lg font-semibold text-center">
              Disconnect {provider.name}?
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)] text-center">
            Synced projects and tasks will be archived. Time already tracked will be preserved.
          </p>
          <p className="text-xs text-[var(--text-muted)] text-center">
            This will affect 9 connected users.
          </p>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className="flex-1"
          >
            Disconnect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
