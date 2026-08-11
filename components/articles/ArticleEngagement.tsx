"use client";

import { useEffect, useState } from "react";

type ArticleEngagementProps = {
    initialUsefulCount: number;
    initialViews: number;
    slug: string;
};

type StatsResponse = {
    usefulCount?: number;
    views?: number;
};

const usefulStorageKey = "useful-article-slugs";

const readUsefulSlugs = () => {
    try {
        const value = JSON.parse(window.localStorage.getItem(usefulStorageKey) ?? "[]") as unknown;
        return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
    }
    catch {
        return [];
    }
};

const ArticleEngagement = ({ initialUsefulCount, initialViews, slug }: ArticleEngagementProps) => {
    const [useful, setUseful] = useState(false);
    const [usefulCount, setUsefulCount] = useState(initialUsefulCount);
    const [views, setViews] = useState(initialViews);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setUseful(readUsefulSlugs().includes(slug));
            const viewKey = `article-viewed:${slug}`;
            if (window.sessionStorage.getItem(viewKey)) return;
            window.sessionStorage.setItem(viewKey, "true");
            void fetch(`/api/articles/${slug}/engagement`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "view" }),
            }).then(async (response) => {
                if (!response.ok) return;
                const stats = await response.json() as StatsResponse;
                if (typeof stats.views === "number") setViews(stats.views);
                if (typeof stats.usefulCount === "number") setUsefulCount(stats.usefulCount);
            }).catch(() => undefined);
        }, 0);
        return () => window.clearTimeout(timeout);
    }, [slug]);

    const markUseful = async () => {
        if (useful || pending) return;
        setPending(true);
        try {
            const response = await fetch(`/api/articles/${slug}/engagement`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "useful" }),
            });
            if (!response.ok) return;
            const stats = await response.json() as StatsResponse;
            const nextSlugs = [...new Set([...readUsefulSlugs(), slug])];
            window.localStorage.setItem(usefulStorageKey, JSON.stringify(nextSlugs));
            setUseful(true);
            if (typeof stats.views === "number") setViews(stats.views);
            if (typeof stats.usefulCount === "number") setUsefulCount(stats.usefulCount);
        }
        finally {
            setPending(false);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="icon-[lucide--eye] size-3.5" />{views.toLocaleString()} views</span>
            <button type="button" onClick={() => void markUseful()} disabled={useful || pending} aria-pressed={useful} className={`inline-flex items-center gap-1.5 transition-colors ${useful ? "text-primary" : "hover:text-foreground"}`}><span className={useful ? "icon-[lucide--badge-check] size-3.5" : "icon-[lucide--thumbs-up] size-3.5"} />{useful ? "Marked useful" : "Useful"} · {usefulCount.toLocaleString()}</button>
        </div>
    );
};

export default ArticleEngagement;
