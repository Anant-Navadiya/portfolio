import { redirect } from "next/navigation";
const ArticleAdminPage = async () => {
    redirect("/admin/posts");
};
export default ArticleAdminPage;
