"use client";
import "./css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "./components/common/Loader";
import DefaultLayout from "./layouts/DefaultLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : <DefaultLayout>{children}</DefaultLayout>}
          </div>
      </body>
    </html>
  );
}