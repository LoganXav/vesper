"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import QueryClientContextProvider from "./query-client-provider";
import { Toaster } from "sonner";

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
              className="absolute top-2 left-2 z-40"
            />
            {children}
            <Toaster position="top-right" />
          </div>
        </SidebarProvider>
      </SessionProvider>
    </QueryClientContextProvider>
  );
}
