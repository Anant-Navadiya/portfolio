import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articleSubcategories } from "@/db/schema";
import { authorizeApi, integer, refreshAdmin, text } from "@/lib/admin/api";
export const PATCH = async (request: Request, { params }: {
    params: Promise<{
        slug: string;
    }>;
}) => { const error = await authorizeApi(); if (error)
    return error; const { slug } = await params; const body = await request.json(); const label = text(body.label); const categorySlug = text(body.categorySlug); if (!label || !categorySlug)
    return Response.json({ error: "Category and label are required." }, { status: 400 }); await db!.update(articleSubcategories).set({ label, categorySlug, sortOrder: integer(body.sortOrder) }).where(eq(articleSubcategories.slug, slug)); refreshAdmin(); return Response.json({ slug }); };
export const DELETE = async (_request: Request, { params }: {
    params: Promise<{
        slug: string;
    }>;
}) => { const error = await authorizeApi(); if (error)
    return error; const { slug } = await params; try {
    await db!.delete(articleSubcategories).where(eq(articleSubcategories.slug, slug));
    refreshAdmin();
    return new Response(null, { status: 204 });
}
catch {
    return Response.json({ error: "Move posts out of this subcategory first." }, { status: 409 });
} };
