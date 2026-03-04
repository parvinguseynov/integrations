"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Check,
  Clock,
  Database,
  FileText,
  Settings as SettingsIcon,
  Loader2
} from "lucide-react";

type Actor = "staffco" | "unified" | "slack";

interface ActorPillsProps {
  active: Actor[];
}

function ActorPills({ active }: ActorPillsProps) {
  const actors = [
    { id: "staffco" as Actor, name: "StaffCo", color: "#0066FF" },
    { id: "unified" as Actor, name: "Unified.to", color: "#FF6B00" },
    { id: "slack" as Actor, name: "Slack", color: "#4A154B" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {actors.map((actor) => {
        const isActive = active.includes(actor.id);
        return (
          <div
            key={actor.id}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: isActive ? actor.color : "#F3F4F6",
              color: isActive ? "white" : "#9CA3AF",
              opacity: isActive ? 1 : 0.5,
            }}
          >
            {actor.name}
          </div>
        );
      })}
    </div>
  );
}

interface ProgressBarProps {
  current: number;
  total: number;
}

function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-6">
      <div className="text-xs text-[var(--text-muted)] mb-2 text-center">
        Step {current} of {total}
      </div>
      <div className="h-[3px] bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

const SlackCardDisconnected = () => (
  <div className="group relative bg-white border border-[var(--border)] rounded-xl px-5 py-4 hover:border-[var(--primary)] transition-colors cursor-pointer">
    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-xl bg-[#4A154B] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 54 54" className="w-7 h-7">
          <path d="M11.5 23.5a3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.5-3.5 3.5 3.5 0 0 1 3.5-3.5h3.5v3.5z" fill="#E01E5A"/>
          <path d="M13 23.5a3.5 3.5 0 0 1 3.5-3.5 3.5 3.5 0 0 1 3.5 3.5v8.5a3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.5-3.5v-8.5z" fill="#E01E5A"/>
          <path d="M16.5 11.5a3.5 3.5 0 0 1-3.5-3.5A3.5 3.5 0 0 1 16.5 4.5a3.5 3.5 0 0 1 3.5 3.5v3.5h-3.5z" fill="#36C5F0"/>
          <path d="M16.5 13a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5H8a3.5 3.5 0 0 1-3.5-3.5A3.5 3.5 0 0 1 8 13h8.5z" fill="#36C5F0"/>
          <path d="M28.5 16.5A3.5 3.5 0 0 1 32 13a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5h-3.5v-3.5z" fill="#2EB67D"/>
          <path d="M27 16.5A3.5 3.5 0 0 1 23.5 20 3.5 3.5 0 0 1 20 16.5V8a3.5 3.5 0 0 1 3.5-3.5A3.5 3.5 0 0 1 27 8v8.5z" fill="#2EB67D"/>
          <path d="M23.5 28.5A3.5 3.5 0 0 1 27 32a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 20 32v-3.5h3.5z" fill="#ECB22E"/>
          <path d="M23.5 27A3.5 3.5 0 0 1 20 23.5 3.5 3.5 0 0 1 23.5 20H32a3.5 3.5 0 0 1 3.5 3.5A3.5 3.5 0 0 1 32 27h-8.5z" fill="#ECB22E"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">Slack</h3>
        <p className="text-xs text-[var(--text-secondary)] leading-[1.4]">
          Team notifications, daily summaries, and alerts
        </p>
      </div>
    </div>
    <div className="mt-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-sm font-medium text-[var(--primary)]">Connect →</span>
    </div>
  </div>
);

interface SlackCardConnectedProps {
  onManageClick?: () => void;
}

const SlackCardConnected = ({ onManageClick }: SlackCardConnectedProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="relative bg-white border border-[var(--border)] rounded-xl overflow-hidden"
  >
    <motion.div
      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4A154B] to-purple-400"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.5 }}
      style={{ transformOrigin: "left" }}
    />
    <div className="px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#4A154B] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 54 54" className="w-7 h-7">
            <path d="M11.5 23.5a3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.5-3.5 3.5 3.5 0 0 1 3.5-3.5h3.5v3.5z" fill="#E01E5A"/>
            <path d="M13 23.5a3.5 3.5 0 0 1 3.5-3.5 3.5 3.5 0 0 1 3.5 3.5v8.5a3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.5-3.5v-8.5z" fill="#E01E5A"/>
            <path d="M16.5 11.5a3.5 3.5 0 0 1-3.5-3.5A3.5 3.5 0 0 1 16.5 4.5a3.5 3.5 0 0 1 3.5 3.5v3.5h-3.5z" fill="#36C5F0"/>
            <path d="M16.5 13a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5H8a3.5 3.5 0 0 1-3.5-3.5A3.5 3.5 0 0 1 8 13h8.5z" fill="#36C5F0"/>
            <path d="M28.5 16.5A3.5 3.5 0 0 1 32 13a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5h-3.5v-3.5z" fill="#2EB67D"/>
            <path d="M27 16.5A3.5 3.5 0 0 1 23.5 20 3.5 3.5 0 0 1 20 16.5V8a3.5 3.5 0 0 1 3.5-3.5A3.5 3.5 0 0 1 27 8v8.5z" fill="#2EB67D"/>
            <path d="M23.5 28.5A3.5 3.5 0 0 1 27 32a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 20 32v-3.5h3.5z" fill="#ECB22E"/>
            <path d="M23.5 27A3.5 3.5 0 0 1 20 23.5 3.5 3.5 0 0 1 23.5 20H32a3.5 3.5 0 0 1 3.5 3.5A3.5 3.5 0 0 1 32 27h-8.5z" fill="#ECB22E"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Slack</h3>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-medium rounded"
            >
              Connected
            </motion.span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-[1.4]">
            Team notifications, daily summaries, and alerts
          </p>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between"
      >
        <div className="text-xs text-[var(--text-muted)]">
          Last synced: Just now
        </div>
        <Button
          size="sm"
          onClick={onManageClick}
          className="h-7 px-3 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white text-xs rounded-full"
        >
          Manage
        </Button>
      </motion.div>
    </div>
  </motion.div>
);

export default function IntegrationFlowPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 9));
  const restart = () => setCurrentStep(1);
  const goToMessagingSettings = () => router.push("/messaging-settings");

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <ProgressBar current={currentStep} total={9} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3 text-center">
                  Start: Admin Opens Integrations Page
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-8 mb-6">
                  <SlackCardDisconnected />
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-6 text-center max-w-2xl mx-auto">
                  The company admin navigates to Settings → Integrations and sees available messaging providers.
                </p>

                <ActorPills active={["staffco"]} />

                <div className="flex justify-center">
                  <Button onClick={nextStep} size="lg">
                    Click Connect
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3 text-center">
                  StaffCo Requests Authorization URL
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-8 mb-6">
                  <div className="flex items-center justify-center gap-8">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-xl bg-[#0066FF] flex items-center justify-center mb-2">
                        <span className="text-white font-bold text-lg">SC</span>
                      </div>
                      <span className="text-xs font-medium text-[var(--text-muted)]">StaffCo</span>
                    </div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex-1 flex items-center"
                    >
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-[#0066FF] to-[#FF6B00]" />
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="text-[#FF6B00]"
                      >
                        →
                      </motion.div>
                    </motion.div>

                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-xl bg-[#FF6B00] flex items-center justify-center mb-2">
                        <span className="text-white font-bold text-lg">U</span>
                      </div>
                      <span className="text-xs font-medium text-[var(--text-muted)]">Unified.to</span>
                    </div>
                  </div>

                  <div className="mt-6 bg-gray-50 rounded-lg p-4 font-mono text-xs">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>POST /unified/integration/auth</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-6 text-center max-w-2xl mx-auto">
                  StaffCo asks Unified.to to generate an authorization link for Slack. Unified.to handles all the OAuth complexity — we never touch Slack's API directly.
                </p>

                <ActorPills active={["staffco", "unified"]} />

                <div className="flex justify-center">
                  <Button onClick={nextStep} size="lg">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3 text-center">
                  Slack Authorization Page
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-8 mb-6">
                  {/* Mock browser window */}
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {/* Browser toolbar */}
                    <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-300">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600 flex items-center gap-2">
                        <div className="w-3 h-3 text-green-600">🔒</div>
                        slack.com/oauth/authorize
                      </div>
                    </div>

                    {/* Browser content */}
                    <div className="bg-white p-8">
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-xl bg-[#4A154B] flex items-center justify-center">
                          <svg viewBox="0 0 54 54" className="w-10 h-10">
                            <path d="M11.5 23.5a3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.5-3.5 3.5 3.5 0 0 1 3.5-3.5h3.5v3.5z" fill="#E01E5A"/>
                            <path d="M13 23.5a3.5 3.5 0 0 1 3.5-3.5 3.5 3.5 0 0 1 3.5 3.5v8.5a3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.5-3.5v-8.5z" fill="#E01E5A"/>
                            <path d="M16.5 11.5a3.5 3.5 0 0 1-3.5-3.5A3.5 3.5 0 0 1 16.5 4.5a3.5 3.5 0 0 1 3.5 3.5v3.5h-3.5z" fill="#36C5F0"/>
                            <path d="M16.5 13a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5H8a3.5 3.5 0 0 1-3.5-3.5A3.5 3.5 0 0 1 8 13h8.5z" fill="#36C5F0"/>
                            <path d="M28.5 16.5A3.5 3.5 0 0 1 32 13a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5h-3.5v-3.5z" fill="#2EB67D"/>
                            <path d="M27 16.5A3.5 3.5 0 0 1 23.5 20 3.5 3.5 0 0 1 20 16.5V8a3.5 3.5 0 0 1 3.5-3.5A3.5 3.5 0 0 1 27 8v8.5z" fill="#2EB67D"/>
                            <path d="M23.5 28.5A3.5 3.5 0 0 1 27 32a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 20 32v-3.5h3.5z" fill="#ECB22E"/>
                            <path d="M23.5 27A3.5 3.5 0 0 1 20 23.5 3.5 3.5 0 0 1 23.5 20H32a3.5 3.5 0 0 1 3.5 3.5A3.5 3.5 0 0 1 32 27h-8.5z" fill="#ECB22E"/>
                          </svg>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-center mb-2">StaffCo is requesting access</h2>
                      <p className="text-sm text-gray-600 text-center mb-6">to your workspace</p>

                      <div className="space-y-2 mb-6">
                        {["View channels", "Send messages", "View workspace info"].map((permission) => (
                          <div key={permission} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-600" />
                            <span>{permission}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" disabled>
                          Cancel
                        </Button>
                        <Button onClick={nextStep} className="flex-1 bg-green-600 hover:bg-green-700">
                          Allow
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-6 text-center max-w-2xl mx-auto">
                  The admin sees Slack's official authorization page. This is Slack's own UI — not ours. The admin reviews what permissions StaffCo needs and decides to grant access.
                </p>

                <ActorPills active={["slack"]} />
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3 text-center">
                  Authorization Confirmed
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-8 mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="flex justify-center mb-8"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-12 h-12 text-green-600" />
                    </div>
                  </motion.div>

                  <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl bg-[#4A154B] flex items-center justify-center mb-2">
                        <span className="text-white font-bold">S</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">Slack</span>
                    </div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-24 h-0.5 bg-green-500 mb-1" />
                      <span className="text-[10px] text-green-600 font-medium">access granted</span>
                    </motion.div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl bg-[#FF6B00] flex items-center justify-center mb-2">
                        <span className="text-white font-bold">U</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">Unified.to</span>
                    </div>

                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-24 h-0.5 bg-blue-500 mb-1" />
                      <span className="text-[10px] text-blue-600 font-medium">connection_id</span>
                    </motion.div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl bg-[#0066FF] flex items-center justify-center mb-2">
                        <span className="text-white font-bold">SC</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">StaffCo</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-6 text-center max-w-2xl mx-auto">
                  Slack confirms the authorization. Unified.to receives and securely stores the access token. StaffCo receives only a connection_id — a reference key. We never see or store Slack's token.
                </p>

                <ActorPills active={["staffco", "unified", "slack"]} />

                <div className="flex justify-center">
                  <Button onClick={nextStep} size="lg">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3 text-center">
                  Card Updates to Connected State
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-8 mb-6">
                  <SlackCardConnected onManageClick={goToMessagingSettings} />
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-6 text-center max-w-2xl mx-auto">
                  The Slack card on the Integrations page now shows as connected. The admin can click 'Manage' to configure notification settings.
                </p>

                <ActorPills active={["staffco"]} />

                <div className="flex justify-center">
                  <Button onClick={goToMessagingSettings} size="lg">
                    Open Settings
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3 text-center">
                  Admin Configures Notifications
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-8 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-[var(--text-muted)] mb-2 block">
                        Slack Channel
                      </label>
                      <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-[var(--border)] text-sm">
                        #staffco-alerts
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="text-sm font-medium">Daily Team Summary</span>
                        <div className="w-11 h-6 bg-[var(--primary)] rounded-full relative">
                          <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
                        </div>
                      </div>

                      {["Tracking Reminders", "Low Activity Alerts", "Unproductive Time Alerts"].map((name) => (
                        <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-[var(--border)]">
                          <span className="text-sm font-medium text-[var(--text-muted)]">{name}</span>
                          <div className="w-11 h-6 bg-gray-300 rounded-full relative">
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
                          </div>
                        </div>
                      ))}

                      <motion.div
                        initial={{ backgroundColor: "#F9FAFB" }}
                        animate={{ backgroundColor: "#EFF6FF" }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between p-3 rounded-lg border border-blue-200"
                      >
                        <span className="text-sm font-medium">Weekly Digest</span>
                        <motion.div
                          className="w-11 h-6 rounded-full relative"
                          animate={{ backgroundColor: "#0066FF" }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            className="absolute top-0.5 w-5 h-5 bg-white rounded-full"
                            animate={{ left: "20px" }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-6 text-center max-w-2xl mx-auto">
                  The admin selects which Slack channel should receive notifications and enables the desired notification types. All configuration is stored in StaffCo — Unified.to and Slack know nothing about our notification logic.
                </p>

                <ActorPills active={["staffco"]} />

                <div className="flex justify-center">
                  <Button onClick={nextStep} size="lg">
                    Save & Continue
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3 text-center">
                  6:00 PM — Daily Summary Triggered
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-8 mb-6">
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <Clock className="w-16 h-16 text-[var(--primary)]" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute inset-0"
                      >
                        <div className="w-full h-full relative">
                          <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-[var(--primary)] origin-bottom -translate-x-1/2 -translate-y-full" />
                        </div>
                      </motion.div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xl font-bold text-[var(--text-primary)]">
                        6:00 PM
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mt-12">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <SettingsIcon className="w-5 h-5 text-blue-600 animate-spin" style={{ animationDuration: "3s" }} />
                      <span className="text-sm font-medium">Celery task wakes up</span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                    >
                      <Database className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Collects data from StaffCo database</span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.5 }}
                      className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg"
                    >
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium">Formats message</span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 3 }}
                      className="p-4 bg-gray-50 rounded-lg border border-[var(--border)] font-mono text-xs"
                    >
                      <div className="text-[var(--text-muted)]">📊 Team: Engineering</div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 3.2, duration: 0.3 }}
                        className="mt-1 text-[var(--text-secondary)]"
                      >
                        • Alice Johnson: 8.5h ✓
                      </motion.div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 3.4, duration: 0.3 }}
                        className="text-[var(--text-secondary)]"
                      >
                        • Bob Smith: 7.2h ✓
                      </motion.div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 3.6, duration: 0.3 }}
                        className="text-[var(--text-secondary)]"
                      >
                        • Carol Davis: 6.8h ⚠️
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-6 text-center max-w-2xl mx-auto">
                  At the configured time, StaffCo's background worker collects tracking data from its own database, calculates hours per team member, and formats the notification message. This is entirely our logic — no external services involved yet.
                </p>

                <ActorPills active={["staffco"]} />

                <div className="flex justify-center">
                  <Button onClick={nextStep} size="lg">
                    Send Message
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3 text-center">
                  Message Sent via Unified.to
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-8 mb-6">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl bg-[#0066FF] flex items-center justify-center mb-2">
                        <span className="text-white font-bold">SC</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">StaffCo</span>
                    </div>

                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center"
                      style={{ transformOrigin: "left" }}
                    >
                      <div className="w-24 h-0.5 bg-blue-500 mb-1" />
                      <span className="text-[10px] text-blue-600 font-medium whitespace-nowrap">
                        POST /message
                      </span>
                    </motion.div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl bg-[#FF6B00] flex items-center justify-center mb-2">
                        <span className="text-white font-bold">U</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">Unified.to</span>
                    </div>

                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      className="flex flex-col items-center"
                      style={{ transformOrigin: "left" }}
                    >
                      <div className="w-24 h-0.5 bg-purple-500 mb-1" />
                      <span className="text-[10px] text-purple-600 font-medium whitespace-nowrap">
                        chat.postMessage
                      </span>
                    </motion.div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl bg-[#4A154B] flex items-center justify-center mb-2">
                        <span className="text-white font-bold">S</span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">Slack</span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 }}
                    className="mt-8 flex justify-end"
                  >
                    <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
                      <div className="text-xs font-medium mb-1">💬 New message</div>
                      <div className="text-[10px] text-gray-600">Daily Team Summary</div>
                    </div>
                  </motion.div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-6 text-center max-w-2xl mx-auto">
                  StaffCo sends the formatted message to Unified.to with the connection_id and channel. Unified.to translates this into a Slack API call and delivers the message. The same code works for Teams and Discord — only the connection_id changes.
                </p>

                <ActorPills active={["staffco", "unified", "slack"]} />

                <div className="flex justify-center">
                  <Button onClick={nextStep} size="lg">
                    See Result
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 9 && (
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-3 text-center">
                  Message Delivered!
                </h1>

                <div className="bg-white rounded-xl shadow-sm border border-[var(--border)] p-6 mb-6 relative overflow-hidden">
                  {/* Subtle confetti effect */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, times: [0, 0.5, 1] }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: -20, x: Math.random() * 100 + "%", opacity: 1 }}
                        animate={{ y: 500, opacity: 0 }}
                        transition={{ duration: 2, delay: Math.random() * 0.5 }}
                        className="absolute w-2 h-2 rounded-full"
                        style={{ backgroundColor: ["#0066FF", "#22C55E", "#F59E0B", "#EF4444"][i % 4] }}
                      />
                    ))}
                  </motion.div>

                  {/* Slack message mockup */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">SC</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-sm">StaffCo Bot</span>
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">APP</span>
                          <span className="text-xs text-gray-500">6:00 PM</span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm mb-2">📊 Daily Team Summary — Engineering</div>
                          <div className="text-sm text-gray-700 mb-3">Here's today's time tracking summary:</div>
                          <div className="bg-gray-50 rounded p-3 space-y-2 text-xs font-mono">
                            <div className="flex justify-between">
                              <span>• Alice Johnson</span>
                              <span className="font-semibold">8.5h ✓</span>
                            </div>
                            <div className="flex justify-between">
                              <span>• Bob Smith</span>
                              <span className="font-semibold">7.2h ✓</span>
                            </div>
                            <div className="flex justify-between">
                              <span>• Carol Davis</span>
                              <span className="font-semibold">6.8h ⚠️</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-6 text-center max-w-2xl mx-auto">
                  The team sees the daily summary in their Slack channel. The same flow works identically for Microsoft Teams and Discord — one implementation, three platforms.
                </p>

                <ActorPills active={["slack"]} />

                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={restart} size="lg">
                    Restart Demo
                  </Button>
                  <Button onClick={() => router.push("/")} size="lg">
                    Back to Integrations
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
