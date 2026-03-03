"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ConnectionState = {
  task: string[];
  messaging: string[];
  calendar: string[];
};

type ConnectionContextType = {
  connections: ConnectionState;
  connect: (category: keyof ConnectionState, providerId: string) => void;
  disconnect: (category: keyof ConnectionState, providerId: string) => void;
  isConnected: (category: keyof ConnectionState, providerId: string) => boolean;
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [connections, setConnections] = useState<ConnectionState>({
    task: ["jira"],
    messaging: [],
    calendar: ["gcal"],
  });

  const connect = (category: keyof ConnectionState, providerId: string) => {
    setConnections((prev) => ({
      ...prev,
      [category]: [...prev[category], providerId],
    }));
  };

  const disconnect = (category: keyof ConnectionState, providerId: string) => {
    setConnections((prev) => ({
      ...prev,
      [category]: prev[category].filter((id) => id !== providerId),
    }));
  };

  const isConnected = (category: keyof ConnectionState, providerId: string) => {
    return connections[category].includes(providerId);
  };

  return (
    <ConnectionContext.Provider value={{ connections, connect, disconnect, isConnected }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnections() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnections must be used within a ConnectionProvider");
  }
  return context;
}
