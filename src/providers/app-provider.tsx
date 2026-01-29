"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SessionProvider>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <AppSidebar />
        <div className="w-full relative h-screen">
          <SidebarTrigger
            onClick={() => setOpen(!open)}
            className="absolute top-2 left-2 z-50"
          />
          {children}
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
