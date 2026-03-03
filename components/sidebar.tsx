"use client";

import { LayoutDashboard, Clock, FolderOpen, BarChart3, Users, CalendarDays, Settings, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const StaffCoLogo = () => (
  <svg viewBox="0 0 664 664" fill="none" className="w-8 h-8 flex-shrink-0">
    <path d="M283.91 238L99.92 437.73C64.39 476.3 0 451.16 0 398.72V238H283.91Z" fill="#22C55E"/>
    <path d="M283.91 0V238H0V206.41C0 92.41 92.41 0 206.41 0H283.92H283.91Z" fill="#027F56"/>
    <path d="M595.82 11.85V79.56C595.82 167.07 524.88 238 437.38 238H283.92V0H583.98C590.52 0 595.83 5.30001 595.83 11.85H595.82Z" fill="#0EA5E9"/>
    <path d="M380.09 426L564.08 226.27C599.61 187.7 664 212.84 664 265.28V426H380.09Z" fill="#7C3AED"/>
    <path d="M380.09 664V426H664V457.59C664 571.59 571.59 664 457.59 664H380.08H380.09Z" fill="#0726D9"/>
    <path d="M68.1799 652.15V584.44C68.1799 496.93 139.12 426 226.62 426H380.08V664H80.0199C73.4799 664 68.1699 658.7 68.1699 652.15H68.1799Z" fill="#0EA5E9"/>
  </svg>
);

const navItems = [
  { icon: LayoutDashboard, label: "Main Dashboard", href: "/dashboard" },
  { icon: Clock, label: "Time Entries", href: "/time-entries" },
  { icon: FolderOpen, label: "Projects", href: "/projects", hasChevron: true },
  { icon: BarChart3, label: "Reporting", href: "/reporting", hasChevron: true },
  { icon: Users, label: "People", href: "/people", hasChevron: true },
  { icon: CalendarDays, label: "Calendar", href: "/calendar", badge: "New" },
  { icon: Settings, label: "Settings", href: "/", hasChevron: true, isActive: true },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-[var(--border)] flex flex-col">
      {/* Company Section */}
      <div className="p-4">
        <div className="text-[10px] font-medium tracking-wider text-[var(--text-muted)] uppercase mb-3">
          You're working in
        </div>
        <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          <StaffCoLogo />
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold text-[var(--text-primary)]">StaffCo LLC</div>
            <div className="text-xs text-[var(--text-secondary)]">Tap to switch company</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="relative">
              {item.isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--primary)] rounded-r-full"></div>
              )}
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors ${
                  item.isActive
                    ? "bg-[var(--primary-light)] text-[var(--primary)]"
                    : "text-[var(--text-secondary)] hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <Badge className="bg-[var(--primary)] text-white text-[10px] px-1.5 py-0 h-5">
                    {item.badge}
                  </Badge>
                )}
                {item.hasChevron && (
                  <ChevronRight className="w-4 h-4 opacity-40" />
                )}
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
