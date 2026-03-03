"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Users } from "lucide-react";
import { ProviderLogo } from "./provider-logos";
import { motion } from "framer-motion";
import Link from "next/link";

interface ProviderCardProps {
  id: string;
  name: string;
  desc: string;
  color: string;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
  manageHref?: string;
  native?: boolean;
}

export function ProviderCard({
  id,
  name,
  desc,
  color,
  isConnected,
  onConnect,
  onDisconnect,
  manageHref,
  native,
}: ProviderCardProps) {
  const logoKey = id as any;

  return (
    <motion.div
      whileHover={{ y: isConnected ? 0 : -1 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={`px-5 py-4 rounded-xl group relative cursor-pointer transition-all duration-200 h-full ${
          isConnected
            ? "border-[var(--success)]/20"
            : "hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-blue-200"
        }`}
        onClick={!isConnected ? onConnect : undefined}
      >
        {/* Top gradient bar for connected cards */}
        {isConnected && (
          <div
            className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
            style={{
              background: `linear-gradient(to right, ${color}, var(--success))`,
            }}
          />
        )}

        <div className="flex flex-col h-full items-start">
          <div className="flex flex-row items-start gap-3.5 w-full">
            <ProviderLogo provider={logoKey} className="w-11 h-11 flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
                  {name}
                </h3>
                {isConnected && (
                  <Badge
                    variant="outline"
                    className="text-[var(--success)] bg-[var(--success-light)] border-[var(--success)]/30 text-[10px] px-1.5 py-0"
                  >
                    Connected
                  </Badge>
                )}
                {native && (
                  <Badge
                    variant="outline"
                    className="text-blue-600 bg-blue-50 border-blue-200 text-[10px] px-1.5 py-0"
                  >
                    Native
                  </Badge>
                )}
              </div>
              <p className="text-[13px] text-[var(--text-muted)] leading-relaxed">
                {desc}
              </p>
            </div>

            {/* Connect arrow for disconnected cards on hover */}
            {!isConnected && (
              <div className="text-sm font-medium text-[#0066FF] opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-4 right-5">
                Connect →
              </div>
            )}

            {/* Disconnect button for connected cards on hover */}
            {isConnected && onDisconnect && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDisconnect();
                }}
                className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-4 right-5"
              >
                Disconnect
              </button>
            )}
          </div>

          {/* Footer for connected cards */}
          {isConnected && manageHref && (
            <div className="w-full pt-3 mt-3 border-t border-gray-100 flex items-center text-[13px] text-[var(--text-muted)]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Synced 2m ago
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  9 users
                </span>
              </div>
              <Link
                href={manageHref}
                className="ml-auto text-[#0066FF] text-xs font-semibold px-3 py-1.5 rounded-lg bg-[rgba(0,102,255,0.06)] hover:bg-[rgba(0,102,255,0.12)] transition-all duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                Manage
              </Link>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
