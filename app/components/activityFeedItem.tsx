// components/ActivityFeedItem.tsx
import React from 'react';

interface ActivityMessage {
  date: string;
  message: string;
}

const ActivityFeedItem: React.FC<{ message: ActivityMessage }> = ({ message }) => {
  return (
    <div className="mb-2 p-2 bg-gray-100 rounded shadow">
      <div className="text-xs text-green-500/50">{new Date(message.date).toLocaleString()}</div>
      <div className="text-xs text-green-500">{message.message}</div>
    </div>
  );
};

export default ActivityFeedItem;