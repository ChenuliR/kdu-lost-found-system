"use client";

import { markNotificationsAsRead } from "@/app/(authenticated)/claims/actions";
import { useEffect } from "react";

export function MarkNotificationsRead() {
  useEffect(() => {
    void markNotificationsAsRead();
  }, []);

  return null;
}