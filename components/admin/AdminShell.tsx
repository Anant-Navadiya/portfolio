"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
const navigation = [
    { href: "/admin", label: "Overview", icon: "icon-[lucide--layout-dashboard]" },
    { href: "/admin/contacts", label: "Inbox", icon: "icon-[lucide--inbox]" },
    { href: "/admin/posts", label: "Posts", icon: "icon-[lucide--files]" },
    { href: "/admin/categories", label: "Categories", icon: "icon-[lucide--folder-tree]" },
    { href: "/admin/subcategories", label: "Subcategories", icon: "icon-[lucide--list-tree]" },
];
const AdminShell = ({ children, email }: {
    children: React.ReactNode;
    email: string;
}) => {
    const pathname = usePathname();
    return <div className="relative left-1/2 min-h-screen w-screen -translate-x-1/2"><SidebarProvider><Sidebar collapsible="icon"><SidebarHeader className="h-16 justify-center border-b"><div className="flex items-center gap-3 overflow-hidden px-1"><span className="grid size-8 shrink-0 place-items-center bg-sidebar-primary text-sidebar-primary-foreground"><span className="icon-[lucide--command] size-4"/></span><div className="min-w-0 leading-tight group-data-[collapsible=icon]:hidden"><p className="truncate text-sm font-semibold text-sidebar-foreground">Anant Studio</p><p className="truncate text-xs text-sidebar-foreground/60">Content admin</p></div></div></SidebarHeader><SidebarContent><SidebarGroup><SidebarGroupLabel>Workspace</SidebarGroupLabel><SidebarMenu>{navigation.map((item) => { const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href); return <SidebarMenuItem key={item.href}><SidebarMenuButton asChild isActive={active} tooltip={item.label}><Link href={item.href}><span className={`${item.icon} size-4 shrink-0`}/><span>{item.label}</span></Link></SidebarMenuButton></SidebarMenuItem>; })}</SidebarMenu></SidebarGroup></SidebarContent><SidebarFooter><div className="flex items-center gap-3 overflow-hidden px-1"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">{email.slice(0, 1).toUpperCase()}</span><div className="min-w-0 group-data-[collapsible=icon]:hidden"><p className="truncate text-xs font-medium text-sidebar-foreground">{email}</p><p className="text-xs text-sidebar-foreground/60">Administrator</p></div></div></SidebarFooter><SidebarRail /></Sidebar><SidebarInset><header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur sm:px-8"><SidebarTrigger /><Separator orientation="vertical" className="h-5"/><p className="hidden text-sm font-medium text-foreground sm:block">Content management</p><div className="ml-auto flex items-center gap-2"><Button asChild variant="ghost" size="sm"><Link href="/articles"><span className="icon-[lucide--external-link] size-4"/>View site</Link></Button><form action={logoutAdmin}><Button variant="outline" size="sm"><span className="icon-[lucide--log-out] size-4"/><span className="hidden sm:inline">Sign out</span></Button></form></div></header><div className="p-4 sm:p-8">{children}</div></SidebarInset></SidebarProvider></div>;
};
export default AdminShell;
