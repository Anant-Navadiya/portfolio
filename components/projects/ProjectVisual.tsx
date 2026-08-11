import { cn } from "@/lib/utils";
const ProjectVisual = ({ project, className }: {
    project: {
        title: string;
        category: string;
        technologies: string[];
    };
    className?: string;
}) => {
    return (<div className={cn("relative isolate flex aspect-[16/10] overflow-hidden border bg-[radial-gradient(circle_at_20%_10%,color-mix(in_oklch,var(--primary)_25%,transparent),transparent_35%),linear-gradient(135deg,var(--card),var(--muted))] p-6", className)}>
      <div className="absolute -right-16 -top-16 size-52 rounded-full border border-primary/20"/>
      <div className="absolute -right-6 -top-6 size-32 rounded-full border border-primary/25"/>
      <div className="relative mt-auto space-y-3">
        <span className="inline-flex border border-primary/30 bg-background/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary backdrop-blur">{project.category}</span>
        <p className="max-w-md text-xl font-semibold leading-tight text-foreground sm:text-2xl">{project.title}</p>
        <div className="flex flex-wrap gap-1.5">{project.technologies.slice(0, 4).map((technology) => <span key={technology} className="bg-background/70 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">{technology}</span>)}</div>
      </div>
    </div>);
};
export default ProjectVisual;
