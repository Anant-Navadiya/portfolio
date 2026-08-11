import * as React from "react";
import { cn } from "@/lib/utils";
const Input = ({ className, type, ...props }: React.ComponentProps<"input">) => {
    return (<input data-slot="input" type={type} className={cn("h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm transition-colors outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20", className)} {...props}/>);
};
export { Input };
