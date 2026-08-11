import { eq } from "drizzle-orm";
import { db } from "@/db";
import { articleCategories } from "@/db/schema";
import { authorizeApi, integer, refreshAdmin, text } from "@/lib/admin/api";
export const PATCH = async (request: Request, { params }: {
    params: Promise<{
        slug: string;
    }>;
}) => { const error = await authorizeApi(); if (error)
    return error; const { slug } = await params; const body = await request.json(); const label = text(body.label); if (!label)
    return Response.json({ error: "Label is required." }, { status: 400 }); await db!.update(articleCategories).set({ label, description: text(body.description) || null, sortOrder: integer(body.sortOrder) }).where(eq(articleCategories.slug, slug)); refreshAdmin(); return Response.json({ slug }); };
export const DELETE = async (_request: Request, { params }: {
    params: Promise<{
        slug: string;
    }>;
}) => { const error = await authorizeApi(); if (error)
    return error; const { slug } = await params; try {
    await db!.delete(articleCategories).where(eq(articleCategories.slug, slug));
    refreshAdmin();
    return new Response(null, { status: 204 });
}
catch {
    return Response.json({ error: "Move or delete posts in this category first." }, { status: 409 });
} };
