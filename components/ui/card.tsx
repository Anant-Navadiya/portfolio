import * as React from "react";
import { cn } from "@/lib/utils";
const Card = ({ className, ...props }: React.ComponentProps<"div">) => {
    return (<div data-slot="card" className={cn("flex flex-col gap-6 rounded-md border bg-card py-6 text-card-foreground shadow-sm", className)} {...props}/>);
};
const CardHeader = ({ className, ...props }: React.ComponentProps<"div">) => {
    return <div data-slot="card-header" className={cn("grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]", className)} {...props}/>;
};
const CardTitle = ({ className, ...props }: React.ComponentProps<"h2">) => {
    return (<h2 data-slot="card-title" className={cn("text-lg font-semibold tracking-tight", className)} {...props}/>);
};
const CardDescription = ({ className, ...props }: React.ComponentProps<"p">) => {
    return (<p data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} {...props}/>);
};
const CardContent = ({ className, ...props }: React.ComponentProps<"div">) => {
    return <div data-slot="card-content" className={cn("px-6", className)} {...props}/>;
};
const CardAction = ({ className, ...props }: React.ComponentProps<"div">) => { return <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props}/>; };
const CardFooter = ({ className, ...props }: React.ComponentProps<"div">) => { return <div data-slot="card-footer" className={cn("flex items-center px-6", className)} {...props}/>; };
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
