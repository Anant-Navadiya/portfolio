const Figure = ({ label, caption, children }: {
    label?: string;
    caption?: string;
    children: React.ReactNode;
}) => (
    <figure className="my-8 border bg-card p-5 sm:p-7">
        {children}
        {caption ? (
            <figcaption className="mt-5 border-t pt-4 text-center text-sm leading-6 text-muted-foreground">
                {label ? <span className="mr-1.5 font-mono text-xs uppercase tracking-wider text-primary">{label}</span> : null}
                {caption}
            </figcaption>
        ) : null}
    </figure>
);

export default Figure;
