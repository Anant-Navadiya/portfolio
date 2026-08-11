import { promises as fs } from "node:fs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articlePosts } from "@/db/schema";
import { authorizeApi, postFile, refreshAdmin, savePost } from "@/lib/admin/api";
import { getAdminPostEditor } from "@/lib/content/articles";
export const GET = async (_request: Request, { params }: {
    params: Promise<{
        slug: string;
    }>;
}) => { const error = await authorizeApi(); if (error)
    return error; const { slug } = await params; const post = await getAdminPostEditor(slug); return post ? Response.json(post) : Response.json({ error: "Post not found." }, { status: 404 }); };
export const PATCH = async (request: Request, { params }: {
    params: Promise<{
        slug: string;
    }>;
}) => { const error = await authorizeApi(); if (error)
    return error; try {
    const { slug } = await params;
    await savePost(await request.json(), slug);
    return Response.json({ slug });
}
catch (cause) {
    return Response.json({ error: cause instanceof Error ? cause.message : "Unable to update post." }, { status: 400 });
} };
export const DELETE = async (_request: Request, { params }: {
    params: Promise<{
        slug: string;
    }>;
}) => { const error = await authorizeApi(); if (error)
    return error; const { slug } = await params; await db!.delete(articlePosts).where(eq(articlePosts.slug, slug)); await fs.rm(postFile(slug), { force: true }); refreshAdmin(); return new Response(null, { status: 204 }); };
