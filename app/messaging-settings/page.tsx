"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  Trash2,
  Hash,
  BarChart3,
  AlertTriangle,
  Bell,
  Moon,
  CalendarDays,
  Eye,
  Clock,
} from "lucide-react";
import { ProviderLogo } from "@/components/provider-logos";
import { DisconnectModal } from "@/components/disconnect-modal";
import { useConnections } from "@/contexts/connection-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

const channels = ["#staffco-alerts", "#general", "#engineering", "#management", "#random"];

const timeOptions16to22 = [
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
];

const timeOptions8to12 = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"
];

const timeOptions7to12 = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

type NotificationType = {
  id: string;
  icon: any;
  title: string;
  description: string;
  enabled: boolean;
  time?: string;
  threshold?: number;
  day?: string;
};

const initialNotifications: NotificationType[] = [
  {
    id: "daily-summary",
    icon: BarChart3,
    title: "Daily Team Summary",
    description: "End-of-day report showing hours tracked per team member. Flags users below target and users who didn't track.",
    enabled: true,
    time: "18:00",
  },
  {
    id: "tracking-reminders",
    icon: Bell,
    title: "Tracking Reminders",
    description: "Sent when team members haven't started tracking. Includes who hasn't started and when they last tracked.",
    enabled: false,
    time: "10:00",
  },
  {
    id: "low-activity",
    icon: Moon,
    title: "Low Activity Alerts",
    description: "Triggered when a user's activity drops below the threshold during tracking. May indicate idle tracking.",
    enabled: false,
    threshold: 30,
  },
  {
    id: "unproductive",
    icon: AlertTriangle,
    title: "Unproductive Time Alerts",
    description: "End-of-day alert when unproductive app/website usage exceeds the threshold. Shows top unproductive sites.",
    enabled: false,
    threshold: 30,
  },
  {
    id: "weekly-digest",
    icon: CalendarDays,
    title: "Weekly Digest",
    description: "Weekly summary of the previous week. Includes total hours, attendance rate, top projects, and productivity breakdown.",
    enabled: false,
    time: "09:00",
    day: "Monday",
  },
];

export default function MessagingSettingsPage() {
  const router = useRouter();
  const { disconnect } = useConnections();
  const [selectedChannel, setSelectedChannel] = useState("#staffco-alerts");
  const [notifications, setNotifications] = useState<NotificationType[]>(initialNotifications);
  const [selectedTab, setSelectedTab] = useState("daily-summary");
  const [disconnectModal, setDisconnectModal] = useState(false);

  const handleSave = () => {
    toast.success("Settings saved");
  };

  const handleDisconnect = () => {
    disconnect("messaging", "slack");
    toast.success("Slack disconnected");
    router.push("/");
  };

  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
  };

  const updateNotificationSetting = (id: string, field: string, value: any) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, [field]: value } : n
    ));
  };

  const enabledNotifications = notifications.filter(n => n.enabled);

  // Set default tab to first enabled notification
  const activeTab = enabledNotifications.find(n => n.id === selectedTab)
    ? selectedTab
    : (enabledNotifications[0]?.id || "daily-summary");

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
            onClick={() => setDisconnectModal(true)}
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
                  <div className="py-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${notification.enabled ? 'bg-[var(--primary-light)]' : 'bg-gray-100'} transition-colors`}>
                        <Icon className={`w-5 h-5 ${notification.enabled ? 'text-[var(--primary)]' : 'text-gray-400'}`} />
                      </div>
                      <div className={`flex-1 ${!notification.enabled ? 'opacity-50' : ''} transition-opacity duration-200`}>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                            {notification.title}
                          </h3>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mb-2">
                          {notification.description}
                        </p>

                        {/* Additional Settings */}
                        <div
                          className="overflow-hidden transition-all duration-200"
                          style={{
                            maxHeight: notification.enabled ? "200px" : "0",
                            opacity: notification.enabled ? 1 : 0,
                          }}
                        >
                          {notification.id === "daily-summary" && notification.enabled && (
                            <div className="flex items-center gap-2 mt-2">
                              <select
                                value={notification.time}
                                onChange={(e) => updateNotificationSetting(notification.id, "time", e.target.value)}
                                className="px-2 py-1 border border-[var(--border)] rounded text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                              >
                                {timeOptions16to22.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                              <span className="text-xs text-[var(--text-muted)]">Company timezone</span>
                            </div>
                          )}

                          {notification.id === "tracking-reminders" && notification.enabled && (
                            <div className="mt-2 space-y-1">
                              <select
                                value={notification.time}
                                onChange={(e) => updateNotificationSetting(notification.id, "time", e.target.value)}
                                className="px-2 py-1 border border-[var(--border)] rounded text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                              >
                                {timeOptions8to12.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                              <p className="text-xs text-[var(--text-muted)]">Skips weekends and non-working days</p>
                            </div>
                          )}

                          {notification.id === "low-activity" && notification.enabled && (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  min="10"
                                  max="50"
                                  value={notification.threshold}
                                  onChange={(e) => updateNotificationSetting(notification.id, "threshold", parseInt(e.target.value))}
                                  className="w-20 h-7 text-xs"
                                />
                                <span className="text-xs text-[var(--text-muted)]">%</span>
                              </div>
                              <p className="text-xs text-[var(--text-muted)]">Maximum 1 alert per user per day</p>
                              <p className="text-xs text-[var(--text-muted)]">Checked every 30 minutes during work hours</p>
                            </div>
                          )}

                          {notification.id === "unproductive" && notification.enabled && (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  min="15"
                                  max="60"
                                  value={notification.threshold}
                                  onChange={(e) => updateNotificationSetting(notification.id, "threshold", parseInt(e.target.value))}
                                  className="w-20 h-7 text-xs"
                                />
                                <span className="text-xs text-[var(--text-muted)]">%</span>
                              </div>
                              <p className="text-xs text-[var(--text-muted)]">Compared against team average for context</p>
                            </div>
                          )}

                          {notification.id === "weekly-digest" && notification.enabled && (
                            <div className="flex items-center gap-2 mt-2">
                              <select
                                value={notification.day}
                                onChange={(e) => updateNotificationSetting(notification.id, "day", e.target.value)}
                                className="px-2 py-1 border border-[var(--border)] rounded text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                              >
                                {daysOfWeek.map(day => (
                                  <option key={day} value={day}>{day}</option>
                                ))}
                              </select>
                              <select
                                value={notification.time}
                                onChange={(e) => updateNotificationSetting(notification.id, "time", e.target.value)}
                                className="px-2 py-1 border border-[var(--border)] rounded text-xs focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                              >
                                {timeOptions7to12.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                      <Switch
                        checked={notification.enabled}
                        onCheckedChange={() => toggleNotification(notification.id)}
                      />
                    </div>
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

          {/* Tabs */}
          {enabledNotifications.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {enabledNotifications.map(notif => (
                <button
                  key={notif.id}
                  onClick={() => setSelectedTab(notif.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeTab === notif.id
                      ? "bg-[var(--primary)] text-white"
                      : "bg-gray-100 text-[var(--text-secondary)] hover:bg-gray-200"
                  }`}
                >
                  {notif.title}
                </button>
              ))}
            </div>
          )}

          {/* Preview Content */}
          <div className="bg-slate-50 rounded-lg p-4 border border-[var(--border)]">
            <div className="border-l-4 border-[var(--primary)] pl-4">
              {activeTab === "daily-summary" && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">S</div>
                    <span className="font-semibold text-sm">StaffCo Bot</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">APP</Badge>
                    <span className="text-xs text-[var(--text-muted)] ml-auto">6:00 PM</span>
                  </div>
                  <div className="space-y-3">
                    <div className="font-semibold text-sm">📊 Daily Summary — Design Team — Mar 4</div>
                    <div className="text-sm text-[var(--text-secondary)]">👥 Team: 5 members tracked today</div>
                    <div className="bg-white rounded border border-gray-200 overflow-hidden">
                      <div className="divide-y divide-gray-200">
                        <div className="flex items-center justify-between px-3 py-2 text-xs">
                          <span className="font-medium">John Smith</span><span className="font-mono">9h 15m</span><span className="text-green-600">✅</span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 text-xs">
                          <span className="font-medium">Maria Lopez</span><span className="font-mono">8h 30m</span><span className="text-green-600">✅</span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 text-xs">
                          <span className="font-medium">Alex Kim</span><span className="font-mono">9h 00m</span><span className="text-green-600">✅</span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 text-xs">
                          <span className="font-medium">Sarah Chen</span><span className="font-mono">10h 05m</span><span className="text-green-600">✅</span>
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 text-xs">
                          <span className="font-medium">Bob Wilson</span><span className="font-mono">8h 20m</span><span className="text-green-600">✅</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] font-mono">Total: 45h 10m │ Avg: 5h 39m/user</div>
                  </div>
                </>
              )}

              {activeTab === "tracking-reminders" && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">S</div>
                    <span className="font-semibold text-sm">StaffCo Bot</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">APP</Badge>
                    <span className="text-xs text-[var(--text-muted)] ml-auto">10:15 AM</span>
                  </div>
                  <div className="space-y-3">
                    <div className="font-semibold text-sm">⏰ Tracking Reminder</div>
                    <div className="text-sm text-[var(--text-secondary)]">3 team members haven't started tracking today:</div>
                    <div className="bg-white rounded border border-gray-200 p-3 space-y-2 text-xs">
                      <div>Sarah Chen — <span className="text-[var(--text-muted)]">last tracked: yesterday</span></div>
                      <div>Bob Wilson — <span className="text-[var(--text-muted)]">last tracked: 2 days ago</span></div>
                      <div>Lisa Wang — <span className="text-[var(--text-muted)]">last tracked: yesterday</span></div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "low-activity" && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">S</div>
                    <span className="font-semibold text-sm">StaffCo Bot</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">APP</Badge>
                    <span className="text-xs text-[var(--text-muted)] ml-auto">2:30 PM</span>
                  </div>
                  <div className="space-y-3">
                    <div className="font-semibold text-sm">💤 Low Activity Alert</div>
                    <div className="text-sm text-[var(--text-secondary)]">Bob Wilson has unusually low activity:</div>
                    <div className="bg-white rounded border border-gray-200 p-3 space-y-1 text-xs">
                      <div><strong>Activity:</strong> 28% (threshold: 30%)</div>
                      <div><strong>Idle time:</strong> 3h 12m of 4h 30m tracked</div>
                      <div><strong>Current project:</strong> Internal Tools</div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "unproductive" && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">S</div>
                    <span className="font-semibold text-sm">StaffCo Bot</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">APP</Badge>
                    <span className="text-xs text-[var(--text-muted)] ml-auto">6:00 PM</span>
                  </div>
                  <div className="space-y-3">
                    <div className="font-semibold text-sm">⚠️ Unproductive Time Alert — Design Team</div>
                    <div className="text-sm text-[var(--text-secondary)]">2 team members exceeded 30% unproductive time:</div>
                    <div className="bg-white rounded border border-gray-200 p-3 space-y-3 text-xs">
                      <div>
                        <div className="font-semibold mb-1">Alex Kim — 38% unproductive</div>
                        <div className="text-[var(--text-muted)] pl-3">YouTube (1h 20m), Reddit (35m)</div>
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Bob Wilson — 42% unproductive</div>
                        <div className="text-[var(--text-muted)] pl-3">Twitter (1h 05m), News (45m)</div>
                      </div>
                      <div className="pt-2 border-t border-gray-200 text-[var(--text-muted)]">Team average: 18%</div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "weekly-digest" && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">S</div>
                    <span className="font-semibold text-sm">StaffCo Bot</span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">APP</Badge>
                    <span className="text-xs text-[var(--text-muted)] ml-auto">Monday 9:00 AM</span>
                  </div>
                  <div className="space-y-3">
                    <div className="font-semibold text-sm">📋 Weekly Digest — Design Team — Feb 24–28</div>
                    <div className="bg-white rounded border border-gray-200 p-3 space-y-3 text-xs">
                      <div>
                        <div><strong>Total hours:</strong> 312h 20m</div>
                        <div><strong>Avg per user:</strong> 39h 02m (target: 40h)</div>
                        <div><strong>Attendance:</strong> 94% (15 of 16 tracked)</div>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="font-semibold mb-2">Top projects:</div>
                        <div className="space-y-1 pl-3">
                          <div>1. Web App Redesign — 89h</div>
                          <div>2. Mobile App — 67h</div>
                          <div>3. Internal Tools — 42h</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <strong>Productivity:</strong> 71% productive │ 16% unproductive
                      </div>
                    </div>
                  </div>
                </>
              )}
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

      <DisconnectModal
        open={disconnectModal}
        onOpenChange={setDisconnectModal}
        provider={{ id: "slack", name: "Slack" }}
        onConfirm={handleDisconnect}
      />
    </AppLayout>
  );
}
