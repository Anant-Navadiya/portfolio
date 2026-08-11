import { relations } from "drizzle-orm";
import { boolean, index, integer, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const articlePostStatus = pgEnum("article_post_status", ["draft", "published"]);
export const contactSubmissionStatus = pgEnum("contact_submission_status", ["unread", "read", "archived"]);

export const articleCategories = pgTable("article_categories", {
  slug: text("slug").primaryKey(),
  label: text("label").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const articleSubcategories = pgTable("article_subcategories", {
  slug: text("slug").primaryKey(),
  categorySlug: text("category_slug")
    .notNull()
    .references(() => articleCategories.slug, { onDelete: "cascade" }),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const articlePosts = pgTable("article_posts", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: articlePostStatus("status").notNull().default("draft"),
  categorySlug: text("category_slug")
    .notNull()
    .references(() => articleCategories.slug),
  subcategorySlug: text("subcategory_slug").references(() => articleSubcategories.slug),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  pinned: boolean("pinned").notNull().default(false),
  imageUrl: text("image_url"),
  imageAlt: text("image_alt"),
});

export const articlePostTags = pgTable(
  "article_post_tags",
  {
    postSlug: text("post_slug")
      .notNull()
      .references(() => articlePosts.slug, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => [primaryKey({ columns: [table.postSlug, table.tag] })],
);

export const articlePostStats = pgTable("article_post_stats", {
  postSlug: text("post_slug")
    .primaryKey()
    .references(() => articlePosts.slug, { onDelete: "cascade" }),
  views: integer("views").notNull().default(0),
  usefulCount: integer("useful_count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: contactSubmissionStatus("status").notNull().default("unread"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("contact_submissions_status_idx").on(table.status),
  index("contact_submissions_created_at_idx").on(table.createdAt),
]);

export const articleCategoriesRelations = relations(articleCategories, ({ many }) => ({
  subcategories: many(articleSubcategories),
  posts: many(articlePosts),
}));

export const articleSubcategoriesRelations = relations(articleSubcategories, ({ one, many }) => ({
  category: one(articleCategories, {
    fields: [articleSubcategories.categorySlug],
    references: [articleCategories.slug],
  }),
  posts: many(articlePosts),
}));

export const articlePostsRelations = relations(articlePosts, ({ one, many }) => ({
  category: one(articleCategories, {
    fields: [articlePosts.categorySlug],
    references: [articleCategories.slug],
  }),
  subcategory: one(articleSubcategories, {
    fields: [articlePosts.subcategorySlug],
    references: [articleSubcategories.slug],
  }),
  tags: many(articlePostTags),
  stats: one(articlePostStats),
}));
