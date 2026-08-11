import { asc } from "drizzle-orm";
import PageHeader from "@/components/admin/PageHeader";
import TaxonomyManager from "@/components/admin/TaxonomyManager";
import { db } from "@/db";
import { articleCategories } from "@/db/schema";
const CategoriesPage = async () => { const rows = db ? await db.select().from(articleCategories).orderBy(asc(articleCategories.sortOrder), asc(articleCategories.label)) : []; return <><PageHeader title="Categories" description="Manage the top-level groups used to organize posts."/><TaxonomyManager type="categories" rows={rows}/></>; };
export default CategoriesPage;
