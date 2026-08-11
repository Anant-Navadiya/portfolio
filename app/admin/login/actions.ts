"use server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient, hasSupabaseAuthConfig, isAllowedAdminEmail, } from "@/lib/supabase/server";
export type AdminLoginState = {
    status: "idle" | "error";
    message: string;
};
const getString = (formData: FormData, key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
};
export const loginAdmin = async (_previousState: AdminLoginState, formData: FormData): Promise<AdminLoginState> => {
    if (!hasSupabaseAuthConfig()) {
        return {
            status: "error",
            message: "Supabase auth is not configured.",
        };
    }
    const email = getString(formData, "email");
    const password = getString(formData, "password");
    if (!email || !password) {
        return {
            status: "error",
            message: "Email and password are required.",
        };
    }
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error || !data.user) {
        return {
            status: "error",
            message: error?.message ?? "Unable to sign in.",
        };
    }
    if (!isAllowedAdminEmail(data.user.email)) {
        await supabase.auth.signOut();
        return {
            status: "error",
            message: "This Supabase user is not allowed to manage articles.",
        };
    }
    redirect("/admin/articles");
};
export const logoutAdmin = async () => {
    if (hasSupabaseAuthConfig()) {
        const supabase = await createSupabaseServerClient();
        await supabase.auth.signOut();
    }
    redirect("/admin/login");
};
