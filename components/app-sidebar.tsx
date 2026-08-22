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
import { User } from "@supabase/supabase-js";
import { Box, Compass, ImageIcon } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";

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
          url: "",
          icon: Box,
        },
      ],
    },
  ],
};

type AuthUser = {
  user: User | null;
};

export default function AppSidebar({ user }: AuthUser) {
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
                    <SidebarMenuButton
                      isActive={pathname === item.url}
                      render={
                        <a href={item.url}>
                          <item.icon />
                          {item.title}
                        </a>
                      }
                    ></SidebarMenuButton>
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
