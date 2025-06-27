import { Header } from "@/components/dashboard/header";
import { SideNav } from "@/components/dashboard/side-nav";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { UserProvider } from "@/context/user-context";
import { getUsers } from "@/lib/users";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  return (
    <UserProvider initialUsers={users}>
      <SidebarProvider>
        <Sidebar>
          <SideNav />
        </Sidebar>
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
