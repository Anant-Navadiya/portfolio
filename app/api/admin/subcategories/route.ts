import { asc } from "drizzle-orm";
import { db } from "@/db";
import { articleSubcategories } from "@/db/schema";
import { authorizeApi, integer, refreshAdmin, slugPattern, text } from "@/lib/admin/api";
export const GET = async () => { const error = await authorizeApi(); if (error)
    return error; return Response.json(await db!.select().from(articleSubcategories).orderBy(asc(articleSubcategories.sortOrder))); };
export const POST = async (request: Request) => { const error = await authorizeApi(); if (error)
    return error; const body = await request.json(); const slug = text(body.slug); const label = text(body.label); const categorySlug = text(body.categorySlug); if (!slugPattern.test(slug) || !label || !categorySlug)
    return Response.json({ error: "Category, valid slug, and label are required." }, { status: 400 }); try {
    await db!.insert(articleSubcategories).values({ slug, label, categorySlug, sortOrder: integer(body.sortOrder) });
    refreshAdmin();
    return Response.json({ slug }, { status: 201 });
}
catch {
    return Response.json({ error: "Unable to create subcategory. Check that its slug is unique." }, { status: 409 });
} };
