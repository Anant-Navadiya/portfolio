CREATE TYPE "public"."article_post_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "article_categories" (
	"slug" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_post_stats" (
	"post_slug" text PRIMARY KEY NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"useful_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_post_tags" (
	"post_slug" text NOT NULL,
	"tag" text NOT NULL,
	CONSTRAINT "article_post_tags_post_slug_tag_pk" PRIMARY KEY("post_slug","tag")
);
--> statement-breakpoint
CREATE TABLE "article_posts" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"status" "article_post_status" DEFAULT 'draft' NOT NULL,
	"category_slug" text NOT NULL,
	"subcategory_slug" text,
	"published_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"image_url" text,
	"image_alt" text
);
--> statement-breakpoint
CREATE TABLE "article_subcategories" (
	"slug" text PRIMARY KEY NOT NULL,
	"category_slug" text NOT NULL,
	"label" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_post_stats" ADD CONSTRAINT "article_post_stats_post_slug_article_posts_slug_fk" FOREIGN KEY ("post_slug") REFERENCES "public"."article_posts"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_post_tags" ADD CONSTRAINT "article_post_tags_post_slug_article_posts_slug_fk" FOREIGN KEY ("post_slug") REFERENCES "public"."article_posts"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_posts" ADD CONSTRAINT "article_posts_category_slug_article_categories_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."article_categories"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_posts" ADD CONSTRAINT "article_posts_subcategory_slug_article_subcategories_slug_fk" FOREIGN KEY ("subcategory_slug") REFERENCES "public"."article_subcategories"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_subcategories" ADD CONSTRAINT "article_subcategories_category_slug_article_categories_slug_fk" FOREIGN KEY ("category_slug") REFERENCES "public"."article_categories"("slug") ON DELETE cascade ON UPDATE no action;