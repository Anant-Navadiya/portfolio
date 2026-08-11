import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminArticlePosts, getArticleCategories } from "@/lib/content/articles";
import { getContactCounts } from "@/lib/contact";
const AdminDashboardPage = async () => {
    const [posts, categories, contacts] = await Promise.all([getAdminArticlePosts(), getArticleCategories(), getContactCounts()]);
    const published = posts.filter((post) => post.status === "published").length;
    const drafts = posts.length - published;
    const subcategories = categories.reduce((total, item) => total + item.subcategories.length, 0);
    const stats = [
        { label: "Total posts", value: posts.length, detail: `${drafts} drafts`, icon: "icon-[lucide--files]" },
        { label: "Published", value: published, detail: posts.length ? `${Math.round((published / posts.length) * 100)}% of posts` : "No posts yet", icon: "icon-[lucide--circle-check]" },
        { label: "Categories", value: categories.length, detail: "Top-level groups", icon: "icon-[lucide--folders]" },
        { label: "Subcategories", value: subcategories, detail: "Nested groups", icon: "icon-[lucide--list-tree]" },
        { label: "Inbox", value: contacts.total, detail: `${contacts.unread} unread`, icon: "icon-[lucide--inbox]" },
    ];
    return <><PageHeader eyebrow="Overview" title="Dashboard" description="Monitor your content and jump back into recent work." action={<Button asChild><Link href="/admin/posts/new"><span className="icon-[lucide--plus] size-4"/>New post</Link></Button>}/><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{stats.map((stat) => <Card key={stat.label} className="gap-4"><CardHeader><CardDescription>{stat.label}</CardDescription><CardTitle className="text-3xl tabular-nums">{stat.value}</CardTitle><CardAction><span className="grid size-9 place-items-center rounded-md bg-muted text-muted-foreground"><span className={`${stat.icon} size-4`}/></span></CardAction></CardHeader><CardContent><p className="text-xs text-muted-foreground">{stat.detail}</p></CardContent></Card>)}</div><Card className="mt-6"><CardHeader><CardTitle>Recently updated</CardTitle><CardDescription>Your five most recently changed articles.</CardDescription><CardAction><Button asChild variant="outline" size="sm"><Link href="/admin/posts">View all</Link></Button></CardAction></CardHeader><CardContent className="px-0"><Table><TableHeader><TableRow><TableHead className="pl-6">Article</TableHead><TableHead>Status</TableHead><TableHead>Category</TableHead><TableHead>Updated</TableHead><TableHead className="pr-6 text-right"><span className="sr-only">Action</span></TableHead></TableRow></TableHeader><TableBody>{posts.slice(0, 5).map((post) => <TableRow key={post.slug}><TableCell className="pl-6"><p className="font-medium text-foreground">{post.title}</p><p className="mt-0.5 text-xs text-muted-foreground">/{post.slug}</p></TableCell><TableCell><Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge></TableCell><TableCell className="text-muted-foreground">{post.category}</TableCell><TableCell className="text-muted-foreground">{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(post.updatedAt))}</TableCell><TableCell className="pr-6 text-right"><Button asChild variant="ghost" size="sm"><Link href={`/admin/posts/${post.slug}/edit`}>Edit</Link></Button></TableCell></TableRow>)}</TableBody></Table>{posts.length === 0 ? <div className="grid place-items-center px-6 py-12 text-center"><span className="icon-[lucide--file-plus-2] mb-3 size-8 text-muted-foreground"/><p className="text-sm font-medium text-foreground">No posts yet</p><p className="mt-1 text-sm text-muted-foreground">Create your first article to see it here.</p><Button asChild size="sm" className="mt-4"><Link href="/admin/posts/new">Create post</Link></Button></div> : null}</CardContent></Card></>;
};
export default AdminDashboardPage;
