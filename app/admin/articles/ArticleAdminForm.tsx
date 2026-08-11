"use client";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { createArticlePost, type CreateArticleState } from "@/app/admin/articles/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleFilterCategory } from "@/lib/content/articles";
type ArticleAdminFormProps = {
    categories: ArticleFilterCategory[];
    disabled: boolean;
};
const initialState: CreateArticleState = {
    status: "idle",
    message: "",
};
const today = () => {
    return new Date().toISOString().slice(0, 10);
};
const Field = ({ label, children, description, }: {
    label: string;
    children: React.ReactNode;
    description?: string;
}) => {
    return (<div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {description ? <p className="text-xs leading-5 text-muted-foreground">{description}</p> : null}
    </div>);
};
const ArticleAdminForm = ({ categories, disabled }: ArticleAdminFormProps) => {
    const [state, formAction, pending] = useActionState(createArticlePost, initialState);
    const [categorySlug, setCategorySlug] = useState(categories[0]?.slug ?? "");
    const selectedCategory = useMemo(() => categories.find((category) => category.slug === categorySlug), [categories, categorySlug]);
    const isDisabled = disabled || pending || categories.length === 0;
    return (<Card>
      <CardHeader>
        <CardTitle>Add article</CardTitle>
        <CardDescription>
          Creates the database row, tags, stats row, and matching MDX file in content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <select name="status" defaultValue="draft" disabled={isDisabled} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <Input name="title" required disabled={isDisabled} placeholder="Scaled Dot-Product Attention"/>
            </Field>

            <Field label="Slug" description="Lowercase kebab-case. This becomes the article URL and MDX filename.">
              <Input name="slug" required disabled={isDisabled} placeholder="scaled-dot-product-attention"/>
            </Field>
          </div>

          <Field label="Description">
            <Textarea name="description" required disabled={isDisabled} className="min-h-20" placeholder="A compact summary shown on article cards and metadata."/>
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Category">
              <select name="categorySlug" value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)} disabled={isDisabled} required className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50">
                {categories.map((category) => (<option key={category.slug} value={category.slug}>
                    {category.label}
                  </option>))}
              </select>
            </Field>

            <Field label="Subcategory">
              <select name="subcategorySlug" disabled={isDisabled} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">None</option>
                {(selectedCategory?.subcategories ?? []).map((subcategory) => (<option key={subcategory.slug} value={subcategory.slug}>
                    {subcategory.label}
                  </option>))}
              </select>
            </Field>

            <Field label="Publish date">
              <Input name="publishedAt" type="date" defaultValue={today()} disabled={isDisabled}/>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Image URL">
              <Input name="imageUrl" type="url" disabled={isDisabled} placeholder="https://..."/>
            </Field>

            <Field label="Image alt">
              <Input name="imageAlt" disabled={isDisabled} placeholder="Describe the article image"/>
            </Field>
          </div>

          <Field label="Tags" description="Comma-separated or one per line.">
            <Input name="tags" disabled={isDisabled} placeholder="attention, transformers, math"/>
          </Field>

          <Field label="MDX content">
            <Textarea name="content" required disabled={isDisabled} className="min-h-72 font-mono text-sm leading-6" placeholder={"# Article title\n\nStart writing in MDX..."}/>
          </Field>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-5">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox name="pinned" disabled={isDisabled}/>
              <span>Pin this article</span>
            </label>

            <Button type="submit" disabled={isDisabled}>
              <span className="icon-[lucide--save] size-4" aria-hidden="true"/>
              {pending ? "Creating..." : "Create article"}
            </Button>
          </div>

          {state.message ? (<div aria-live="polite" className={state.status === "success"
                ? "rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-primary"
                : "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"}>
              {state.message}
              {state.status === "success" && state.slug ? (<Link href={`/articles/${state.slug}`} className="ml-2 underline underline-offset-4">
                  View article
                </Link>) : null}
            </div>) : null}
        </form>
      </CardContent>
    </Card>);
};
export default ArticleAdminForm;
