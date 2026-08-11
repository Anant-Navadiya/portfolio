"use server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, hasDatabaseUrl } from "@/db";
import { articleCategories, articlePostStats, articlePostTags, articlePosts, articleSubcategories, } from "@/db/schema";
import { requireAdminUser } from "@/lib/supabase/server";
export type CreateArticleState = {
    status: "idle" | "success" | "error";
    message: string;
    slug?: string;
};
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const getString = (formData: FormData, key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
};
const parseTags = (value: string) => {
    return Array.from(new Set(value
        .split(/[,\n]/)
        .map((tag) => tag.trim().replace(/^#/, "").toLowerCase())
        .filter(Boolean)));
};
const parsePublishedAt = (status: "draft" | "published", value: string) => {
    if (value) {
        return new Date(`${value}T00:00:00.000Z`);
    }
    return status === "published" ? new Date() : null;
};
const parseSortOrder = (value: string) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
};
const validateDatabase = (): CreateArticleState | undefined => {
    if (!db || !hasDatabaseUrl()) {
        return {
            status: "error",
            message: "DATABASE_URL is not configured.",
        };
    }
};
const validateAdminSession = async (): Promise<CreateArticleState | undefined> => {
    const admin = await requireAdminUser();
    if (!admin.ok) {
        return {
            status: "error",
            message: admin.message,
        };
    }
};
const articleContentPath = async (slug: string) => {
    const postsDirectory = path.join(process.cwd(), "content/articles/posts");
    const filePath = path.join(postsDirectory, `${slug}.mdx`);
    if (!filePath.startsWith(`${postsDirectory}${path.sep}`)) {
        throw new Error("Invalid article path.");
    }
    await fs.mkdir(postsDirectory, { recursive: true });
    return filePath;
};
export const createArticlePost = async (_previousState: CreateArticleState, formData: FormData): Promise<CreateArticleState> => {
    const databaseError = validateDatabase();
    if (databaseError)
        return databaseError;
    const adminError = await validateAdminSession();
    if (adminError)
        return adminError;
    const database = db!;
    const slug = getString(formData, "slug");
    const title = getString(formData, "title");
    const description = getString(formData, "description");
    const categorySlug = getString(formData, "categorySlug");
    const rawSubcategorySlug = getString(formData, "subcategorySlug");
    const status = getString(formData, "status") === "published" ? "published" : "draft";
    const publishedAt = parsePublishedAt(status, getString(formData, "publishedAt"));
    const imageUrl = getString(formData, "imageUrl");
    const imageAlt = getString(formData, "imageAlt");
    const tags = parseTags(getString(formData, "tags"));
    const content = getString(formData, "content") || `# ${title}\n\nWrite the article body here.\n`;
    const pinned = formData.get("pinned") === "on";
    const subcategorySlug = rawSubcategorySlug || null;
    if (!slugPattern.test(slug)) {
        return {
            status: "error",
            message: "Use a lowercase kebab-case slug, for example scaled-dot-product-attention.",
        };
    }
    if (!title || !description || !categorySlug) {
        return {
            status: "error",
            message: "Title, description, and category are required.",
        };
    }
    if (status === "published" && !publishedAt) {
        return {
            status: "error",
            message: "Published articles need a publish date.",
        };
    }
    if (subcategorySlug) {
        const subcategory = await database
            .select({
            slug: articleSubcategories.slug,
            categorySlug: articleSubcategories.categorySlug,
        })
            .from(articleSubcategories)
            .where(eq(articleSubcategories.slug, subcategorySlug))
            .limit(1);
        if (subcategory[0]?.categorySlug !== categorySlug) {
            return {
                status: "error",
                message: "The selected subcategory does not belong to the selected category.",
            };
        }
    }
    const existing = await database
        .select({ slug: articlePosts.slug })
        .from(articlePosts)
        .where(eq(articlePosts.slug, slug))
        .limit(1);
    if (existing.length > 0) {
        return {
            status: "error",
            message: "An article with this slug already exists.",
        };
    }
    const filePath = await articleContentPath(slug);
    try {
        await fs.writeFile(filePath, content, { encoding: "utf8", flag: "wx" });
    }
    catch (error) {
        if (error instanceof Error && "code" in error && error.code === "EEXIST") {
            return {
                status: "error",
                message: "An MDX file with this slug already exists.",
            };
        }
        throw error;
    }
    try {
        await database.insert(articlePosts).values({
            slug,
            title,
            description,
            status,
            categorySlug,
            subcategorySlug,
            publishedAt,
            pinned,
            imageUrl: imageUrl || null,
            imageAlt: imageAlt || null,
        });
        if (tags.length > 0) {
            await database.insert(articlePostTags).values(tags.map((tag) => ({ postSlug: slug, tag })));
        }
        await database
            .insert(articlePostStats)
            .values({ postSlug: slug })
            .onConflictDoNothing({ target: articlePostStats.postSlug });
        revalidatePath("/articles");
        revalidatePath(`/articles/${slug}`);
        revalidatePath("/admin/articles");
        return {
            status: "success",
            message: "Article created.",
            slug,
        };
    }
    catch (error) {
        await fs.rm(filePath, { force: true });
        if (error instanceof Error && error.message.includes("violates foreign key constraint")) {
            return {
                status: "error",
                message: "Choose a valid category and subcategory.",
            };
        }
        if (error instanceof Error &&
            (error.message.includes("duplicate key") || error.message.includes("unique constraint"))) {
            return {
                status: "error",
                message: "An article with this slug already exists.",
            };
        }
        throw error;
    }
};
export const createArticleCategory = async (_previousState: CreateArticleState, formData: FormData): Promise<CreateArticleState> => {
    const databaseError = validateDatabase();
    if (databaseError)
        return databaseError;
    const adminError = await validateAdminSession();
    if (adminError)
        return adminError;
    const database = db!;
    const slug = getString(formData, "slug");
    const label = getString(formData, "label");
    const description = getString(formData, "description");
    const sortOrder = parseSortOrder(getString(formData, "sortOrder"));
    if (!slugPattern.test(slug)) {
        return {
            status: "error",
            message: "Use a lowercase kebab-case category slug.",
        };
    }
    if (!label) {
        return {
            status: "error",
            message: "Category label is required.",
        };
    }
    await database
        .insert(articleCategories)
        .values({
        slug,
        label,
        description: description || null,
        sortOrder,
    })
        .onConflictDoUpdate({
        target: articleCategories.slug,
        set: {
            label,
            description: description || null,
            sortOrder,
        },
    });
    revalidatePath("/articles");
    revalidatePath("/admin/articles");
    return {
        status: "success",
        message: "Category saved.",
        slug,
    };
};
export const createArticleSubcategory = async (_previousState: CreateArticleState, formData: FormData): Promise<CreateArticleState> => {
    const databaseError = validateDatabase();
    if (databaseError)
        return databaseError;
    const adminError = await validateAdminSession();
    if (adminError)
        return adminError;
    const database = db!;
    const slug = getString(formData, "slug");
    const categorySlug = getString(formData, "categorySlug");
    const label = getString(formData, "label");
    const sortOrder = parseSortOrder(getString(formData, "sortOrder"));
    if (!slugPattern.test(slug)) {
        return {
            status: "error",
            message: "Use a lowercase kebab-case subcategory slug.",
        };
    }
    if (!categorySlug || !label) {
        return {
            status: "error",
            message: "Subcategory category and label are required.",
        };
    }
    await database
        .insert(articleSubcategories)
        .values({
        slug,
        categorySlug,
        label,
        sortOrder,
    })
        .onConflictDoUpdate({
        target: articleSubcategories.slug,
        set: {
            categorySlug,
            label,
            sortOrder,
        },
    });
    revalidatePath("/articles");
    revalidatePath("/admin/articles");
    return {
        status: "success",
        message: "Subcategory saved.",
        slug,
    };
};
