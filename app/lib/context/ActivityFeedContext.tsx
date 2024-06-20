import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import ActivityFeed from '../../components/activityFeed';

interface ActivityMessage {
  date: string;
  message: string;
}

interface ActivityFeedContextType {
  messages: ActivityMessage[];
  addMessage: (message: string) => void;
}

const ActivityFeedContext = createContext<ActivityFeedContextType | undefined>(undefined);

export const ActivityFeedProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useLocalStorage<ActivityMessage[]>('activityFeedMessages', []);

  const addMessage = (message: string) => {
    const newMessage = {
      date: new Date().toISOString(),
      message,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <ActivityFeedContext.Provider value={{ messages, addMessage }}>
      <div>
        {children}
        <ActivityFeed />
      </div>
    </ActivityFeedContext.Provider>
  );
};

export const useActivityFeed = () => {
  const context = useContext(ActivityFeedContext);
  if (!context) {
    throw new Error('useActivityFeed must be used within an ActivityFeedProvider');
  }
  return context;
};