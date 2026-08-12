"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { SearchIndexEntry } from "@/lib/search-index";

const groupOrder: SearchIndexEntry["group"][] = ["Pages", "Articles", "Projects"];

const CommandPalette = () => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [entries, setEntries] = useState<SearchIndexEntry[] | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setOpen((value) => !value);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (!open || entries) return;
        void fetch("/api/search-index")
            .then((response) => response.json())
            .then((data: SearchIndexEntry[]) => setEntries(data))
            .catch(() => setEntries([]));
    }, [open, entries]);

    useEffect(() => {
        if (open) {
            setQuery("");
            setActiveIndex(0);
            const timeout = window.setTimeout(() => inputRef.current?.focus(), 0);
            return () => window.clearTimeout(timeout);
        }
    }, [open]);

    const filtered = useMemo(() => {
        if (!entries) return [];
        const normalized = query.trim().toLowerCase();
        if (!normalized) return entries;
        return entries.filter((entry) => `${entry.title} ${entry.description}`.toLowerCase().includes(normalized));
    }, [entries, query]);

    const grouped = useMemo(() => groupOrder
        .map((group) => ({ group, items: filtered.filter((entry) => entry.group === group) }))
        .filter(({ items }) => items.length > 0), [filtered]);

    useEffect(() => setActiveIndex(0), [query]);

    const navigate = (href: string) => {
        setOpen(false);
        router.push(href);
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
        }
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
        }
        else if (event.key === "Enter") {
            event.preventDefault();
            const target = filtered[activeIndex];
            if (target) navigate(target.href);
        }
    };

    let flatIndex = -1;

    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
                <span className="icon-[lucide--search] size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">⌘K</kbd>
            </button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0">
                    <DialogTitle>Search</DialogTitle>
                    <DialogDescription>Jump to any page, article, or project</DialogDescription>
                    <div className="flex items-center gap-2.5 border-b px-4 py-3">
                        <span className="icon-[lucide--search] size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            onKeyDown={handleInputKeyDown}
                            placeholder="Search articles, projects, and pages…"
                            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="max-h-80 overflow-y-auto py-2">
                        {entries === null ? <p className="px-4 py-6 text-center text-sm text-muted-foreground">Loading…</p> : null}
                        {entries && filtered.length === 0 ? <p className="px-4 py-6 text-center text-sm text-muted-foreground">No matches for &ldquo;{query}&rdquo;.</p> : null}
                        {grouped.map(({ group, items }) => (
                            <div key={group} className="px-2 py-1.5">
                                <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
                                {items.map((entry) => {
                                    flatIndex += 1;
                                    const isActive = flatIndex === activeIndex;
                                    return (
                                        <button
                                            key={entry.href}
                                            type="button"
                                            onClick={() => navigate(entry.href)}
                                            onMouseEnter={() => setActiveIndex(flatIndex)}
                                            className={cn("flex w-full flex-col items-start gap-0.5 px-2 py-2 text-left transition-colors", isActive ? "bg-accent text-accent-foreground" : "text-foreground")}
                                        >
                                            <span className="text-sm font-medium">{entry.title}</span>
                                            <span className="line-clamp-1 text-xs text-muted-foreground">{entry.description}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CommandPalette;
