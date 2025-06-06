"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import FileDrop from "./file-drop"
import LoginButton from "./loginbutton";
import LogoutButton from "./logoutbutton";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/instructor",
    icon: Home,
  },
  // {
  //   title: "Import CSV",
  //   url: "#",
  //   icon: Inbox,
  // },
  
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Peer Assessment</SidebarGroupLabel>
          <SidebarGroupLabel>Welcome back</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <FileDrop/>
              <LoginButton/>
              <LogoutButton/>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
