import PageHeader from "@/components/admin/PageHeader";
import PostEditor from "@/components/admin/PostEditor";
import { getArticleCategories } from "@/lib/content/articles";
const NewPostPage = async () => { const categories = await getArticleCategories(); return <><PageHeader eyebrow="Posts" title="Create post" description="Add a new article and save its body as MDX."/><PostEditor categories={categories} mode="create"/></>; };
export default NewPostPage;
