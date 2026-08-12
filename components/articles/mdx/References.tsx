type ReferenceItem = {
    title: string;
    source: string;
    href: string;
    internal?: boolean;
};

const References = ({ items }: { items: ReferenceItem[] }) => (
    <div className="my-8 border-t pt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Further reading</p>
        <ul className="mt-4 space-y-3">
            {items.map((item) => (
                <li key={item.href} className="flex items-start gap-2 text-sm leading-6">
                    <span className={`icon-[lucide--${item.internal ? "arrow-right" : "external-link"}] mt-1 size-3.5 shrink-0 text-muted-foreground`} aria-hidden="true" />
                    <span>
                        <a href={item.href} target={item.internal ? undefined : "_blank"} rel={item.internal ? undefined : "noreferrer"} className="font-medium text-primary underline underline-offset-4">{item.title}</a>
                        <span className="text-muted-foreground"> — {item.source}</span>
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

export default References;
