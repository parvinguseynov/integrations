"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  RefreshCw,
  Trash2,
  Folder,
  Settings,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { ProviderLogo } from "@/components/provider-logos";
import { DisconnectModal } from "@/components/disconnect-modal";
import { useConnections } from "@/contexts/connection-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

const mockProjects = [
  { key: "WEBAPP", name: "Web Application", tasks: 24, lead: "John Smith", checked: true },
  { key: "MOBILE", name: "Mobile App", tasks: 18, lead: "Maria Lopez", checked: true },
  { key: "INTERNAL", name: "Internal Tools", tasks: 7, lead: "Alex Kim", checked: false },
  { key: "INFRA", name: "Infrastructure", tasks: 12, lead: "Bob Wilson", checked: false },
  { key: "DESIGN", name: "Design System", tasks: 5, lead: "Sarah Chen", checked: false },
  { key: "MARKETING", name: "Marketing Site", tasks: 9, lead: "Diana Park", checked: false },
];

const matchedUsers = [
  "john@acme.com → John Smith",
  "maria@acme.com → Maria Lopez",
  "bob@acme.com → Bob Wilson",
  "sarah@acme.com → Sarah Chen",
  "diana@acme.com → Diana Park",
  "mike@acme.com → Mike Johnson",
  "lisa@acme.com → Lisa Wang",
  "tom@acme.com → Tom Davis",
];

const unmatchedUsers = [
  "alex.k@gmail.com",
  "freelancer@web.dev",
];

export default function TaskSettingsPage() {
  const router = useRouter();
  const { disconnect } = useConnections();
  const [syncMode, setSyncMode] = useState("selected");
  const [assignmentMode, setAssignmentMode] = useState("mirror");
  const [projects, setProjects] = useState(mockProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState(false);

  const handleSyncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success("Synced successfully");
    }, 2000);
  };

  const handleDisconnect = () => {
    disconnect("task", "jira");
    toast.success("Jira disconnected");
    router.push("/");
  };

  const handleSave = () => {
    toast.success("Settings saved");
  };

  const toggleProject = (key: string) => {
    setProjects(projects.map(p => p.key === key ? { ...p, checked: !p.checked } : p));
  };

  const selectedCount = projects.filter(p => p.checked).length;

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
            <ProviderLogo provider="jira" className="w-11 h-11" />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                  Jira Integration
                </h1>
                <Badge className="bg-[var(--success-light)] text-[var(--success)] border-[var(--success)]/30">
                  Connected
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                acme-corp.atlassian.net · Connected by Parvin Huseynov · Jan 27, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncNow}
              disabled={syncing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              Sync Now
            </Button>
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
        </div>

        {/* Section A: Projects to Sync */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Folder className="w-5 h-5 text-[var(--text-muted)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Projects to Sync
            </h2>
          </div>

          <RadioGroup value={syncMode} onValueChange={setSyncMode} className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="text-sm cursor-pointer">
                All projects
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="selected" id="selected" />
              <Label htmlFor="selected" className="text-sm cursor-pointer">
                Selected projects
              </Label>
            </div>
          </RadioGroup>

          {syncMode === "selected" && (
            <div className="space-y-3 mt-4">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="space-y-2">
                {projects.map((project) => (
                  <div
                    key={project.key}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--muted)]/50 cursor-pointer transition-colors"
                    onClick={() => toggleProject(project.key)}
                  >
                    <input
                      type="checkbox"
                      checked={project.checked}
                      onChange={() => toggleProject(project.key)}
                      className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span className="font-mono text-xs text-[var(--text-muted)] w-20">
                      {project.key}
                    </span>
                    <span className="text-sm font-medium flex-1">{project.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {project.tasks} tasks
                    </Badge>
                    <span className="text-xs text-[var(--text-muted)]">
                      Lead: {project.lead}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                {selectedCount} of {projects.length} projects selected
              </p>
            </div>
          )}
        </Card>

        {/* Section B: Task Assignment */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-[var(--text-muted)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Task Assignment
            </h2>
          </div>

          <RadioGroup value={assignmentMode} onValueChange={setAssignmentMode} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mirror" id="mirror" />
                <Label htmlFor="mirror" className="text-sm font-medium cursor-pointer">
                  Mirror assignments from Jira
                  <Badge className="ml-2 bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0">
                    recommended
                  </Badge>
                </Label>
              </div>
              <p className="text-xs text-[var(--text-muted)] ml-6">
                Tasks will be assigned to StaffCo users based on their Jira assignments. We'll
                match users by email address.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="everyone" id="everyone" />
                <Label htmlFor="everyone" className="text-sm font-medium cursor-pointer">
                  Make all synced tasks available to everyone
                </Label>
              </div>
              <p className="text-xs text-[var(--text-muted)] ml-6">
                All team members can track time against any synced task, regardless of Jira
                assignment.
              </p>
            </div>
          </RadioGroup>
        </Card>

        {/* Section C: User Mapping */}
        <Card className="p-6 mb-20">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[var(--text-muted)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              User Mapping
            </h2>
            <Badge className="bg-green-50 text-green-700 text-xs">
              {matchedUsers.length} of {matchedUsers.length + unmatchedUsers.length} matched
            </Badge>
          </div>

          {/* Matched Users */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
              Matched Users
            </h3>
            <div className="space-y-2">
              {matchedUsers.map((mapping, i) => {
                const [email, name] = mapping.split(" → ");
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                    <span className="font-mono text-xs text-[var(--text-muted)]">{email}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unmatched Users */}
          {unmatchedUsers.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                Unmatched Users
              </h3>
              <div className="space-y-2">
                {unmatchedUsers.map((email, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--warning-light)] border border-[var(--warning)]/20"
                  >
                    <AlertTriangle className="w-4 h-4 text-[var(--warning)] flex-shrink-0" />
                    <span className="font-mono text-xs text-[var(--text-muted)]">{email}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    <select className="text-sm border rounded px-2 py-1 bg-white">
                      <option>Select StaffCo user...</option>
                      <option>John Smith</option>
                      <option>Maria Lopez</option>
                      <option>Bob Wilson</option>
                      <option>Skip (don't assign)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
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
        provider={{ id: "jira", name: "Jira" }}
        onConfirm={handleDisconnect}
      />
    </AppLayout>
  );
}
