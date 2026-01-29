"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import QueryClientContextProvider from "./query-client-provider";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <QueryClientContextProvider>
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
    </QueryClientContextProvider>
  );
}
