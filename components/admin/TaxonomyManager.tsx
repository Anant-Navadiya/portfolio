"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { ArticleFilterCategory } from "@/lib/content/articles";
type Row = {
    slug: string;
    label: string;
    description?: string | null;
    sortOrder?: number;
    categorySlug?: string;
};
const TaxonomyManager = ({ type, rows, categories = [] }: {
    type: "categories" | "subcategories";
    rows: Row[];
    categories?: ArticleFilterCategory[];
}) => {
    const router = useRouter();
    const [form, setForm] = useState({ slug: "", label: "", description: "", sortOrder: 0, categorySlug: categories[0]?.slug ?? "" });
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);
    const singular = type === "categories" ? "category" : "subcategory";
    const create = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage("");
        setSaving(true);
        const response = await fetch(`/api/admin/${type}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
        const result = await response.json().catch(() => ({}));
        setSaving(false);
        if (!response.ok)
            return setMessage(result.error ?? "Unable to save.");
        setForm({ slug: "", label: "", description: "", sortOrder: 0, categorySlug: categories[0]?.slug ?? "" });
        router.refresh();
    };
    const remove = async (slug: string) => {
        if (!window.confirm(`Delete ${singular} “${slug}”?`))
            return;
        const response = await fetch(`/api/admin/${type}/${slug}`, { method: "DELETE" });
        if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            setMessage(result.error ?? "Unable to delete.");
            return;
        }
        router.refresh();
    };
    return <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><span className={type === "categories" ? "icon-[lucide--folder-plus] size-4" : "icon-[lucide--list-plus] size-4"}/>Add {singular}</CardTitle><CardDescription>Create a new {singular} for organizing article content.</CardDescription></CardHeader><CardContent><form onSubmit={create} className="space-y-4">{type === "subcategories" ? <div className="space-y-2"><Label>Parent category</Label><select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring" value={form.categorySlug} onChange={(event) => setForm({ ...form, categorySlug: event.target.value })} required>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.label}</option>)}</select></div> : null}<div className="space-y-2"><Label>Label</Label><Input required value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} placeholder={type === "categories" ? "Engineering" : "Frontend"}/></div><div className="space-y-2"><Label>Slug</Label><Input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="lowercase-slug"/><p className="text-xs text-muted-foreground">Used in URLs and database relationships.</p></div>{type === "categories" ? <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What belongs in this category?"/></div> : null}<div className="space-y-2"><Label>Sort order</Label><Input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })}/></div>{message ? <Alert className="border-destructive/40 bg-destructive/5"><span className="icon-[lucide--circle-alert] text-destructive"/><AlertTitle className="text-destructive">Could not save</AlertTitle><AlertDescription>{message}</AlertDescription></Alert> : null}<Button className="w-full" disabled={saving || (type === "subcategories" && categories.length === 0)}><span className="icon-[lucide--plus] size-4"/>{saving ? "Adding…" : `Add ${singular}`}</Button></form></CardContent></Card><Card><CardHeader><CardTitle className="capitalize">{type}</CardTitle><CardDescription>{rows.length} {rows.length === 1 ? singular : type} configured.</CardDescription></CardHeader><CardContent className="px-0"><Table><TableHeader><TableRow><TableHead className="pl-6">Name</TableHead>{type === "subcategories" ? <TableHead>Parent</TableHead> : null}<TableHead>Order</TableHead><TableHead className="pr-6 text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.slug}><TableCell className="pl-6"><div className="flex items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground"><span className={type === "categories" ? "icon-[lucide--folder] size-4" : "icon-[lucide--list-tree] size-4"}/></span><div><p className="font-medium text-foreground">{row.label}</p><p className="text-xs text-muted-foreground">{row.slug}</p></div></div></TableCell>{type === "subcategories" ? <TableCell><Badge variant="outline">{row.categorySlug}</Badge></TableCell> : null}<TableCell className="text-muted-foreground">{row.sortOrder ?? 0}</TableCell><TableCell className="pr-6 text-right"><Button type="button" variant="ghost" size="icon-sm" aria-label={`Delete ${row.label}`} onClick={() => remove(row.slug)} className="text-muted-foreground hover:text-destructive"><span className="icon-[lucide--trash-2] size-4"/></Button></TableCell></TableRow>)}</TableBody></Table>{rows.length === 0 ? <div className="grid place-items-center px-6 py-14 text-center"><span className="icon-[lucide--folder-open] mb-3 size-9 text-muted-foreground"/><p className="font-medium text-foreground">No {type} yet</p><p className="mt-1 text-sm text-muted-foreground">Use the form to create your first {singular}.</p></div> : null}</CardContent></Card></div>;
};
export default TaxonomyManager;
