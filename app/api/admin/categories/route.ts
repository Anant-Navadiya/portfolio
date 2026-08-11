import { asc } from "drizzle-orm";
import { db } from "@/db";
import { articleCategories } from "@/db/schema";
import { authorizeApi, integer, refreshAdmin, slugPattern, text } from "@/lib/admin/api";
export const GET = async () => { const error = await authorizeApi(); if (error)
    return error; return Response.json(await db!.select().from(articleCategories).orderBy(asc(articleCategories.sortOrder))); };
export const POST = async (request: Request) => { const error = await authorizeApi(); if (error)
    return error; const body = await request.json(); const slug = text(body.slug); const label = text(body.label); if (!slugPattern.test(slug) || !label)
    return Response.json({ error: "A valid slug and label are required." }, { status: 400 }); try {
    await db!.insert(articleCategories).values({ slug, label, description: text(body.description) || null, sortOrder: integer(body.sortOrder) });
    refreshAdmin();
    return Response.json({ slug }, { status: 201 });
}
catch {
    return Response.json({ error: "That category slug already exists." }, { status: 409 });
} };
