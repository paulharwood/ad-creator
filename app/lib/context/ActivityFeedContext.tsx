import React, { createContext, useContext, useState, ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

interface ActivityFeedContextType {
  messages: string[];
  addMessage: (message: string) => void;
}

const ActivityFeedContext = createContext<ActivityFeedContextType | undefined>(undefined);

export const ActivityFeedProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useLocalStorage<string[]>("activityFeedMessages", []);

  const addMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <ActivityFeedContext.Provider value={{ messages, addMessage }}>
      {children}
    </ActivityFeedContext.Provider>
  );
};

export const useActivityFeed = () => {
  const context = useContext(ActivityFeedContext);
  if (!context) {
    throw new Error("useActivityFeed must be used within an ActivityFeedProvider");
  }
  return context;
};
