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
import { Box, Compass, ImageIcon, List, ShieldCheck, Tags } from "lucide-react";
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
          url: "/posts/my-posts",
          icon: ImageIcon,
        },
        {
          title: "My Claims",
          url: "/claims/my-claims",
          icon: Box,
        },
      ],
    },
  ],
};

type AuthUser = {
  user: User | null;
  isAdmin?: boolean;
};

export default function AppSidebar({ user, isAdmin = false }: AuthUser) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <a href={"/"}>
              <SidebarMenuButton
                size={"lg"}
                className="overflow-hidden rounded-xs cursor-pointer"
              >
                <Image
                  src={"/logo.svg"}
                  alt="logo"
                  width={26}
                  height={26}
                  priority
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
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname === "/admin"}
                    render={
                      <a href="/admin">
                        <ShieldCheck />
                        Admin Dashboard
                      </a>
                    }
                  ></SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname.startsWith("/admin/categories")}
                    render={
                      <a href="/admin/categories">
                        <Tags />
                        Categories
                      </a>
                    }
                  ></SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={pathname.startsWith("/admin/posts")}
                    render={
                      <a href="/admin/posts">
                        <List />
                        All Posts
                      </a>
                    }
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
