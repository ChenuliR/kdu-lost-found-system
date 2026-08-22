"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import { Box, ChevronsUpDown, CircleUser, Compass, ImageIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NavUser } from "./nav-user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const data = {
  navMain: [
    {
      title: "Application",
      items: [
        {
          title: "Browse",
          url: "/",
          icon: Compass,
        },
        {
          title: "My Posts",
          url: "/posts",
          icon: ImageIcon,
        },
        {
          title: "My Claims",
          url: "*",
          icon: Box,
        },
      ],
    },
  ],
};

type AuthUser = {
  user: User | null;
};

export default function AppSidebar(
  { user }: AuthUser,
) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <a href={"/"}>
              <SidebarMenuButton
                size={"lg"}
                className="overflow-hidden rounded-xs"
              >
                <Image
                  src={"/logo.svg"}
                  alt="logo"
                  width={28}
                  height={28}
                  className="rounded-xs"
                />
                <span className="text-lg font-bold">Lost & Found</span>
              </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={pathname === item.url}>
                      <item.icon />
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
