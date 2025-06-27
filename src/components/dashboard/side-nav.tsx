"use client";

import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Compass, LayoutDashboard, Settings, LifeBuoy } from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "#", label: "Settings", icon: Settings },
  { href: "#", label: "Help", icon: LifeBuoy },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 p-1">
          <Compass className="w-8 h-8 text-accent" />
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="font-bold text-lg text-sidebar-foreground">
              Course Compass
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="group-data-[collapsible=icon]:hidden text-xs text-center p-4 text-sidebar-foreground/60">
            &copy; {new Date().getFullYear()} Course Compass
        </div>
      </SidebarFooter>
    </>
  );
}
