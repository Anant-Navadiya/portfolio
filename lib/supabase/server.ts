import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const hasSupabaseAuthConfig = () => {
    return Boolean(supabaseUrl && supabaseAnonKey);
};
export const getSupabaseAdminEmails = () => {
    return (process.env.SUPABASE_ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
};
export const hasSupabaseAdminEmails = () => {
    return getSupabaseAdminEmails().length > 0;
};
export const isAllowedAdminEmail = (email: string | undefined | null) => {
    const adminEmails = getSupabaseAdminEmails();
    if (adminEmails.length === 0) {
        return false;
    }
    return Boolean(email && adminEmails.includes(email.toLowerCase()));
};
export const createSupabaseServerClient = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase auth is not configured.");
    }
    const cookieStore = await cookies();
    return createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                }
                catch {
                    // Server Components can read cookies but cannot write refreshed auth cookies.
                }
            },
        },
    });
};
export const getSupabaseUser = async () => {
    if (!hasSupabaseAuthConfig()) {
        return null;
    }
    const supabase = await createSupabaseServerClient();
    const { data: { user }, } = await supabase.auth.getUser();
    return user;
};
export const requireAdminUser = async () => {
    const user = await getSupabaseUser();
    if (!user) {
        return {
            ok: false as const,
            message: "Sign in with Supabase before managing articles.",
        };
    }
    if (!isAllowedAdminEmail(user.email)) {
        return {
            ok: false as const,
            message: "This Supabase user is not allowed to manage articles.",
        };
    }
    return {
        ok: true as const,
        user,
    };
};
