import { deleteContactSubmission, updateContactStatus } from "@/app/admin/(panel)/contacts/actions";
import PageHeader from "@/components/admin/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getContactCounts, getContactSubmissions } from "@/lib/contact";

const ContactInboxPage = async () => {
    const [submissions, counts] = await Promise.all([getContactSubmissions(), getContactCounts()]);
    return (
        <>
            <PageHeader eyebrow="Messages" title="Contact inbox" description="Review messages submitted through the public contact form." />
            <div className="mb-5 flex flex-wrap gap-2"><Badge variant="outline">{counts.total} total</Badge><Badge variant={counts.unread > 0 ? "default" : "outline"}>{counts.unread} unread</Badge></div>
            <div className="space-y-4">
                {submissions.map((submission) => (
                    <Card key={submission.id} className={submission.status === "unread" ? "border-primary/40" : ""}>
                        <CardHeader>
                            <div>
                                <div className="flex flex-wrap items-center gap-2"><CardTitle>{submission.subject}</CardTitle><Badge variant={submission.status === "unread" ? "default" : submission.status === "archived" ? "secondary" : "outline"}>{submission.status}</Badge></div>
                                <CardDescription className="mt-1"><span className="font-medium text-foreground">{submission.name}</span> · <a href={`mailto:${submission.email}`} className="hover:text-foreground hover:underline">{submission.email}</a> · {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(submission.createdAt)}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/85">{submission.message}</p>
                            <div className="mt-6 flex flex-wrap gap-2">
                                <Button asChild size="sm"><a href={`mailto:${submission.email}?subject=${encodeURIComponent(`Re: ${submission.subject}`)}`}><span className="icon-[lucide--reply] size-3.5" />Reply</a></Button>
                                {submission.status !== "read" ? <form action={updateContactStatus}><input type="hidden" name="id" value={submission.id} /><input type="hidden" name="status" value="read" /><Button type="submit" variant="outline" size="sm"><span className="icon-[lucide--mail-open] size-3.5" />Mark read</Button></form> : null}
                                {submission.status !== "archived" ? <form action={updateContactStatus}><input type="hidden" name="id" value={submission.id} /><input type="hidden" name="status" value="archived" /><Button type="submit" variant="outline" size="sm"><span className="icon-[lucide--archive] size-3.5" />Archive</Button></form> : null}
                                {submission.status === "archived" ? <form action={updateContactStatus}><input type="hidden" name="id" value={submission.id} /><input type="hidden" name="status" value="unread" /><Button type="submit" variant="outline" size="sm"><span className="icon-[lucide--archive-restore] size-3.5" />Restore</Button></form> : null}
                                <form action={deleteContactSubmission} className="ml-auto"><input type="hidden" name="id" value={submission.id} /><Button type="submit" variant="destructive" size="sm"><span className="icon-[lucide--trash-2] size-3.5" />Delete</Button></form>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {submissions.length === 0 ? <Card><CardContent className="grid place-items-center py-16 text-center"><span className="icon-[lucide--inbox] mb-3 size-10 text-muted-foreground" /><p className="font-medium text-foreground">Your inbox is empty</p><p className="mt-1 text-sm">New contact submissions will appear here.</p></CardContent></Card> : null}
            </div>
        </>
    );
};

export default ContactInboxPage;
