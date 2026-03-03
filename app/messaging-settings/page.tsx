"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  Trash2,
  Hash,
  BarChart3,
  AlertTriangle,
  Bell,
  Palmtree,
  Eye,
  Clock,
} from "lucide-react";
import { ProviderLogo } from "@/components/provider-logos";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

const channels = ["#staffco-alerts", "#general", "#engineering", "#management", "#random"];

const notificationTypes = [
  {
    id: "daily-summary",
    icon: BarChart3,
    title: "Daily Team Summary",
    description: "Get a daily recap of team activity and time tracking",
    schedule: "6:00 PM",
    enabled: true,
  },
  {
    id: "overtime",
    icon: AlertTriangle,
    title: "Overtime Alerts",
    description: "Receive notifications when team members exceed standard hours",
    enabled: true,
  },
  {
    id: "tracking-reminders",
    icon: Bell,
    title: "Tracking Reminders",
    description: "Remind team members to start/stop tracking their time",
    enabled: false,
  },
  {
    id: "time-off",
    icon: Palmtree,
    title: "Time-Off Notifications",
    description: "Get notified when team members request or take time off",
    enabled: false,
  },
];

export default function MessagingSettingsPage() {
  const [selectedChannel, setSelectedChannel] = useState("#staffco-alerts");
  const [notifications, setNotifications] = useState(notificationTypes);

  const handleSave = () => {
    toast.success("Settings saved");
  };

  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Integrations
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <ProviderLogo provider="slack" className="w-11 h-11" />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                  Slack Integration
                </h1>
                <Badge className="bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]/30">
                  Connected
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                acme-corp.slack.com · Connected by Parvin Huseynov · Feb 15, 2026
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--error)] hover:text-[var(--error)] hover:bg-[var(--error)]/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>

        {/* Section A: Notification Channel */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-[var(--text-muted)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Notification Channel
            </h2>
          </div>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            {channels.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </select>
        </Card>

        {/* Section B: Notification Types */}
        <Card className="p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">
              Notification Types
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Choose which notifications to send to your Slack channel
            </p>
          </div>

          <div className="space-y-0">
            {notifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <div key={notification.id}>
                  <div className="flex items-start gap-4 py-4">
                    <div className={`p-2 rounded-lg ${notification.enabled ? 'bg-[var(--primary-light)]' : 'bg-gray-100'} transition-colors`}>
                      <Icon className={`w-5 h-5 ${notification.enabled ? 'text-[var(--primary)]' : 'text-gray-400'}`} />
                    </div>
                    <div className={`flex-1 ${!notification.enabled ? 'opacity-50' : ''} transition-opacity`}>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                          {notification.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">
                        {notification.description}
                      </p>
                      {notification.schedule && notification.enabled && (
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          Schedule: {notification.schedule}
                        </p>
                      )}
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => toggleNotification(notification.id)}
                    />
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Section C: Message Preview */}
        <Card className="p-6 mb-20">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-[var(--text-muted)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Message Preview
            </h2>
          </div>

          {/* Mock Slack Message */}
          <div className="bg-slate-50 rounded-lg p-4 border border-[var(--border)]">
            <div className="border-l-4 border-[var(--primary)] pl-4">
              {/* Bot Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
                <span className="font-semibold text-sm">StaffCo Bot</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  APP
                </Badge>
                <span className="text-xs text-[var(--text-muted)] ml-auto">6:00 PM</span>
              </div>

              {/* Message Content */}
              <div className="space-y-3">
                <div className="font-semibold text-sm">
                  📊 Daily Summary — Design Team — Mar 3
                </div>
                <div className="text-sm text-[var(--text-secondary)]">
                  👥 Team: 5 members tracked today
                </div>

                {/* User Table */}
                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    <div className="flex items-center justify-between px-3 py-2 text-xs">
                      <span className="font-medium">John Smith</span>
                      <span className="font-mono">7h 30m</span>
                      <span className="text-green-600">✅</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 text-xs">
                      <span className="font-medium">Maria Lopez</span>
                      <span className="font-mono">8h 15m</span>
                      <span className="text-green-600">✅</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 text-xs bg-amber-50">
                      <span className="font-medium">Alex Kim</span>
                      <span className="font-mono">6h 00m</span>
                      <span className="text-amber-600">⚠️ Below target</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 text-xs bg-red-50">
                      <span className="font-medium">Sarah Chen</span>
                      <span className="font-mono">0h 00m</span>
                      <span className="text-red-600">🔴 No tracking</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 text-xs bg-amber-50">
                      <span className="font-medium">Bob Wilson</span>
                      <span className="font-mono">9h 45m</span>
                      <span className="text-amber-600">⚠️ Overtime</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-xs text-[var(--text-muted)] font-mono">
                  Total: 31h 30m │ Target: 40h
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-60 right-0 bg-white border-t border-[var(--border)] px-8 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Clock className="w-4 h-4" />
            Last synced: 2 minutes ago
          </div>
          <Button onClick={handleSave} className="bg-[var(--primary)] hover:bg-[var(--primary-hover)]">
            Save Settings
          </Button>
        </div>
      </motion.div>
    </AppLayout>
  );
}
