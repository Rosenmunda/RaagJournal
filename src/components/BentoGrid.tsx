import React from "react";
import { cn } from "@/lib/utils";

export function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]", className)}>
      {children}
    </div>
  );
}
