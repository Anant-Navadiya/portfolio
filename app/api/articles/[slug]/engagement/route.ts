import { and, eq, sql } from "drizzle-orm";

import { db, hasDatabaseUrl } from "@/db";
import { articlePosts, articlePostStats } from "@/db/schema";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const engagementLimits = new Map<string, number>();

const getPublishedPost = async (slug: string) => db!.select({ slug: articlePosts.slug })
    .from(articlePosts)
    .where(and(eq(articlePosts.slug, slug), eq(articlePosts.status, "published")))
    .limit(1);

const getStats = async (slug: string) => {
    const rows = await db!.select({ views: articlePostStats.views, usefulCount: articlePostStats.usefulCount })
        .from(articlePostStats)
        .where(eq(articlePostStats.postSlug, slug))
        .limit(1);
    return rows[0] ?? { views: 0, usefulCount: 0 };
};

export const GET = async (_request: Request, { params }: { params: Promise<{ slug: string }> }) => {
    if (!db || !hasDatabaseUrl()) return Response.json({ error: "Article statistics are not configured." }, { status: 503 });
    const { slug } = await params;
    if (!slugPattern.test(slug) || !(await getPublishedPost(slug))[0]) return Response.json({ error: "Article not found." }, { status: 404 });
    return Response.json(await getStats(slug));
};

export const POST = async (request: Request, { params }: { params: Promise<{ slug: string }> }) => {
    if (!db || !hasDatabaseUrl()) return Response.json({ error: "Article statistics are not configured." }, { status: 503 });
    const { slug } = await params;
    if (!slugPattern.test(slug) || !(await getPublishedPost(slug))[0]) return Response.json({ error: "Article not found." }, { status: 404 });

    const body = await request.json().catch(() => null) as { action?: unknown } | null;
    const action = body?.action === "view" || body?.action === "useful" ? body.action : null;
    if (!action) return Response.json({ error: "Choose a valid engagement action." }, { status: 400 });

    const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const key = `${action}:${slug}:${address}`;
    const now = Date.now();
    const limitedUntil = engagementLimits.get(key) ?? 0;
    if (limitedUntil > now) return Response.json(await getStats(slug));
    engagementLimits.set(key, now + (action === "view" ? 5 * 60 * 1000 : 24 * 60 * 60 * 1000));

    if (action === "view") {
        await db.insert(articlePostStats).values({ postSlug: slug, views: 1 }).onConflictDoUpdate({
            target: articlePostStats.postSlug,
            set: { views: sql`${articlePostStats.views} + 1`, updatedAt: new Date() },
        });
    }
    else {
        await db.insert(articlePostStats).values({ postSlug: slug, usefulCount: 1 }).onConflictDoUpdate({
            target: articlePostStats.postSlug,
            set: { usefulCount: sql`${articlePostStats.usefulCount} + 1`, updatedAt: new Date() },
        });
    }

    return Response.json(await getStats(slug));
};
