"use client";
import * as React from "react";
import { Slot } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
type SidebarContextValue = {
    state: "expanded" | "collapsed";
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    toggleSidebar: () => void;
};
const SidebarContext = React.createContext<SidebarContextValue | null>(null);
const useSidebar = () => {
    const context = React.useContext(SidebarContext);
    if (!context)
        throw new Error("useSidebar must be used within a SidebarProvider.");
    return context;
};
const SidebarProvider = ({ defaultOpen = true, children, className, ...props }: React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
}) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const [openMobile, setOpenMobile] = React.useState(false);
    const toggleSidebar = React.useCallback(() => {
        if (window.matchMedia("(max-width: 767px)").matches)
            setOpenMobile((value) => !value);
        else
            setOpen((value) => !value);
    }, []);
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);
    const value = React.useMemo(() => ({ state: open ? "expanded" as const : "collapsed" as const, open, setOpen, openMobile, setOpenMobile, toggleSidebar }), [open, openMobile, toggleSidebar]);
    return <SidebarContext.Provider value={value}><div data-slot="sidebar-wrapper" style={{ "--sidebar-width": "15rem", "--sidebar-width-icon": "3.5rem" } as React.CSSProperties} className={cn("group/sidebar-wrapper flex min-h-svh w-full bg-sidebar", className)} {...props}>{children}</div></SidebarContext.Provider>;
};
const Sidebar = ({ children, className, collapsible = "icon", ...props }: React.ComponentProps<"div"> & {
    collapsible?: "icon" | "offcanvas" | "none";
}) => {
    const { state, openMobile, setOpenMobile } = useSidebar();
    return <>
    {openMobile && <button type="button" aria-label="Close sidebar" onClick={() => setOpenMobile(false)} className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[1px] md:hidden"/>}
    <aside data-slot="sidebar" data-state={state} data-collapsible={state === "collapsed" ? collapsible : ""} className={cn("group fixed inset-y-0 left-0 z-50 flex w-(--sidebar-width) flex-col border-r bg-sidebar text-sidebar-foreground transition-[width,transform] duration-200 ease-linear md:sticky md:z-10", openMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0", state === "collapsed" && collapsible === "icon" && "md:w-(--sidebar-width-icon)", className)} {...props}>{children}</aside>
  </>;
};
const SidebarTrigger = ({ className, ...props }: React.ComponentProps<typeof Button>) => {
    const { toggleSidebar } = useSidebar();
    return <Button data-slot="sidebar-trigger" variant="ghost" size="icon-sm" className={className} onClick={toggleSidebar} {...props}><span className="icon-[lucide--panel-left] size-4"/><span className="sr-only">Toggle sidebar</span></Button>;
};
const SidebarInset = ({ className, ...props }: React.ComponentProps<"main">) => { return <main data-slot="sidebar-inset" className={cn("relative min-w-0 flex-1 bg-background", className)} {...props}/>; };
const SidebarHeader = ({ className, ...props }: React.ComponentProps<"div">) => { return <div data-slot="sidebar-header" className={cn("flex flex-col gap-2 p-3", className)} {...props}/>; };
const SidebarContent = ({ className, ...props }: React.ComponentProps<"div">) => { return <div data-slot="sidebar-content" className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)} {...props}/>; };
const SidebarFooter = ({ className, ...props }: React.ComponentProps<"div">) => { return <div data-slot="sidebar-footer" className={cn("flex flex-col gap-2 border-t p-3", className)} {...props}/>; };
const SidebarGroup = ({ className, ...props }: React.ComponentProps<"div">) => { return <div data-slot="sidebar-group" className={cn("flex w-full min-w-0 flex-col p-2", className)} {...props}/>; };
const SidebarGroupLabel = ({ className, ...props }: React.ComponentProps<"div">) => { return <div data-slot="sidebar-group-label" className={cn("flex h-8 items-center px-2 text-xs font-medium text-sidebar-foreground/60 transition-[margin,opacity] group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className)} {...props}/>; };
const SidebarMenu = ({ className, ...props }: React.ComponentProps<"ul">) => { return <ul data-slot="sidebar-menu" className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props}/>; };
const SidebarMenuItem = ({ className, ...props }: React.ComponentProps<"li">) => { return <li data-slot="sidebar-menu-item" className={cn("relative", className)} {...props}/>; };
const SidebarMenuButton = ({ asChild = false, isActive = false, tooltip, className, ...props }: React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string;
}) => {
    const Comp = asChild ? Slot.Root : "button";
    const { state, setOpenMobile } = useSidebar();
    const button = <Comp data-slot="sidebar-menu-button" data-active={isActive} onClick={() => setOpenMobile(false)} className={cn("flex h-9 w-full items-center gap-3 overflow-hidden px-2.5 text-left text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring data-[active=true]:bg-sidebar-primary data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 [&>span:last-child]:truncate", className)} {...props}/>;
    if (!tooltip)
        return button;
    return <Tooltip><TooltipTrigger asChild>{button}</TooltipTrigger><TooltipContent side="right" hidden={state !== "collapsed"}>{tooltip}</TooltipContent></Tooltip>;
};
const SidebarRail = ({ className, ...props }: React.ComponentProps<"button">) => {
    const { toggleSidebar } = useSidebar();
    return <button data-slot="sidebar-rail" aria-label="Toggle sidebar" title="Toggle sidebar" tabIndex={-1} onClick={toggleSidebar} className={cn("absolute inset-y-0 -right-2 hidden w-4 after:absolute after:inset-y-0 after:left-1/2 after:w-px hover:after:bg-sidebar-border md:block", className)} {...props}/>;
};
export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger, useSidebar };
