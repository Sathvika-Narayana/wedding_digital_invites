import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 md:p-8 shadow-xl border border-white/20 backdrop-blur-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
