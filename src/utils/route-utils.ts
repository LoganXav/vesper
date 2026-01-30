import { Routes } from "@/config/route-enums";

export const getActiveDocumentPathId = (pathname: string) => {
  return pathname && pathname !== Routes.HOME && pathname !== Routes.LIBRARY
    ? pathname.replace(Routes.HOME, "")
    : null;
};
