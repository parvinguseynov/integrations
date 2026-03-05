"use client";

import { useDevMode } from "@/contexts/dev-mode-context";
import { Code } from "lucide-react";
import { motion } from "framer-motion";

export function DevModeToggle() {
  const { devMode, toggleDevMode } = useDevMode();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2">
      {devMode && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="px-2 py-1 bg-blue-600 text-white text-[9px] font-bold rounded shadow-lg"
        >
          DEV
        </motion.div>
      )}

      <div className="group relative">
        <motion.button
          onClick={toggleDevMode}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
            devMode
              ? "bg-blue-50 border-2 border-blue-500"
              : "bg-gray-100 border border-gray-200 hover:bg-gray-200"
          }`}
          animate={devMode ? { scale: [1, 1.05, 1] } : {}}
          transition={devMode ? { repeat: Infinity, duration: 2 } : {}}
        >
          <Code
            className={`w-5 h-5 ${
              devMode ? "text-blue-600" : "text-gray-400"
            }`}
          />
        </motion.button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl whitespace-nowrap">
            Developer Mode — Show spacing & specs on hover
            {devMode && (
              <div className="text-[10px] text-gray-400 mt-1">
                Click elements to copy specs
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
