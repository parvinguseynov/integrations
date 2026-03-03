"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, CheckSquare, MessageSquare, CalendarDays } from "lucide-react";
import { ProviderCard } from "@/components/provider-card";
import { useConnections } from "@/contexts/connection-context";
import { motion } from "framer-motion";
import { OAuthModal } from "@/components/oauth-modal";
import { DisconnectModal } from "@/components/disconnect-modal";
import { toast } from "sonner";

const providers = {
  task: [
    { id: "jira", name: "Jira", desc: "Sync projects, epics, and issues from Atlassian Jira", color: "#0052CC" },
    { id: "asana", name: "Asana", desc: "Import tasks and projects from Asana workspace", color: "#F06A6A" },
    { id: "trello", name: "Trello", desc: "Sync boards, lists, and cards from Trello", color: "#0079BF" },
    { id: "clickup", name: "ClickUp", desc: "Import spaces, folders, and tasks from ClickUp", color: "#7B68EE" },
    { id: "linear", name: "Linear", desc: "Sync teams, projects, and issues from Linear", color: "#5E6AD2" },
  ],
  messaging: [
    { id: "slack", name: "Slack", desc: "Team notifications, daily summaries, and alerts", color: "#4A154B" },
    { id: "teams", name: "Microsoft Teams", desc: "Notifications and summaries in Teams channels", color: "#5B5FC7" },
    { id: "discord", name: "Discord", desc: "Bot notifications for remote and async teams", color: "#5865F2" },
  ],
  calendar: [
    { id: "gcal", name: "Google Calendar", desc: "Seamless scheduling and event sync", color: "#4285F4", native: true },
  ],
};

interface Category {
  id: string;
  title: string;
  icon: any;
  gradient: string;
  subtitle: string;
  providers: typeof providers.task | typeof providers.messaging | typeof providers.calendar;
}

const categories: Category[] = [
  {
    id: "task",
    title: "Project Management",
    icon: CheckSquare,
    gradient: "from-blue-500 to-blue-600",
    subtitle: "Sync tasks for time tracking",
    providers: providers.task,
  },
  {
    id: "messaging",
    title: "Messaging & Notifications",
    icon: MessageSquare,
    gradient: "from-purple-500 to-purple-600",
    subtitle: "Summaries and alerts",
    providers: providers.messaging,
  },
  {
    id: "calendar",
    title: "Calendars",
    icon: CalendarDays,
    gradient: "from-green-500 to-green-600",
    subtitle: "Native integration",
    providers: providers.calendar,
  },
];

export default function IntegrationsPage() {
  const { isConnected, connections, disconnect } = useConnections();
  const [searchQuery, setSearchQuery] = useState("");
  const [oauthModal, setOauthModal] = useState<{
    open: boolean;
    provider?: { id: string; name: string; category: string };
  }>({ open: false });
  const [disconnectModal, setDisconnectModal] = useState<{
    open: boolean;
    provider?: { id: string; name: string; category: string };
  }>({ open: false });

  const totalConnected = connections.task.length + connections.messaging.length + connections.calendar.length;

  const handleConnect = (providerId: string, providerName: string, category: string) => {
    setOauthModal({ open: true, provider: { id: providerId, name: providerName, category } });
  };

  const handleDisconnectClick = (providerId: string, providerName: string, category: string) => {
    setDisconnectModal({ open: true, provider: { id: providerId, name: providerName, category } });
  };

  const handleDisconnectConfirm = () => {
    if (disconnectModal.provider) {
      disconnect(disconnectModal.provider.category as any, disconnectModal.provider.id);
      toast.success(`${disconnectModal.provider.name} disconnected`);
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Integrations
            </h1>
            <Badge className="bg-[var(--primary)] text-white text-xs px-2 py-0.5">
              {totalConnected} active
            </Badge>
          </div>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg">
            Connect your tools to sync projects, tasks, and notifications. Your team will track time
            against real tasks from the tools they already use.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {categories.map((category, categoryIndex) => {
            const Icon = category.icon;
            const categoryKey = category.id as keyof typeof connections;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                      {category.title}
                    </h2>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {connections[categoryKey].length > 0
                        ? `${connections[categoryKey].length} connected`
                        : `${category.providers.length} available`}
                    </Badge>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">
                    {category.subtitle}
                  </span>
                </div>

                {/* Provider Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.providers.map((provider, index) => (
                    <motion.div
                      key={provider.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: categoryIndex * 0.1 + index * 0.05 }}
                    >
                      <ProviderCard
                        id={provider.id}
                        name={provider.name}
                        desc={provider.desc}
                        color={provider.color}
                        isConnected={isConnected(categoryKey, provider.id)}
                        onConnect={() => handleConnect(provider.id, provider.name, category.id)}
                        onDisconnect={() => handleDisconnectClick(provider.id, provider.name, category.id)}
                        native={(provider as any).native}
                        manageHref={
                          isConnected(categoryKey, provider.id)
                            ? category.id === "task"
                              ? "/task-settings"
                              : category.id === "messaging"
                              ? "/messaging-settings"
                              : undefined
                            : undefined
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12">
          <Separator className="mb-6" />
          <p className="text-xs text-center text-[var(--text-muted)]">
            Need an integration we don't support yet?{" "}
            <a href="#" className="text-[var(--primary)] hover:underline">
              Let us know
            </a>
          </p>
        </div>
      </motion.div>

      <OAuthModal
        open={oauthModal.open}
        onOpenChange={(open) => setOauthModal({ open })}
        provider={oauthModal.provider}
      />

      <DisconnectModal
        open={disconnectModal.open}
        onOpenChange={(open) => setDisconnectModal({ open })}
        provider={disconnectModal.provider}
        onConfirm={handleDisconnectConfirm}
      />
    </AppLayout>
  );
}
