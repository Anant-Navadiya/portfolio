import { desc } from "drizzle-orm";
import { db } from "@/db";
import { articlePosts } from "@/db/schema";
import { authorizeApi, savePost } from "@/lib/admin/api";
export const GET = async () => { const error = await authorizeApi(); if (error)
    return error; return Response.json(await db!.select().from(articlePosts).orderBy(desc(articlePosts.updatedAt))); };
export const POST = async (request: Request) => { const error = await authorizeApi(); if (error)
    return error; try {
    const slug = await savePost(await request.json());
    return Response.json({ slug }, { status: 201 });
}
catch (cause) {
    return Response.json({ error: cause instanceof Error ? cause.message : "Unable to create post." }, { status: 400 });
} };
