"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db, hasDatabaseUrl } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { requireAdminUser } from "@/lib/supabase/server";

const contactStatuses = ["unread", "read", "archived"] as const;

const authorizeContactAction = async () => {
    if (!db || !hasDatabaseUrl()) return false;
    const admin = await requireAdminUser();
    return admin.ok;
};

export const updateContactStatus = async (formData: FormData) => {
    if (!(await authorizeContactAction())) return;
    const id = formData.get("id");
    const requestedStatus = formData.get("status");
    const status = contactStatuses.find((item) => item === requestedStatus);
    if (typeof id !== "string" || !status) return;
    await db!.update(contactSubmissions).set({ status, updatedAt: new Date() }).where(eq(contactSubmissions.id, id));
    revalidatePath("/admin");
    revalidatePath("/admin/contacts");
};

export const deleteContactSubmission = async (formData: FormData) => {
    if (!(await authorizeContactAction())) return;
    const id = formData.get("id");
    if (typeof id !== "string") return;
    await db!.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
    revalidatePath("/admin");
    revalidatePath("/admin/contacts");
};
