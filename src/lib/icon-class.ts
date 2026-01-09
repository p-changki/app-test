import { cn } from "./utils";

export const iconClass = (extra?: string, filled?: boolean) =>
  cn("material-symbols-outlined", filled ? "icon-filled" : undefined, extra);
