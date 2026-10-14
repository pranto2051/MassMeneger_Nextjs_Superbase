'use client';

import React, { useState } from 'react';
import './globals.css';
import { MessProvider } from '@/context/MessContext';
import { UIFeedbackProvider } from '@/context/UIFeedbackContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="bn">
      <head>
        <title>Mess Management System — স্মার্ট মেস ম্যানেজার</title>
        <meta
          name="description"
          content="একটি আধুনিক ও স্বচ্ছ মেস ম্যানেজমেন্ট সিস্টেম — মিল ট্র্যাকিং, বাজার শিডিউল, জমা-খরচ এবং সঠিক মিল রেট হিসাব।"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <MessProvider>
          <UIFeedbackProvider>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <div className="main-content-canvas" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main
                  className="main-canvas-padding"
                  style={{
                    flex: 1,
                    maxWidth: '1440px',
                    width: '100%',
                    margin: '0 auto',
                    minWidth: 0,
                  }}
                >
                  {children}
                </main>
              </div>
            </div>
          </UIFeedbackProvider>
        </MessProvider>
      </body>
    </html>
  );
}
