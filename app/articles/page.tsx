import type { Metadata } from "next";
import { connection } from "next/server";
import ArticlePostFilters from "@/components/articles/ArticlePostFilters";
import Navbar from "@/layouts/components/navbar";
import { getAllArticlePosts, getArticleCategories } from "@/lib/content/articles";
export const metadata: Metadata = {
    title: "Articles | Anant Navadiya",
    description: "Technical articles, AI explorations, implementation details, and experiments.",
};
const ArticlesPage = async () => {
    await connection();
    const [categories, posts] = await Promise.all([getArticleCategories(), getAllArticlePosts()]);
    return (<>
      <Navbar />

      <main className="my-10 space-y-12">
        <section className="space-y-4 border-b pb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Articles</p>
          <h1 className="text-4xl font-semibold tracking-tight">Ideas explained through implementation</h1>
          <p className="max-w-2xl">Technical writing on artificial intelligence, software architecture, and the practical details behind building modern products.</p>
        </section>

        <ArticlePostFilters categories={categories} posts={posts}/>
      </main>
    </>);
};
export default ArticlesPage;
