"use client";

import React from "react";
import { CircleOffIcon, CircleX } from "lucide-react";
import { toast } from "sonner";
import { Loader } from "../ui/loader";

interface LoadingContentProps {
  children: React.ReactNode;
  data?: any;
  loading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  retry?: () => Promise<any>;
  shouldLoad?: boolean;
}

export const LoadingContent: React.FC<LoadingContentProps> = ({
  children,
  data = [],
  loading = false,
  emptyMessage = "No data found.",
  error = null,
  retry = () => Promise.resolve(),
  shouldLoad = true,
}) => {
  React.useEffect(() => {
    if (shouldLoad && error) {
      toast.error(error?.message || "Something went wrong.");
    }
  }, [error, shouldLoad]);

  if (loading)
    return (
      <div className="w-full h-full flex justify-center items-center p-8">
        <Loader className="size-4" />
      </div>
    );

  if (!loading && !data?.data?.length)
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <div className="flex flex-col items-center space-y-2">
          <CircleOffIcon className="size-4" />
          <p className="text-center">{emptyMessage}</p>
        </div>
      </div>
    );

  if ((shouldLoad && error) || (!loading && !data)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <div className="flex flex-col items-center space-y-2">
          <CircleX className="size-4" />
          <p className="text-center">
            {error?.message || "Something went wrong."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
