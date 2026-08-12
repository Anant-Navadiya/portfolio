import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Callout from "@/components/articles/mdx/Callout";
import Figure from "@/components/articles/mdx/Figure";
import TermList from "@/components/articles/mdx/TermList";
import References from "@/components/articles/mdx/References";
const Heading = ({ as: Component, className, ...props }: React.HTMLAttributes<HTMLHeadingElement> & {
    as: "h1" | "h2" | "h3" | "h4";
}) => {
    return <Component className={cn("scroll-m-20 text-balance font-semibold tracking-tight text-foreground", className)} {...props}/>;
};
const components: MDXComponents = {
    Callout,
    Figure,
    TermList,
    References,
    h1: (props) => <Heading as="h1" className="mt-10 text-3xl leading-tight" {...props}/>,
    h2: (props) => <Heading as="h2" className="mt-12 border-t pt-8 text-2xl leading-tight" {...props}/>,
    h3: (props) => <Heading as="h3" className="mt-9 text-xl leading-snug" {...props}/>,
    h4: (props) => <Heading as="h4" className="mt-7 text-lg leading-snug" {...props}/>,
    p: (props) => <p className="my-5 text-pretty leading-8 text-muted-foreground" {...props}/>,
    a: ({ href = "", ...props }) => (<Link className="text-primary underline underline-offset-4" href={href} {...props}/>),
    ul: (props) => <ul className="my-6 list-disc space-y-2.5 pl-5 text-muted-foreground" {...props}/>,
    ol: (props) => <ol className="my-6 list-decimal space-y-2.5 pl-5 text-muted-foreground" {...props}/>,
    li: (props) => <li className="pl-1 leading-8" {...props}/>,
    blockquote: (props) => (<blockquote className="my-7 border-l-2 border-primary pl-4 leading-8 text-muted-foreground" {...props}/>),
    code: (props) => (<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground" {...props}/>),
    pre: (props) => (<pre className="my-7 overflow-x-auto rounded-md border bg-card p-4 text-sm leading-7" {...props}/>),
    table: (props) => (<div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props}/>
    </div>),
    th: (props) => <th className="border px-3 py-2 text-left font-medium" {...props}/>,
    td: (props) => <td className="border px-3 py-2 text-muted-foreground" {...props}/>,
};
export const useMDXComponents = (): MDXComponents => {
    return components;
};
