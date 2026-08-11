import "server-only";

import { desc, eq, sql } from "drizzle-orm";

import { db, hasDatabaseUrl } from "@/db";
import { contactSubmissions } from "@/db/schema";

export type ContactSubmissionStatus = "unread" | "read" | "archived";

export const getContactSubmissions = async (status?: ContactSubmissionStatus) => {
    if (!db || !hasDatabaseUrl()) return [];
    const query = db.select().from(contactSubmissions);
    return status
        ? query.where(eq(contactSubmissions.status, status)).orderBy(desc(contactSubmissions.createdAt))
        : query.orderBy(desc(contactSubmissions.createdAt));
};

export const getContactCounts = async () => {
    if (!db || !hasDatabaseUrl()) return { total: 0, unread: 0 };
    const rows = await db.select({
        total: sql<number>`count(*)::int`,
        unread: sql<number>`count(*) filter (where ${contactSubmissions.status} = 'unread')::int`,
    }).from(contactSubmissions);
    return rows[0] ?? { total: 0, unread: 0 };
};
