import { cn } from "@/_lib/utils";
import { LoaderCircle } from "lucide-react";

export const Loader = ({ className }: { className?: string }) => {
  return <LoaderCircle className={cn("size-10 animate-spin", className)} />;
};
