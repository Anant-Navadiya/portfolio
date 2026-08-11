import { promises as fs } from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, hasDatabaseUrl } from "@/db";
import { articlePosts, articlePostStats, articlePostTags, articleSubcategories } from "@/db/schema";
import { requireAdminUser } from "@/lib/supabase/server";
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const authorizeApi = async () => { const admin = await requireAdminUser(); if (!admin.ok)
    return Response.json({ error: admin.message }, { status: 401 }); if (!db || !hasDatabaseUrl())
    return Response.json({ error: "Database is not configured." }, { status: 503 }); };
export const text = (value: unknown) => { return typeof value === "string" ? value.trim() : ""; };
export const integer = (value: unknown) => { const parsed = Number.parseInt(String(value), 10); return Number.isFinite(parsed) ? parsed : 0; };
export const postFile = (slug: string) => { return path.join(process.cwd(), "content/articles/posts", `${slug}.mdx`); };
export const refreshAdmin = () => { revalidatePath("/admin"); revalidatePath("/admin/posts"); revalidatePath("/admin/categories"); revalidatePath("/admin/subcategories"); revalidatePath("/articles"); };
export const savePost = async (payload: Record<string, unknown>, currentSlug?: string) => {
    const database = db!;
    const slug = currentSlug ?? text(payload.slug);
    const title = text(payload.title);
    const description = text(payload.description);
    const categorySlug = text(payload.categorySlug);
    const subcategorySlug = text(payload.subcategorySlug) || null;
    const status = payload.status === "published" ? "published" : "draft";
    const content = text(payload.content);
    if (!slugPattern.test(slug))
        throw new Error("Use a lowercase kebab-case slug.");
    if (!title || !description || !categorySlug || !content)
        throw new Error("Title, description, category, and content are required.");
    if (subcategorySlug) {
        const sub = await database.select().from(articleSubcategories).where(eq(articleSubcategories.slug, subcategorySlug)).limit(1);
        if (sub[0]?.categorySlug !== categorySlug)
            throw new Error("The subcategory does not belong to this category.");
    }
    const publishedAt = text(payload.publishedAt) ? new Date(`${text(payload.publishedAt)}T00:00:00.000Z`) : status === "published" ? new Date() : null;
    const values = { title, description, categorySlug, subcategorySlug, status: status as "draft" | "published", publishedAt, pinned: payload.pinned === true, imageUrl: text(payload.imageUrl) || null, imageAlt: text(payload.imageAlt) || null, updatedAt: new Date() };
    if (currentSlug)
        await database.update(articlePosts).set(values).where(eq(articlePosts.slug, currentSlug));
    else
        await database.insert(articlePosts).values({ slug, ...values });
    const tags = Array.from(new Set(text(payload.tags).split(",").map((tag) => tag.trim().replace(/^#/, "").toLowerCase()).filter(Boolean)));
    await database.delete(articlePostTags).where(eq(articlePostTags.postSlug, slug));
    if (tags.length)
        await database.insert(articlePostTags).values(tags.map((tag) => ({ postSlug: slug, tag })));
    await database.insert(articlePostStats).values({ postSlug: slug }).onConflictDoNothing({ target: articlePostStats.postSlug });
    await fs.mkdir(path.dirname(postFile(slug)), { recursive: true });
    await fs.writeFile(postFile(slug), `${content}\n`, "utf8");
    refreshAdmin();
    return slug;
};
