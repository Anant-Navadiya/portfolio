"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ArticleFilterCategory } from "@/lib/content/articles";
export type PostEditorValue = {
    slug: string;
    title: string;
    description: string;
    status: "draft" | "published";
    categorySlug: string;
    subcategorySlug: string;
    publishedAt: string;
    imageUrl: string;
    imageAlt: string;
    tags: string;
    content: string;
    pinned: boolean;
};
const emptyPost: PostEditorValue = { slug: "", title: "", description: "", status: "draft", categorySlug: "", subcategorySlug: "", publishedAt: new Date().toISOString().slice(0, 10), imageUrl: "", imageAlt: "", tags: "", content: "", pinned: false };
const Field = ({ label, hint, children }: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) => { return <div className="space-y-1.5"><Label>{label}</Label>{children}{hint && <p className="text-xs leading-5">{hint}</p>}</div>; };
const selectClass = "h-10 w-full border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50";
const PostEditor = ({ categories, initial, mode }: {
    categories: ArticleFilterCategory[];
    initial?: PostEditorValue;
    mode: "create" | "edit";
}) => {
    const router = useRouter();
    const [value, setValue] = useState<PostEditorValue>({ ...emptyPost, categorySlug: categories[0]?.slug ?? "", ...initial });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const selectedCategory = useMemo(() => categories.find((item) => item.slug === value.categorySlug), [categories, value.categorySlug]);
    const set = <K extends keyof PostEditorValue>(key: K, next: PostEditorValue[K]) => setValue((current) => ({ ...current, [key]: next }));
    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSaving(true);
        setMessage("");
        const url = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${initial?.slug}`;
        const response = await fetch(url, { method: mode === "create" ? "POST" : "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(value) });
        const result = await response.json().catch(() => ({ error: "Unable to save the post." }));
        setSaving(false);
        if (!response.ok) {
            setMessage(result.error ?? "Unable to save the post.");
            return;
        }
        router.push("/admin/posts");
        router.refresh();
    };
    return <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><span className="icon-[lucide--file-pen-line] size-4"/>Post content</CardTitle><CardDescription>Write the title, summary, and MDX body.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Title"><Input value={value.title} onChange={(e) => set("title", e.target.value)} required placeholder="Post title"/></Field><Field label="Slug" hint="Lowercase letters, numbers, and hyphens."><Input value={value.slug} onChange={(e) => set("slug", e.target.value)} required disabled={mode === "edit"} placeholder="post-title"/></Field></div><Field label="Description"><Textarea value={value.description} onChange={(e) => set("description", e.target.value)} required className="min-h-24" placeholder="Short summary for cards and search results."/></Field><Field label="MDX content"><Textarea value={value.content} onChange={(e) => set("content", e.target.value)} required className="min-h-[520px] font-mono text-sm leading-6" placeholder="# Start writing…"/></Field><Field label="Tags" hint="Separate tags with commas."><Input value={value.tags} onChange={(e) => set("tags", e.target.value)} placeholder="nextjs, design, engineering"/></Field></CardContent></Card>
    <div className="space-y-6"><Card><CardHeader><CardTitle>Publishing</CardTitle><CardDescription>Control visibility and publication timing.</CardDescription></CardHeader><CardContent className="space-y-4"><Field label="Status"><select className={selectClass} value={value.status} onChange={(e) => set("status", e.target.value as PostEditorValue["status"])}><option value="draft">Draft</option><option value="published">Published</option></select></Field><Field label="Publish date"><Input type="date" value={value.publishedAt} onChange={(e) => set("publishedAt", e.target.value)}/></Field><label className="flex items-center gap-2 text-sm"><Checkbox checked={value.pinned} onCheckedChange={(checked) => set("pinned", checked === true)}/>Pin this post</label></CardContent></Card><Card><CardHeader><CardTitle>Taxonomy</CardTitle><CardDescription>Choose where readers can discover this post.</CardDescription></CardHeader><CardContent className="space-y-4"><Field label="Category"><select className={selectClass} value={value.categorySlug} onChange={(e) => { setValue((current) => ({ ...current, categorySlug: e.target.value, subcategorySlug: "" })); }} required>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.label}</option>)}</select></Field><Field label="Subcategory"><select className={selectClass} value={value.subcategorySlug} onChange={(e) => set("subcategorySlug", e.target.value)}><option value="">None</option>{selectedCategory?.subcategories.map((item) => <option key={item.slug} value={item.slug}>{item.label}</option>)}</select></Field></CardContent></Card><Card><CardHeader><CardTitle>Cover image</CardTitle><CardDescription>Optional artwork displayed on article cards.</CardDescription></CardHeader><CardContent className="space-y-4"><Field label="Image URL"><Input type="url" value={value.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://…"/></Field><Field label="Alt text"><Input value={value.imageAlt} onChange={(e) => set("imageAlt", e.target.value)}/></Field></CardContent></Card>{message && <Alert className="border-destructive/40 bg-destructive/5"><span className="icon-[lucide--circle-alert] text-destructive"/><AlertTitle className="text-destructive">Could not save post</AlertTitle><AlertDescription>{message}</AlertDescription></Alert>}<div className="sticky bottom-4 flex justify-end gap-2 rounded-md border bg-background/90 p-3 shadow-lg backdrop-blur"><Button asChild variant="outline"><Link href="/admin/posts">Cancel</Link></Button><Button disabled={saving || categories.length === 0}><span className="icon-[lucide--save] size-4"/>{saving ? "Saving…" : mode === "create" ? "Create post" : "Save changes"}</Button></div></div>
  </form>;
};
export default PostEditor;
