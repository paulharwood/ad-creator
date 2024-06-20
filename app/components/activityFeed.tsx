// components/ActivityFeed.tsx
import React from 'react';
import { useActivityFeed } from '../lib/context/ActivityFeedContext';
import ActivityFeedItem from './activityFeedItem';

const ActivityFeed = () => {
  const { messages } = useActivityFeed();

  return (
    <div className="fixed right-0 top-10 h-full w-80 bg-[#000000] shadow-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Activity Feed</h2>
      <ul>
        {messages.slice().reverse().map((message, index) => (
          <ActivityFeedItem key={index} message={message} />
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;