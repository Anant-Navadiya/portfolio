const PageHeader = ({ eyebrow = "Content management", title, description, action }: {
    eyebrow?: string;
    title: string;
    description: string;
    action?: React.ReactNode;
}) => {
    return <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b pb-6"><div className="space-y-1.5"><div className="flex items-center gap-2 text-xs text-muted-foreground"><span>Admin</span><span className="icon-[lucide--chevron-right] size-3"/><span>{eyebrow}</span></div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1><p className="max-w-2xl text-sm text-muted-foreground">{description}</p></div>{action ? <div className="flex items-center gap-2">{action}</div> : null}</div>;
};
export default PageHeader;
