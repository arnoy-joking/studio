import { Header } from "@/components/dashboard/header";
import { SideNav } from "@/components/dashboard/side-nav";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SideNav />
      </Sidebar>
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
