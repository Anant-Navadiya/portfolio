import { db, hasDatabaseUrl } from "@/db";
import { contactSubmissions } from "@/db/schema";

const requestLimits = new Map<string, { count: number; resetAt: number }>();
const limitWindowMs = 60 * 60 * 1000;
const maxRequestsPerWindow = 3;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
    email?: unknown;
    message?: unknown;
    name?: unknown;
    subject?: unknown;
    website?: unknown;
};

const getString = (value: unknown) => typeof value === "string" ? value.trim() : "";

const isRateLimited = (request: Request) => {
    const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
    const now = Date.now();
    const current = requestLimits.get(key);
    if (!current || current.resetAt < now) {
        requestLimits.set(key, { count: 1, resetAt: now + limitWindowMs });
        return false;
    }
    current.count += 1;
    return current.count > maxRequestsPerWindow;
};

export const POST = async (request: Request) => {
    if (!db || !hasDatabaseUrl()) return Response.json({ error: "Contact form is not configured." }, { status: 503 });
    if (Number(request.headers.get("content-length") ?? 0) > 16_000) return Response.json({ error: "Message is too large." }, { status: 413 });
    if (isRateLimited(request)) return Response.json({ error: "Too many messages. Please try again later." }, { status: 429 });

    const body = await request.json().catch(() => null) as ContactPayload | null;
    if (!body) return Response.json({ error: "Invalid contact form data." }, { status: 400 });

    const website = getString(body.website);
    if (website) return Response.json({ ok: true }, { status: 201 });

    const name = getString(body.name);
    const email = getString(body.email).toLowerCase();
    const subject = getString(body.subject);
    const message = getString(body.message);

    if (name.length < 2 || name.length > 100) return Response.json({ error: "Enter a name between 2 and 100 characters." }, { status: 400 });
    if (!emailPattern.test(email) || email.length > 254) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    if (subject.length < 3 || subject.length > 160) return Response.json({ error: "Enter a subject between 3 and 160 characters." }, { status: 400 });
    if (message.length < 20 || message.length > 5000) return Response.json({ error: "Enter a message between 20 and 5,000 characters." }, { status: 400 });

    await db.insert(contactSubmissions).values({ name, email, subject, message });
    return Response.json({ ok: true }, { status: 201 });
};
