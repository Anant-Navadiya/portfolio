"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const readingModeKey = "article-reading-mode";
const bookmarksKey = "article-bookmarks";
const readingPositionsKey = "article-reading-positions";
const readingModeEvent = "article-reading-mode-change";
const bookmarksEvent = "article-bookmarks-change";

type DockPanel = "contents" | "saved" | null;

type SavedPage = {
    path: string;
    title: string;
    savedAt: number;
};

type ReadingPosition = {
    progress: number;
    updatedAt: number;
    y: number;
};

type TocHeading = {
    id: string;
    level: 2 | 3;
    text: string;
};

const subscribeTo = (eventName: string, callback: () => void) => {
    const listener = () => callback();
    window.addEventListener("storage", listener);
    window.addEventListener(eventName, listener);
    return () => {
        window.removeEventListener("storage", listener);
        window.removeEventListener(eventName, listener);
    };
};

const pageTitleFromPath = (path: string) => {
    const segment = path.split("/").filter(Boolean).at(-1) ?? "Saved page";
    return segment.split("-").map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(" ");
};

const parseSavedPages = (raw: string): SavedPage[] => {
    try {
        const value = JSON.parse(raw) as unknown;
        if (!Array.isArray(value)) return [];
        return value.flatMap((item): SavedPage[] => {
            if (typeof item === "string") return [{ path: item, title: pageTitleFromPath(item), savedAt: 0 }];
            if (!item || typeof item !== "object") return [];
            const candidate = item as Partial<SavedPage>;
            if (typeof candidate.path !== "string") return [];
            return [{
                path: candidate.path,
                title: typeof candidate.title === "string" ? candidate.title : pageTitleFromPath(candidate.path),
                savedAt: typeof candidate.savedAt === "number" ? candidate.savedAt : 0,
            }];
        });
    }
    catch {
        return [];
    }
};

const readPositions = (): Record<string, ReadingPosition> => {
    try {
        const value = JSON.parse(window.localStorage.getItem(readingPositionsKey) ?? "{}") as Record<string, ReadingPosition>;
        return value && typeof value === "object" ? value : {};
    }
    catch {
        return {};
    }
};

const createHeadingId = (text: string, index: number) => {
    const slug = text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    return slug || `section-${index + 1}`;
};

const isContentDetailPath = (pathname: string) => /^\/(articles|projects)\/[^/]+$/.test(pathname);

const splitSpeechText = (text: string) => {
    const sentences = text.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];
    const chunks: string[] = [];
    let current = "";
    sentences.forEach((sentence) => {
        if (`${current} ${sentence}`.trim().length > 1300 && current) {
            chunks.push(current.trim());
            current = sentence;
        }
        else {
            current = `${current} ${sentence}`;
        }
    });
    if (current.trim()) chunks.push(current.trim());
    return chunks;
};

const DockButton = ({ label, active = false, disabled = false, onClick, children }: {
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button type="button" size="icon" variant={active ? "default" : "ghost"} disabled={disabled} aria-label={label} aria-pressed={active || undefined} onClick={onClick} className="rounded-full">{children}</Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>{label}</TooltipContent>
    </Tooltip>
);

const ArticleDock = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const pathname = usePathname();
    const contentPage = isContentDetailPath(pathname);
    const contentType = pathname.startsWith("/projects/") ? "project" : "article";
    const [mounted, setMounted] = useState(false);
    const [contentAvailable, setContentAvailable] = useState(false);
    const [activePanel, setActivePanel] = useState<DockPanel>(null);
    const [activeHeading, setActiveHeading] = useState("");
    const [canScrollToTop, setCanScrollToTop] = useState(false);
    const [headings, setHeadings] = useState<TocHeading[]>([]);
    const [progress, setProgress] = useState(0);
    const [resumePosition, setResumePosition] = useState<ReadingPosition | null>(null);
    const [shareComplete, setShareComplete] = useState(false);
    const [speechState, setSpeechState] = useState<"idle" | "paused" | "speaking">("idle");
    const speechChunksRef = useRef<string[]>([]);
    const speechIndexRef = useRef(0);
    const readingMode = useSyncExternalStore((callback) => subscribeTo(readingModeEvent, callback), () => window.localStorage.getItem(readingModeKey) === "true", () => false);
    const savedPagesSnapshot = useSyncExternalStore((callback) => subscribeTo(bookmarksEvent, callback), () => window.localStorage.getItem(bookmarksKey) ?? "[]", () => "[]");
    const savedPages = useMemo(() => parseSavedPages(savedPagesSnapshot), [savedPagesSnapshot]);
    const bookmarked = savedPages.some((page) => page.path === pathname);

    useEffect(() => {
        const timeout = window.setTimeout(() => setMounted(true), 0);
        return () => window.clearTimeout(timeout);
    }, []);

    useEffect(() => {
        document.documentElement.toggleAttribute("data-reading-mode", readingMode);
        return () => document.documentElement.removeAttribute("data-reading-mode");
    }, [readingMode]);

    useEffect(() => {
        let disposeScroll = () => {};
        const setup = window.setTimeout(() => {
            setActivePanel(null);
            setProgress(0);
            setResumePosition(null);
            setSpeechState("idle");
            window.speechSynthesis?.cancel();

            const content = contentPage ? document.querySelector<HTMLElement>(".article-post, .project-content") : null;
            const headingNodes = [...document.querySelectorAll<HTMLElement>(".mdx-content h2, .mdx-content h3")];
            const nextHeadings = headingNodes.map((heading, index) => {
                const id = heading.id || createHeadingId(heading.textContent ?? "", index);
                heading.id = id;
                return { id, level: heading.tagName === "H2" ? 2 as const : 3 as const, text: heading.textContent?.trim() || `Section ${index + 1}` };
            });
            setContentAvailable(Boolean(content));
            setHeadings(nextHeadings);

            const storedPosition = readPositions()[pathname];
            if (storedPosition?.y > 250 && storedPosition.progress < 96) setResumePosition(storedPosition);

            let saveTimer: number | undefined;
            const handleScroll = () => {
                const scrollable = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
                const nextProgress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
                setProgress(nextProgress);
                setCanScrollToTop(window.scrollY > 320);

                const currentHeading = [...headingNodes].reverse().find((heading) => heading.getBoundingClientRect().top <= 140);
                setActiveHeading(currentHeading?.id ?? nextHeadings[0]?.id ?? "");

                if (!content) return;
                window.clearTimeout(saveTimer);
                saveTimer = window.setTimeout(() => {
                    const positions = readPositions();
                    if (nextProgress >= 96) delete positions[pathname];
                    else if (window.scrollY > 200) positions[pathname] = { y: window.scrollY, progress: nextProgress, updatedAt: Date.now() };
                    window.localStorage.setItem(readingPositionsKey, JSON.stringify(positions));
                }, 500);
            };

            handleScroll();
            window.addEventListener("scroll", handleScroll, { passive: true });
            disposeScroll = () => {
                window.clearTimeout(saveTimer);
                window.removeEventListener("scroll", handleScroll);
            };
        }, 0);

        return () => {
            window.clearTimeout(setup);
            disposeScroll();
            window.speechSynthesis?.cancel();
        };
    }, [contentPage, pathname]);

    const toggleReadingMode = () => {
        window.localStorage.setItem(readingModeKey, String(!readingMode));
        window.dispatchEvent(new Event(readingModeEvent));
    };

    const writeSavedPages = (pages: SavedPage[]) => {
        window.localStorage.setItem(bookmarksKey, JSON.stringify(pages));
        window.dispatchEvent(new Event(bookmarksEvent));
    };

    const toggleBookmark = () => {
        const next = bookmarked
            ? savedPages.filter((page) => page.path !== pathname)
            : [{ path: pathname, title: document.querySelector("h1")?.textContent?.trim() || document.title, savedAt: Date.now() }, ...savedPages];
        writeSavedPages(next);
    };

    const removeSavedPage = (path: string) => writeSavedPages(savedPages.filter((page) => page.path !== path));

    const jumpToHeading = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `${pathname}#${id}`);
        setActivePanel(null);
    };

    const resumeReading = () => {
        if (!resumePosition) return;
        window.scrollTo({ top: resumePosition.y, behavior: "smooth" });
        setResumePosition(null);
    };

    const speakNextChunk = () => {
        const chunk = speechChunksRef.current[speechIndexRef.current];
        if (!chunk) {
            setSpeechState("idle");
            return;
        }
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.rate = 0.98;
        utterance.onend = () => {
            speechIndexRef.current += 1;
            speakNextChunk();
        };
        utterance.onerror = () => setSpeechState("idle");
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        if (!("speechSynthesis" in window)) return;
        if (speechState === "speaking") {
            window.speechSynthesis.pause();
            setSpeechState("paused");
            return;
        }
        if (speechState === "paused") {
            window.speechSynthesis.resume();
            setSpeechState("speaking");
            return;
        }
        const title = document.querySelector<HTMLElement>("main h1")?.innerText ?? "";
        const articleText = document.querySelector<HTMLElement>(".mdx-content")?.innerText ?? "";
        const chunks = splitSpeechText(`${title}. ${articleText}`);
        if (chunks.length === 0) return;
        window.speechSynthesis.cancel();
        speechChunksRef.current = chunks;
        speechIndexRef.current = 0;
        setSpeechState("speaking");
        speakNextChunk();
    };

    const sharePage = async () => {
        const data = { title: document.title, url: window.location.href };
        try {
            if (navigator.share) await navigator.share(data);
            else await navigator.clipboard.writeText(data.url);
            setShareComplete(true);
            window.setTimeout(() => setShareComplete(false), 1600);
        }
        catch (error) {
            if (!(error instanceof DOMException && error.name === "AbortError")) await navigator.clipboard.writeText(data.url);
        }
    };

    const panel = activePanel && contentPage ? (
        <aside role="dialog" aria-label={activePanel === "contents" ? "Table of contents" : "Saved pages"} className="fixed bottom-20 left-4 right-4 z-[45] max-h-[min(28rem,calc(100vh-7rem))] overflow-hidden rounded-2xl border bg-background/96 shadow-2xl shadow-foreground/15 backdrop-blur-xl sm:bottom-auto sm:left-20 sm:right-auto sm:top-1/2 sm:w-80 sm:-translate-y-1/2">
            <header className="flex items-center justify-between border-b px-4 py-3">
                <div>
                    <h2 className="text-sm font-semibold text-foreground">{activePanel === "contents" ? "On this page" : "Saved pages"}</h2>
                    <p className="text-[10px] leading-4 text-muted-foreground">{activePanel === "contents" ? `${headings.length} sections` : `${savedPages.length} saved`}</p>
                </div>
                <Button type="button" variant="ghost" size="icon-sm" className="rounded-full" aria-label="Close panel" onClick={() => setActivePanel(null)}><span className="icon-[lucide--x] size-4" /></Button>
            </header>
            <div className="max-h-80 overflow-y-auto p-2">
                {activePanel === "contents" ? headings.map((heading) => (
                    <button key={heading.id} type="button" onClick={() => jumpToHeading(heading.id)} className={`block w-full rounded-lg px-3 py-2 text-left text-xs leading-5 transition-colors hover:bg-muted ${heading.level === 3 ? "pl-6" : "font-medium"} ${activeHeading === heading.id ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>{heading.text}</button>
                )) : null}
                {activePanel === "saved" && savedPages.length === 0 ? <p className="px-3 py-10 text-center text-xs text-muted-foreground">Bookmark a page and it will appear here.</p> : null}
                {activePanel === "saved" ? savedPages.map((page) => (
                    <div key={page.path} className="group flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-muted">
                        <Link href={page.path} onClick={() => setActivePanel(null)} className="min-w-0 flex-1 px-1 py-1 no-underline"><span className="block truncate text-xs font-medium text-foreground">{page.title}</span><span className="block truncate text-[10px] text-muted-foreground">{page.path}</span></Link>
                        <Button type="button" variant="ghost" size="icon-sm" className="rounded-full opacity-60 hover:opacity-100" aria-label={`Remove ${page.title} from saved pages`} onClick={() => removeSavedPage(page.path)}><span className="icon-[lucide--x] size-3.5" /></Button>
                    </div>
                )) : null}
            </div>
        </aside>
    ) : null;

    return (
        <>
            <div className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-9rem)] overflow-x-auto rounded-full [scrollbar-width:none] sm:bottom-auto sm:left-5 sm:top-1/2 sm:max-w-none sm:-translate-y-1/2 sm:overflow-visible">
                <div role="toolbar" aria-label="Reading tools" className="flex w-max items-center gap-1 rounded-full border bg-background/90 p-1.5 shadow-lg shadow-foreground/10 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75 sm:flex-col">
                    {contentPage ? <>
                        <div role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} title={`${Math.round(progress)}% read`} className="grid size-8 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--primary) ${progress}%, var(--muted) 0)` }}><span className="grid size-6 place-items-center rounded-full bg-background text-[8px] font-semibold text-muted-foreground">{Math.round(progress)}%</span></div>
                        <DockButton label="Table of contents" active={activePanel === "contents"} disabled={headings.length === 0} onClick={() => setActivePanel((panelValue) => panelValue === "contents" ? null : "contents")}><span className="icon-[lucide--list-tree] size-4" /></DockButton>
                        <DockButton label={resumePosition ? `Resume at ${Math.round(resumePosition.progress)}%` : "No saved position"} active={Boolean(resumePosition)} disabled={!resumePosition} onClick={resumeReading}><span className="icon-[lucide--history] size-4" /></DockButton>
                        <DockButton label={speechState === "speaking" ? `Pause ${contentType}` : speechState === "paused" ? `Resume ${contentType}` : `Listen to ${contentType}`} active={speechState !== "idle"} disabled={!contentAvailable || !mounted} onClick={toggleListening}><span className={speechState === "speaking" ? "icon-[lucide--pause] size-4" : "icon-[lucide--headphones] size-4"} /></DockButton>
                        <Separator orientation="vertical" className="mx-1 h-5 sm:hidden" />
                        <Separator orientation="horizontal" className="my-1 hidden w-5 sm:block" />
                        <DockButton label={bookmarked ? "Remove bookmark" : `Bookmark ${contentType}`} active={bookmarked} onClick={toggleBookmark}><span className={bookmarked ? "icon-[lucide--bookmark-check] size-4" : "icon-[lucide--bookmark] size-4"} /></DockButton>
                        <DockButton label="View saved pages" active={activePanel === "saved"} onClick={() => setActivePanel((panelValue) => panelValue === "saved" ? null : "saved")}><span className="icon-[lucide--library] size-4" /></DockButton>
                        <DockButton label={shareComplete ? "Link copied" : `Share or copy ${contentType}`} active={shareComplete} onClick={() => void sharePage()}><span className={shareComplete ? "icon-[lucide--check] size-4" : "icon-[lucide--share-2] size-4"} /></DockButton>
                        <Separator orientation="vertical" className="mx-1 h-5 sm:hidden" />
                        <Separator orientation="horizontal" className="my-1 hidden w-5 sm:block" />
                    </> : null}
                    <DockButton label={readingMode ? "Use default colors" : "Use reading colors"} active={readingMode} onClick={toggleReadingMode}><span className={readingMode ? "icon-[lucide--book-open-check] size-4" : "icon-[lucide--book-open] size-4"} /></DockButton>
                    <DockButton label={resolvedTheme === "dark" ? "Use light theme" : "Use dark theme"} disabled={!mounted} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}><span suppressHydrationWarning className={resolvedTheme === "dark" ? "icon-[lucide--moon] size-4" : "icon-[lucide--sun] size-4"} /></DockButton>
                    <DockButton label="Back to top" disabled={!canScrollToTop} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span className="icon-[lucide--arrow-up] size-4" /></DockButton>
                </div>
            </div>
            {panel}
        </>
    );
};

export default ArticleDock;
