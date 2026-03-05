"use client";

import { useDevMode } from "@/contexts/dev-mode-context";
import { Code, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export function DevModeToggle() {
  const { devMode, toggleDevMode } = useDevMode();

  // Keyboard shortcut: D key toggles Dev Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only toggle if not typing in an input/textarea
      if (e.key === "d" || e.key === "D") {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.isContentEditable) {
          e.preventDefault();
          toggleDevMode();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleDevMode]);

  return (
    <div className="fixed bottom-5 right-5 z-[9999]" data-dev-mode-ui>
      <AnimatePresence mode="wait">
        {devMode ? (
          // Expanded pill when ON
          <motion.div
            key="pill"
            initial={{ width: 44, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 44, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900 text-white rounded-full shadow-2xl overflow-hidden cursor-pointer"
            onClick={toggleDevMode}
          >
            <div className="flex items-center gap-3 px-4 py-2.5 whitespace-nowrap">
              {/* Icon and label */}
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Developer Mode</span>
              </div>

              {/* ON badge */}
              <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                ON
              </div>

              {/* Keyboard hint */}
              <div className="text-xs text-gray-500">
                Press <span className="text-gray-400 font-mono">D</span> to toggle
              </div>

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDevMode();
                }}
                className="ml-2 p-1 hover:bg-red-500/20 rounded-full transition-colors group"
              >
                <X className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
              </button>
            </div>
          </motion.div>
        ) : (
          // Small circle when OFF
          <motion.div
            key="circle"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="group relative"
          >
            <motion.button
              onClick={toggleDevMode}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg bg-gray-100 border border-gray-200 hover:bg-gray-200"
            >
              <Code className="w-5 h-5 text-gray-400" />
            </motion.button>

            {/* Tooltip when OFF */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
                <div className="font-medium">Developer Mode</div>
                <div className="text-gray-400 mt-0.5">
                  Press <span className="text-white font-mono">D</span> or click to enable
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
