import { asc } from "drizzle-orm";
import PageHeader from "@/components/admin/PageHeader";
import TaxonomyManager from "@/components/admin/TaxonomyManager";
import { db } from "@/db";
import { articleSubcategories } from "@/db/schema";
import { getArticleCategories } from "@/lib/content/articles";
const SubcategoriesPage = async () => { const [rows, categories] = await Promise.all([db ? db.select().from(articleSubcategories).orderBy(asc(articleSubcategories.sortOrder), asc(articleSubcategories.label)) : [], getArticleCategories()]); return <><PageHeader title="Subcategories" description="Create focused child groups beneath a category."/><TaxonomyManager type="subcategories" rows={rows} categories={categories}/></>; };
export default SubcategoriesPage;
