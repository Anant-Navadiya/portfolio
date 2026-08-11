import { cn } from "@/lib/utils";
const ArticleVisual = ({ title, category, tags, className }: {
    title: string;
    category: string;
    tags: string[];
    className?: string;
}) => {
    return <div className={cn("relative isolate flex aspect-[16/9] overflow-hidden border bg-[radial-gradient(circle_at_82%_18%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_32%),linear-gradient(145deg,var(--card),var(--muted))] p-5", className)}><div className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Notes / {category}</div><div className="absolute -bottom-20 -right-12 size-64 rounded-full border border-primary/15"/><div className="absolute -bottom-8 right-4 size-40 rounded-full border border-primary/20"/><div className="relative mt-auto"><p className="max-w-lg text-xl font-semibold leading-tight text-foreground sm:text-2xl">{title}</p>{tags.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{tags.slice(0, 3).map((tag) => <span key={tag} className="font-mono text-[10px] text-muted-foreground">#{tag}</span>)}</div>}</div></div>;
};
export default ArticleVisual;
