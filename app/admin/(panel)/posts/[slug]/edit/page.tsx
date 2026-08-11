import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import PostEditor from "@/components/admin/PostEditor";
import { getAdminPostEditor, getArticleCategories } from "@/lib/content/articles";
const EditPostPage = async ({ params }: {
    params: Promise<{
        slug: string;
    }>;
}) => { const { slug } = await params; const [categories, post] = await Promise.all([getArticleCategories(), getAdminPostEditor(slug)]); if (!post)
    notFound(); return <><PageHeader eyebrow="Posts" title="Edit post" description={`Update “${post.title}” and its publishing settings.`}/><PostEditor categories={categories} initial={post} mode="edit"/></>; };
export default EditPostPage;
