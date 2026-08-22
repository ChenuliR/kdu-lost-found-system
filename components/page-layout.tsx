import React from "react";
import { Separator } from "./ui/separator";

export default function PageLayout({
  title,
  subtitle,
  badge,
  separator=false,
  children,
}: {
  title?: string;
  subtitle?: string;
  badge?: React.ReactElement;
  separator?: boolean;
  children: React.ReactNode;
}) {
  return (
    <main className="space-y-8 w-full">
      {title && <div className="space-y-2">
        <h1 className="font-bold lg:text-3xl text-2xl">{title}</h1>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground/80 text-sm font-semibold">
            {subtitle}
          </p>
          {badge}
        </div>

        {separator && <Separator />}
      </div>}
      {children}
    </main>
  );
}
