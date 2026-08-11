"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
    message: string;
    status: "error" | "idle" | "success";
};

const ContactForm = () => {
    const [pending, setPending] = useState(false);
    const [state, setState] = useState<FormState>({ status: "idle", message: "" });

    const submitContact = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        setPending(true);
        setState({ status: "idle", message: "" });

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.fromEntries(formData)),
            });
            const data = await response.json().catch(() => ({})) as { error?: string };
            if (!response.ok) throw new Error(data.error ?? "Unable to send your message.");
            form.reset();
            setState({ status: "success", message: "Thanks—your message is in Anant's inbox." });
        }
        catch (error) {
            setState({ status: "error", message: error instanceof Error ? error.message : "Unable to send your message." });
        }
        finally {
            setPending(false);
        }
    };

    return (
        <form onSubmit={(event) => void submitContact(event)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="Your name" /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@example.com" /></div>
            </div>
            <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" name="subject" minLength={3} maxLength={160} required placeholder="What would you like to discuss?" /></div>
            <div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" minLength={20} maxLength={5000} required rows={7} placeholder="Tell me a little about your idea, question, or opportunity." /></div>
            <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true"><Label htmlFor="website">Website</Label><Input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
            <div className="flex flex-wrap items-center gap-4">
                <Button type="submit" disabled={pending}>{pending ? <><span className="icon-[lucide--loader-circle] size-4 animate-spin" />Sending</> : <><span className="icon-[lucide--send] size-4" />Send message</>}</Button>
                <p aria-live="polite" className={`text-sm ${state.status === "error" ? "text-destructive" : state.status === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{state.message}</p>
            </div>
        </form>
    );
};

export default ContactForm;
