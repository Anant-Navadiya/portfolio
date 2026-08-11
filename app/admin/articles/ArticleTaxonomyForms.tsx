"use client";
import { useActionState } from "react";
import { createArticleCategory, createArticleSubcategory, type CreateArticleState, } from "@/app/admin/articles/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleFilterCategory } from "@/lib/content/articles";
type ArticleTaxonomyFormsProps = {
    categories: ArticleFilterCategory[];
    disabled: boolean;
};
const initialState: CreateArticleState = {
    status: "idle",
    message: "",
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
const StatusMessage = ({ state }: {
    state: CreateArticleState;
}) => {
    if (!state.message) {
        return null;
    }
    return (<div aria-live="polite" className={state.status === "success"
            ? "rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-primary"
            : "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"}>
      {state.message}
    </div>);
};
const ArticleTaxonomyForms = ({ categories, disabled }: ArticleTaxonomyFormsProps) => {
    const [categoryState, categoryAction, categoryPending] = useActionState(createArticleCategory, initialState);
    const [subcategoryState, subcategoryAction, subcategoryPending] = useActionState(createArticleSubcategory, initialState);
    const categoryDisabled = disabled || categoryPending;
    const subcategoryDisabled = disabled || subcategoryPending || categories.length === 0;
    return (<div className="grid gap-5 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add category</CardTitle>
          <CardDescription>Create a top-level article category.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={categoryAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug" description="Lowercase kebab-case, for example ai or web-platform.">
                <Input name="slug" required disabled={categoryDisabled} placeholder="ai"/>
              </Field>
              <Field label="Sort order">
                <Input name="sortOrder" type="number" defaultValue="0" disabled={categoryDisabled}/>
              </Field>
            </div>

            <Field label="Label">
              <Input name="label" required disabled={categoryDisabled} placeholder="AI"/>
            </Field>

            <Field label="Description">
              <Textarea name="description" disabled={categoryDisabled} className="min-h-20" placeholder="AI notes, concepts, implementations, and experiments."/>
            </Field>

            <div className="flex items-center justify-between gap-4 border-t pt-4">
              <StatusMessage state={categoryState}/>
              <Button type="submit" disabled={categoryDisabled} className="ml-auto">
                <span className="icon-[lucide--folder-plus] size-4" aria-hidden="true"/>
                {categoryPending ? "Saving..." : "Save category"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add subcategory</CardTitle>
          <CardDescription>Create a child grouping under a category.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={subcategoryAction} className="space-y-4">
            <Field label="Category">
              <select name="categorySlug" required disabled={subcategoryDisabled} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50">
                {categories.map((category) => (<option key={category.slug} value={category.slug}>
                    {category.label}
                  </option>))}
              </select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slug" description="Lowercase kebab-case, for example models or frontend.">
                <Input name="slug" required disabled={subcategoryDisabled} placeholder="models"/>
              </Field>
              <Field label="Sort order">
                <Input name="sortOrder" type="number" defaultValue="0" disabled={subcategoryDisabled}/>
              </Field>
            </div>

            <Field label="Label">
              <Input name="label" required disabled={subcategoryDisabled} placeholder="Models"/>
            </Field>

            <div className="flex items-center justify-between gap-4 border-t pt-4">
              <StatusMessage state={subcategoryState}/>
              <Button type="submit" disabled={subcategoryDisabled} className="ml-auto">
                <span className="icon-[lucide--list-plus] size-4" aria-hidden="true"/>
                {subcategoryPending ? "Saving..." : "Save subcategory"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>);
};
export default ArticleTaxonomyForms;
