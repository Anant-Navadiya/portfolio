type Term = {
    term: string;
    definition: string;
};

const TermList = ({ title = "Plain-language glossary", terms }: {
    title?: string;
    terms: Term[];
}) => (
    <div className="my-8 border">
        <p className="border-b bg-muted/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">{title}</p>
        <dl className="divide-y">
            {terms.map((item) => (
                <div key={item.term} className="grid gap-1 px-4 py-4 sm:grid-cols-[10rem_1fr] sm:gap-5 sm:px-5">
                    <dt className="font-mono text-sm font-medium text-primary">{item.term}</dt>
                    <dd className="text-sm leading-7 text-muted-foreground">{item.definition}</dd>
                </div>
            ))}
        </dl>
    </div>
);

export default TermList;
