import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import ArticleVisual from "@/components/articles/ArticleVisual";
import ArticleEngagement from "@/components/articles/ArticleEngagement";
import { Button } from "@/components/ui/button";
import Navbar from "@/layouts/components/navbar";
import { getArticleCategories, getArticlePost } from "@/lib/content/articles";
type ArticlePostPageProps = {
    params: Promise<{
        slug: string;
    }>;
};
export const generateMetadata = async ({ params }: ArticlePostPageProps): Promise<Metadata> => {
    const { slug } = await params;
    const post = await getArticlePost(slug);
    if (!post) {
        return {
            title: "Articles | Anant Navadiya",
        };
    }
    return {
        title: `${post.title} | Articles`,
        description: post.description,
    };
};
const ArticlePostPage = async ({ params }: ArticlePostPageProps) => {
    await connection();
    const { slug } = await params;
    const [post, categories] = await Promise.all([getArticlePost(slug), getArticleCategories()]);
    if (!post) {
        notFound();
    }
    const category = categories.find((item) => item.slug === post.category);
    const subcategory = category?.subcategories.find((item) => item.slug === post.subcategory);
    const Content = post.Component;
    return (<>
      <Navbar />

      <main className="article-reading-surface my-10">
        <article className="article-post">
          <header className="article-reading-header mb-10 border-b pb-10">
            <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-primary hover:underline"><span aria-hidden>←</span> All articles</Link>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span>{category?.label ?? post.category}</span>
              {subcategory ? <><span>·</span><span>{subcategory.label}</span></> : null}
            </div>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
            <p className="mt-5 text-lg leading-8">{post.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <time dateTime={post.date}>
                {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(post.date))}
              </time>
              <span>·</span>
              <ArticleEngagement slug={post.slug} initialViews={post.views} initialUsefulCount={post.usefulCount}/>
            </div>
            {post.tags.length > 0 ? <div className="mt-5 flex flex-wrap gap-2">{post.tags.map((tag) => <span key={tag} className="border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">{tag}</span>)}</div> : null}
            {post.image ? (<Image src={post.image.url} alt={post.image.alt} width={1200} height={675} unoptimized className="mt-8 aspect-video w-full border object-cover"/>) : <ArticleVisual title={post.title} category={category?.label ?? post.category} tags={post.tags} className="mt-8"/>}
          </header>

          <div className="mdx-content">
            <Content />
          </div>
          <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
            <div><p className="text-sm font-medium text-foreground">Continue exploring</p><p className="text-sm">Browse more technical notes and experiments.</p></div>
            <Button asChild variant="outline"><Link href="/articles">All articles</Link></Button>
          </footer>
        </article>
      </main>
    </>);
};
export default ArticlePostPage;
