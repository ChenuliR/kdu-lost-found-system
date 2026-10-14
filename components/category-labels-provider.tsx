"use client";

import { createContext, useContext } from "react";

const CategoryLabelsContext = createContext<Record<string, string>>({});

export function CategoryLabelsProvider({
  labels,
  children,
}: {
  labels: Record<string, string>;
  children: React.ReactNode;
}) {
  return (
    <CategoryLabelsContext.Provider value={labels}>
      {children}
    </CategoryLabelsContext.Provider>
  );
}

export function useCategoryLabel() {
  const labels = useContext(CategoryLabelsContext);
  return (slug: string) => labels[slug] ?? slug;
}