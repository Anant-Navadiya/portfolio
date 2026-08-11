"use client";
import { useMemo, useState } from "react";
import ArticleCard from "@/components/articles/ArticleCard";
import type { ArticlePostMetadata } from "@/content/articles/types";
type FilterCategory = {
    slug: string;
    label: string;
    subcategories: readonly {
        slug: string;
        label: string;
    }[];
};
type Props = {
    categories: readonly FilterCategory[];
    posts: ArticlePostMetadata[];
};
const ArticlePostFilters = ({ categories, posts }: Props) => {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [subcategory, setSubcategory] = useState("all");
    const subcategories = useMemo(() => category === "all"
        ? categories.flatMap((item) => item.subcategories)
        : categories.find((item) => item.slug === category)?.subcategories ?? [], [categories, category]);
    const filteredPosts = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        return posts.filter((post) => {
            const postCategory = categories.find((item) => item.slug === post.category);
            const postSubcategory = postCategory?.subcategories.find((item) => item.slug === post.subcategory);
            const searchableText = [
                post.title,
                post.description,
                postCategory?.label,
                postSubcategory?.label,
                ...post.tags,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return ((!normalizedQuery || searchableText.includes(normalizedQuery)) &&
                (category === "all" || post.category === category) &&
                (subcategory === "all" || post.subcategory === subcategory));
        });
    }, [categories, category, posts, query, subcategory]);
    const filtersActive = Boolean(query.trim()) || category !== "all" || subcategory !== "all";
    const featured = !filtersActive
        ? filteredPosts.find((post) => post.pinned) ?? filteredPosts[0]
        : undefined;
    const remaining = featured
        ? filteredPosts.filter((post) => post.slug !== featured.slug)
        : filteredPosts;
    const inputClass = "h-9 w-full border bg-background px-3 text-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50";
    const reset = () => {
        setQuery("");
        setCategory("all");
        setSubcategory("all");
    };
    return (<section className="space-y-10">
      <div className="border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
            Search and filter
          </p>
          {filtersActive ? (<button type="button" onClick={reset} className="text-xs font-medium text-primary hover:underline">
              Clear filters
            </button>) : null}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <label className="relative sm:col-span-2 lg:col-span-1">
            <span className="sr-only">Search articles</span>
            <span className="icon-[lucide--search] pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true"/>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles, topics, or tags…" className={`${inputClass} pl-9`}/>
          </label>

          <label>
            <span className="sr-only">Category</span>
            <select value={category} onChange={(event) => {
            setCategory(event.target.value);
            setSubcategory("all");
        }} className={inputClass}>
              <option value="all">All categories</option>
              {categories.map((item) => (<option key={item.slug} value={item.slug}>
                  {item.label}
                </option>))}
            </select>
          </label>

          <label>
            <span className="sr-only">Subcategory</span>
            <select value={subcategory} onChange={(event) => setSubcategory(event.target.value)} className={inputClass}>
              <option value="all">All subcategories</option>
              {subcategories.map((item) => (<option key={item.slug} value={item.slug}>
                  {item.label}
                </option>))}
            </select>
          </label>
        </div>
      </div>

      {featured ? (<div className="space-y-4">
          <div className="flex items-end justify-between border-b pb-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                Featured read
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">Start here</h2>
            </div>
          </div>
          <ArticleCard post={featured} categories={categories} featured/>
        </div>) : null}

      <div>
        <div className="flex items-end justify-between border-b pb-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">Archive</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              {filtersActive ? "Search results" : "Latest notes"}
            </h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {remaining.length > 0 ? (<div>
            {remaining.map((post) => (<ArticleCard key={post.slug} post={post} categories={categories}/>))}
          </div>) : !featured ? (<div className="border-b py-10 text-center">
            <p className="text-sm">No articles match your search and filters.</p>
            <button type="button" onClick={reset} className="mt-3 text-sm font-medium text-primary hover:underline">
              Show all articles
            </button>
          </div>) : (<p className="border-b py-8 text-sm">More articles are coming soon.</p>)}
      </div>
    </section>);
};
export default ArticlePostFilters;
