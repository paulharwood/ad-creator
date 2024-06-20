"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ActivityFeedProvider } from '../lib/context/ActivityFeedContext';


export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
      <ActivityFeedProvider>
        <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex flex-1">
              <div className="flex-1 mx-auto max-w-full p-4 md:p-6 2xl:p-10">
              {children}
              </div>
              <div className="w-80 bg-gray-100 p-4">
              </div>
            </main>
          </div>
        </div>
      </ActivityFeedProvider>

  );
}