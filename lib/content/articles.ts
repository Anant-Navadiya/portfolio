import { asc, desc, eq } from "drizzle-orm";
import type { ComponentType } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { ArticlePost, ArticlePostMetadata } from "@/content/articles/types";
import { db, hasDatabaseUrl } from "@/db";
import { articleCategories, articlePosts, articlePostStats, articlePostTags, articleSubcategories, } from "@/db/schema";
export type ArticleFilterCategory = {
    slug: string;
    label: string;
    subcategories: {
        slug: string;
        label: string;
    }[];
};
export type AdminArticlePost = ArticlePostMetadata & {
    status: "draft" | "published";
    updatedAt: string;
    hasContent: boolean;
};
const articleSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const wordsPerMinute = 200;
const formatPostDate = (value: Date | null) => {
    return value?.toISOString().slice(0, 10) ?? "";
};
const estimateReadingTimeMinutes = async (slug: string): Promise<number> => {
    if (!articleSlugPattern.test(slug)) {
        return 1;
    }
    try {
        const raw = await fs.readFile(path.join(process.cwd(), "content/articles/posts", `${slug}.mdx`), "utf8");
        const text = raw
            .replace(/^import .*$/gm, " ")
            .replace(/<[^>]+>/g, " ")
            .replace(/[{}`*_#>[\]()]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        const words = text ? text.split(" ").length : 0;
        return Math.max(1, Math.round(words / wordsPerMinute));
    }
    catch {
        return 1;
    }
};
const loadArticleComponent = async (slug: string): Promise<ComponentType | undefined> => {
    if (!articleSlugPattern.test(slug)) {
        return undefined;
    }
    try {
        const content = await import(`@/content/articles/posts/${slug}.mdx`);
        return content.default;
    }
    catch {
        return undefined;
    }
};
const getTagsByPostSlug = async (slugs: string[]) => {
    if (!db || slugs.length === 0) {
        return new Map<string, string[]>();
    }
    const tags = await db
        .select({
        postSlug: articlePostTags.postSlug,
        tag: articlePostTags.tag,
    })
        .from(articlePostTags)
        .orderBy(asc(articlePostTags.tag));
    return tags.reduce((map, tag) => {
        if (!slugs.includes(tag.postSlug)) {
            return map;
        }
        map.set(tag.postSlug, [...(map.get(tag.postSlug) ?? []), tag.tag]);
        return map;
    }, new Map<string, string[]>());
};
const toMetadata = (post: typeof articlePosts.$inferSelect, tags: string[], stats: typeof articlePostStats.$inferSelect | null | undefined, readingTimeMinutes: number): ArticlePostMetadata => {
    return {
        title: post.title,
        slug: post.slug,
        description: post.description,
        date: formatPostDate(post.publishedAt),
        category: post.categorySlug,
        subcategory: post.subcategorySlug,
        tags,
        pinned: post.pinned,
        views: stats?.views ?? 0,
        usefulCount: stats?.usefulCount ?? 0,
        readingTimeMinutes,
        image: post.imageUrl
            ? {
                url: post.imageUrl,
                alt: post.imageAlt ?? "",
            }
            : undefined,
    };
};
export const getArticleCategories = async (): Promise<ArticleFilterCategory[]> => {
    if (!db || !hasDatabaseUrl()) {
        return [];
    }
    const [categories, subcategories] = await Promise.all([
        db
            .select({
            slug: articleCategories.slug,
            label: articleCategories.label,
        })
            .from(articleCategories)
            .orderBy(asc(articleCategories.sortOrder), asc(articleCategories.label)),
        db
            .select({
            slug: articleSubcategories.slug,
            categorySlug: articleSubcategories.categorySlug,
            label: articleSubcategories.label,
        })
            .from(articleSubcategories)
            .orderBy(asc(articleSubcategories.sortOrder), asc(articleSubcategories.label)),
    ]);
    return categories.map((category) => ({
        slug: category.slug,
        label: category.label,
        subcategories: subcategories
            .filter((subcategory) => subcategory.categorySlug === category.slug)
            .map((subcategory) => ({
            slug: subcategory.slug,
            label: subcategory.label,
        })),
    }));
};
export const getAllArticlePosts = async (): Promise<ArticlePostMetadata[]> => {
    if (!db || !hasDatabaseUrl()) {
        return [];
    }
    const rows = await db
        .select({
        post: articlePosts,
        stats: articlePostStats,
    })
        .from(articlePosts)
        .leftJoin(articlePostStats, eq(articlePostStats.postSlug, articlePosts.slug))
        .where(eq(articlePosts.status, "published"))
        .orderBy(desc(articlePosts.pinned), desc(articlePosts.publishedAt), desc(articlePosts.updatedAt));
    const slugs = rows.map(({ post }) => post.slug);
    const tagsByPostSlug = await getTagsByPostSlug(slugs);
    const rowsWithContent = await Promise.all(rows.map(async (row) => ({
        ...row,
        hasContent: Boolean(await loadArticleComponent(row.post.slug)),
        readingTimeMinutes: await estimateReadingTimeMinutes(row.post.slug),
    })));
    return rowsWithContent
        .filter(({ hasContent }) => hasContent)
        .map(({ post, stats, readingTimeMinutes }) => toMetadata(post, tagsByPostSlug.get(post.slug) ?? [], stats, readingTimeMinutes));
};
export const getAdminArticlePosts = async (): Promise<AdminArticlePost[]> => {
    if (!db || !hasDatabaseUrl()) {
        return [];
    }
    const rows = await db
        .select({
        post: articlePosts,
        stats: articlePostStats,
    })
        .from(articlePosts)
        .leftJoin(articlePostStats, eq(articlePostStats.postSlug, articlePosts.slug))
        .orderBy(desc(articlePosts.updatedAt), desc(articlePosts.publishedAt));
    const slugs = rows.map(({ post }) => post.slug);
    const tagsByPostSlug = await getTagsByPostSlug(slugs);
    const rowsWithContent = await Promise.all(rows.map(async (row) => ({
        ...row,
        hasContent: Boolean(await loadArticleComponent(row.post.slug)),
        readingTimeMinutes: await estimateReadingTimeMinutes(row.post.slug),
    })));
    return rowsWithContent.map(({ post, stats, hasContent, readingTimeMinutes }) => ({
        ...toMetadata(post, tagsByPostSlug.get(post.slug) ?? [], stats, readingTimeMinutes),
        status: post.status,
        updatedAt: post.updatedAt.toISOString(),
        hasContent,
    }));
};
export const getAdminPostEditor = async (slug: string) => {
    if (!db || !hasDatabaseUrl() || !articleSlugPattern.test(slug))
        return undefined;
    const rows = await db.select().from(articlePosts).where(eq(articlePosts.slug, slug)).limit(1);
    const post = rows[0];
    if (!post)
        return undefined;
    const tags = await getTagsByPostSlug([slug]).then((map) => map.get(slug) ?? []);
    let content = "";
    try {
        content = await fs.readFile(path.join(process.cwd(), "content/articles/posts", `${slug}.mdx`), "utf8");
    }
    catch { }
    return { slug: post.slug, title: post.title, description: post.description, status: post.status, categorySlug: post.categorySlug, subcategorySlug: post.subcategorySlug ?? "", publishedAt: formatPostDate(post.publishedAt), imageUrl: post.imageUrl ?? "", imageAlt: post.imageAlt ?? "", tags: tags.join(", "), content, pinned: post.pinned };
};
export const getRelatedArticlePosts = (current: ArticlePostMetadata, allPosts: ArticlePostMetadata[], limit = 3): ArticlePostMetadata[] => {
    const currentTags = new Set(current.tags);
    return allPosts
        .filter((post) => post.slug !== current.slug)
        .map((post) => {
            const sharedTags = post.tags.filter((tag) => currentTags.has(tag)).length;
            const sameSubcategory = post.subcategory && post.subcategory === current.subcategory ? 2 : 0;
            const sameCategory = post.category === current.category ? 1 : 0;
            return { post, score: sharedTags * 3 + sameSubcategory + sameCategory };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || (b.post.date > a.post.date ? 1 : -1))
        .slice(0, limit)
        .map(({ post }) => post);
};
export const getArticlePost = async (slug: string): Promise<ArticlePost | undefined> => {
    if (!db || !hasDatabaseUrl()) {
        return undefined;
    }
    const Component = await loadArticleComponent(slug);
    if (!Component) {
        return undefined;
    }
    const rows = await db
        .select({
        post: articlePosts,
        stats: articlePostStats,
    })
        .from(articlePosts)
        .leftJoin(articlePostStats, eq(articlePostStats.postSlug, articlePosts.slug))
        .where(eq(articlePosts.slug, slug))
        .limit(1);
    const row = rows[0];
    if (!row || row.post.status !== "published") {
        return undefined;
    }
    const tags = await getTagsByPostSlug([slug]).then((map) => map.get(slug) ?? []);
    const readingTimeMinutes = await estimateReadingTimeMinutes(slug);
    return {
        ...toMetadata(row.post, tags, row.stats, readingTimeMinutes),
        Component,
    };
};
