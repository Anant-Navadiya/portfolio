import { cn } from "@/lib/utils";

type CalloutVariant = "note" | "tip" | "myth";

const variants: Record<CalloutVariant, { icon: string; label: string; classes: string }> = {
    note: { icon: "icon-[lucide--info]", label: "Note", classes: "border-primary/30 bg-primary/5" },
    tip: { icon: "icon-[lucide--lightbulb]", label: "Worth knowing", classes: "border-emerald-500/35 bg-emerald-500/[0.06]" },
    myth: { icon: "icon-[lucide--circle-x]", label: "Common misconception", classes: "border-destructive/35 bg-destructive/[0.06]" },
};

const Callout = ({ variant = "note", title, children }: {
    variant?: CalloutVariant;
    title?: string;
    children: React.ReactNode;
}) => {
    const config = variants[variant];
    return (
        <div className={cn("my-7 border px-5 py-4", config.classes)}>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <span className={cn(config.icon, "size-4 shrink-0")} aria-hidden="true" />
                {title ?? config.label}
            </div>
            <div className="mt-2 text-sm leading-7 text-muted-foreground [&_p]:my-0">{children}</div>
        </div>
    );
};

export default Callout;
