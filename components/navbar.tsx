import { getUnreadNotificationCount } from "@/app/(authenticated)/claims/actions";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export default async function Navbar() {
  const unreadCount = await getUnreadNotificationCount();

  return (
    <nav className="p-2 flex items-center justify-left border-b border-primary-background bg-primary-foreground sticky top-0 z-50">
      <SidebarTrigger className="cursor-pointer" />
      <Button
        variant="outline"
        size="icon-sm"
        className="fixed right-14 top-2 cursor-pointer"
        nativeButton={false}
        render={<Link href="/notifications" />}
        aria-label="Notifications"
      >
        <Bell />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Button>
    </nav>
  );
}
