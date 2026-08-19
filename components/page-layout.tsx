import React from "react";

export default function PageLayout({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
  return (
    <main className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold lg:text-3xl text-2xl">{title}</h1>
        <p className="text-muted-foreground/80 text-sm font-semibold">{subtitle}</p>
      </div>
      {children}
    </main>
  );
}
