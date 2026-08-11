import { redirect } from "next/navigation";
import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import { requireAdminUser } from "@/lib/supabase/server";
const AdminPanelLayout = async ({ children }: {
    children: React.ReactNode;
}) => {
    await connection();
    const admin = await requireAdminUser();
    if (!admin.ok)
        redirect("/admin/login");
    return <AdminShell email={admin.user.email ?? "Admin"}>{children}</AdminShell>;
};
export default AdminPanelLayout;
