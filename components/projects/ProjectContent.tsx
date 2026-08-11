import { cn } from "@/lib/utils";
export const ProjectCallout = ({ title, children }: {
    title: string;
    children: React.ReactNode;
}) => { return <aside className="my-8 border-l-2 border-primary bg-muted/40 p-5"><p className="mb-2 text-sm font-semibold text-foreground">{title}</p><div className="text-sm leading-7 text-muted-foreground">{children}</div></aside>; };
export const ProjectMetrics = ({ children }: {
    children: React.ReactNode;
}) => { return <div className="my-8 grid gap-3 sm:grid-cols-3">{children}</div>; };
export const ProjectMetric = ({ value, label, detail }: {
    value: string;
    label: string;
    detail: string;
}) => { return <div className="border bg-card p-4"><p className="text-2xl font-semibold text-primary">{value}</p><p className="mt-1 text-sm font-medium text-foreground">{label}</p><p className="mt-2 text-xs leading-5">{detail}</p></div>; };
export const ProjectGallery = ({ items }: {
    items: {
        eyebrow: string;
        title: string;
        description: string;
    }[];
}) => { return <div className="my-8 grid gap-3">{items.map((item, index) => <div key={item.title} className="grid gap-3 border bg-card p-5 sm:grid-cols-[40px_1fr]"><span className="font-mono text-sm text-primary">0{index + 1}</span><div><p className="text-xs font-semibold uppercase tracking-wider text-primary">{item.eyebrow}</p><p className="mt-1 font-semibold text-foreground">{item.title}</p><p className="mt-2 text-sm leading-6">{item.description}</p></div></div>)}</div>; };
export const ProjectDecision = ({ title, tradeoff, children, className }: {
    title: string;
    tradeoff: string;
    children: React.ReactNode;
    className?: string;
}) => { return <section className={cn("my-6 border bg-card p-5", className)}><h3 className="mt-0 text-base font-semibold">{title}</h3><div className="text-sm leading-7 text-muted-foreground">{children}</div><p className="mt-4 border-t pt-3 text-xs leading-5"><strong className="text-foreground">Trade-off:</strong> {tradeoff}</p></section>; };
