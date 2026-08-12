"use client";
import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
const Dialog = (props: React.ComponentProps<typeof DialogPrimitive.Root>) => {
    return <DialogPrimitive.Root data-slot="dialog" {...props}/>;
};
const DialogPortal = (props: React.ComponentProps<typeof DialogPrimitive.Portal>) => {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props}/>;
};
const DialogOverlay = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) => {
    return (<DialogPrimitive.Overlay data-slot="dialog-overlay" className={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)} {...props}/>);
};
const DialogContent = ({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) => {
    return (<DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content data-slot="dialog-content" className={cn("fixed left-1/2 top-28 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 border bg-popover text-popover-foreground shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className)} {...props}>
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>);
};
const DialogTitle = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) => {
    return <DialogPrimitive.Title data-slot="dialog-title" className={cn("sr-only", className)} {...props}/>;
};
const DialogDescription = ({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) => {
    return <DialogPrimitive.Description data-slot="dialog-description" className={cn("sr-only", className)} {...props}/>;
};
export { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle };
