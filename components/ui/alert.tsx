import * as React from "react";
import { cn } from "@/lib/utils";
const Alert = ({ className, ...props }: React.ComponentProps<"div">) => { return <div role="alert" data-slot="alert" className={cn("relative grid w-full grid-cols-[0_1fr] gap-y-1 border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5", className)} {...props}/>; };
const AlertTitle = ({ className, ...props }: React.ComponentProps<"div">) => { return <div data-slot="alert-title" className={cn("col-start-2 font-medium leading-none", className)} {...props}/>; };
const AlertDescription = ({ className, ...props }: React.ComponentProps<"div">) => { return <div data-slot="alert-description" className={cn("col-start-2 text-sm text-muted-foreground", className)} {...props}/>; };
export { Alert, AlertDescription, AlertTitle };
