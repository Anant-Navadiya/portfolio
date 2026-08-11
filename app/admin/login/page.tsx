import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import LoginForm from "@/app/admin/login/LoginForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/layouts/components/navbar";
import { getSupabaseUser, hasSupabaseAdminEmails, hasSupabaseAuthConfig, isAllowedAdminEmail, } from "@/lib/supabase/server";
export const metadata: Metadata = {
    title: "Admin Login | Anant Navadiya",
    description: "Sign in to manage article content.",
};
const AdminLoginPage = async () => {
    await connection();
    const user = await getSupabaseUser();
    if (user && isAllowedAdminEmail(user.email)) {
        redirect("/admin");
    }
    const setupMissing = !hasSupabaseAuthConfig();
    const allowlistMissing = !hasSupabaseAdminEmails();
    return (<>
      <Navbar />

      <main className="my-10 space-y-8">
        <section className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Admin</p>
          <h1 className="text-4xl font-semibold tracking-tight">Sign in</h1>
          <p>Authenticate with Supabase before managing articles.</p>
        </section>

        {setupMissing ? (<Card className="border-destructive/30 bg-destructive/10">
            <CardHeader>
              <CardTitle>Setup required</CardTitle>
              <CardDescription>
                Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
              </CardDescription>
            </CardHeader>
          </Card>) : null}

        {!setupMissing && allowlistMissing ? (<Card className="border-destructive/30 bg-destructive/10">
            <CardHeader>
              <CardTitle>Admin allowlist missing</CardTitle>
              <CardDescription>
                Set SUPABASE_ADMIN_EMAILS to restrict article management to trusted users.
              </CardDescription>
            </CardHeader>
          </Card>) : null}

        <LoginForm disabled={setupMissing || allowlistMissing}/>
      </main>
    </>);
};
export default AdminLoginPage;
