import Image from "next/image";
import Link from "next/link";
import ArticleVisual from "@/components/articles/ArticleVisual";
import type { ArticlePostMetadata } from "@/content/articles/types";
type Category = {
    slug: string;
    label: string;
    subcategories: readonly {
        slug: string;
        label: string;
    }[];
};
const ArticleCard = ({ post, categories, featured = false }: {
    post: ArticlePostMetadata;
    categories: readonly Category[];
    featured?: boolean;
}) => {
    const category = categories.find((item) => item.slug === post.category);
    const subcategory = category?.subcategories.find((item) => item.slug === post.subcategory);
    const visual = post.image ? <Image src={post.image.url} alt={post.image.alt} width={1200} height={675} unoptimized className="aspect-[16/9] h-full w-full object-cover"/> : <ArticleVisual title={post.title} category={category?.label ?? post.category} tags={post.tags} className="h-full"/>;
    return <article className={featured ? "grid overflow-hidden border bg-card md:grid-cols-[1.1fr_1fr]" : "group grid border-b py-6 sm:grid-cols-[1fr_180px] sm:gap-6"}>{featured ? <Link href={`/articles/${post.slug}`} className="block">{visual}</Link> : null}<div className={featured ? "flex flex-col p-5 sm:p-6" : "flex flex-col py-1"}><div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><time dateTime={post.date}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(post.date))}</time><span>·</span><span>{category?.label ?? post.category}</span>{subcategory && <><span>·</span><span>{subcategory.label}</span></>}<span>·</span><span>{post.readingTimeMinutes} min read</span></div><h3 className={featured ? "mt-3 text-2xl font-semibold tracking-tight" : "mt-2 text-xl font-semibold tracking-tight"}><Link href={`/articles/${post.slug}`} className="transition-colors hover:text-primary">{post.title}</Link></h3><p className="mt-3 line-clamp-3 text-sm leading-6">{post.description}</p><div className="mt-4 flex flex-wrap gap-2">{post.tags.slice(0, 4).map((tag) => <span key={tag} className="border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">{tag}</span>)}</div><Link href={`/articles/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">Read article <span aria-hidden>→</span></Link></div>{!featured ? <Link href={`/articles/${post.slug}`} className="order-first mb-4 block overflow-hidden sm:order-last sm:mb-0">{visual}</Link> : null}</article>;
};
export default ArticleCard;
