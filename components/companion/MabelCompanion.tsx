"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import MabelPet from "@/components/companion/MabelPet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { MabelAction, MabelMood, MabelResponse, MabelSkin, MabelUIMessage } from "@/lib/companion/types";

const skins: { id: MabelSkin; label: string }[] = [
    { id: "mabel", label: "Mabel" },
    { id: "red-panda", label: "Red panda" },
    { id: "robot", label: "Pixel bot" },
    { id: "fox", label: "Fox" },
    { id: "axolotl", label: "Axolotl" },
    { id: "owl", label: "Scholar owl" },
    { id: "dragon", label: "Tiny dragon" },
    { id: "astronaut", label: "Astronaut" },
    { id: "forest-spirit", label: "Forest spirit" },
    { id: "ghost", label: "Friendly ghost" },
    { id: "capybara", label: "Capybara" },
    { id: "raccoon", label: "Raccoon" },
    { id: "slime", label: "Cosmic slime" },
];

const storageKeys = {
    skin: "mabel-companion-skin",
    legacyBotyuSkin: "botyu-companion-skin",
    legacyNaviSkin: "navi-companion-skin",
    visits: "mabel-companion-visits",
    legacyBotyuVisits: "botyu-companion-visits",
    legacyNaviVisits: "navi-companion-visits",
};

const skinEvent = "mabel-companion-skin-change";

type SpeechRecognitionInstance = {
    lang: string;
    interimResults: boolean;
    onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
};

const subscribeToSkin = (callback: () => void) => {
    window.addEventListener("storage", callback);
    window.addEventListener(skinEvent, callback);
    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(skinEvent, callback);
    };
};

const getSkin = (): MabelSkin => {
    const stored = window.localStorage.getItem(storageKeys.skin)
        ?? window.localStorage.getItem(storageKeys.legacyBotyuSkin)
        ?? window.localStorage.getItem(storageKeys.legacyNaviSkin);
    const migrated = stored === "navi" ? "mabel" : stored;
    return skins.some((item) => item.id === migrated) ? migrated as MabelSkin : "mabel";
};

const getResponse = (message?: MabelUIMessage): Partial<MabelResponse> | null => {
    if (!message) return null;
    const part = message.parts.find((item) => item.type === "tool-respond");
    if (!part || part.type !== "tool-respond") return null;
    if (part.state === "output-available") return part.output;
    if ("input" in part && part.input) return part.input as Partial<MabelResponse>;
    return null;
};

const messageText = (message: MabelUIMessage) => {
    const response = getResponse(message);
    if (response?.answer) return response.answer;
    return message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join(" ")
        .trim();
};

const getPageSuggestions = (pathname: string) => {
    if (pathname.startsWith("/articles/")) return ["Explain this article simply", "What are the key ideas?", "What should I read next?"];
    if (pathname === "/articles") return ["Recommend an article", "What does Anant write about?", "Show me the latest article"];
    if (pathname.startsWith("/projects/")) return ["Explain this project", "What technology does it use?", "What did Anant learn?"];
    if (pathname === "/projects") return ["Which project should I see first?", "Show me Anant's AI work", "What technologies does he use?"];
    return ["What does Anant build?", "Show me his projects", "What is he studying?"];
};

const getPageGreeting = (pathname: string, welcomeBack: boolean) => {
    const prefix = welcomeBack ? "Welcome back! " : "Hi, I'm Mabel! ";
    if (pathname.startsWith("/articles/")) return `${prefix}I'm reading along. Ask me to explain this article or help you find a related one.`;
    if (pathname === "/articles") return `${prefix}I brought my reading list. I can help you choose something Anant has written.`;
    if (pathname.startsWith("/projects/")) return `${prefix}This project has my attention. Ask me how it works or what Anant learned from it.`;
    if (pathname === "/projects") return `${prefix}You're in Anant's project workshop. I can point you toward the most relevant build.`;
    return `${prefix}I'm Anant Navadiya's companion. Ask me about Anant, his work, or anything published here.`;
};

const getPageAction = (pathname: string): MabelAction => {
    if (pathname.startsWith("/articles")) return "read";
    if (pathname.startsWith("/projects")) return "point";
    return "wave";
};

const RichText = ({ text }: { text: string }) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return (
        <span className="whitespace-pre-wrap">
            {parts.map((part, index) => {
                const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                if (!match) return <span key={`${part}-${index}`}>{part}</span>;
                const internal = match[2].startsWith("/projects/") || match[2].startsWith("/articles/");
                return internal ? (
                    <Link key={`${part}-${index}`} href={match[2]} className="my-2 flex items-center gap-2.5 rounded-xl border bg-background/70 p-2.5 no-underline transition-colors hover:bg-background">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                            <span className={match[2].startsWith("/projects/") ? "icon-[lucide--briefcase-business] size-4" : "icon-[lucide--file-text] size-4"} />
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="block text-xs font-medium text-foreground">{match[1]}</span>
                            <span className="block truncate text-[10px] text-muted-foreground">{match[2]}</span>
                        </span>
                        <span className="icon-[lucide--arrow-up-right] size-3.5 text-muted-foreground" />
                    </Link>
                ) : (
                    <Link key={`${part}-${index}`} href={match[2]} className="font-medium text-primary underline underline-offset-2">{match[1]}</Link>
                );
            })}
        </span>
    );
};

const MabelCompanion = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [localMood, setLocalMood] = useState<MabelMood>("idle");
    const [localAction, setLocalAction] = useState<MabelAction>("idle");
    const [skinMenuOpen, setSkinMenuOpen] = useState(false);
    const [listening, setListening] = useState(false);
    const [voiceAvailable, setVoiceAvailable] = useState(false);
    const [welcomeBack, setWelcomeBack] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [copied, setCopied] = useState(false);
    const skin = useSyncExternalStore(subscribeToSkin, getSkin, () => "mabel" as MabelSkin);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

    const transport = useMemo(() => new DefaultChatTransport({
        api: "/api/companion",
        prepareSendMessagesRequest: ({ messages }) => ({ body: { messages: messages.slice(-8), pagePath: pathname } }),
    }), [pathname]);
    const { messages, sendMessage, status, stop, error, setMessages } = useChat<MabelUIMessage>({ transport });
    const busy = status === "submitted" || status === "streaming";

    const latestAssistant = useMemo(() => [...messages].reverse().find((message) => message.role === "assistant"), [messages]);
    const latestUser = useMemo(() => [...messages].reverse().find((message) => message.role === "user"), [messages]);
    const response = getResponse(latestAssistant);
    const pageSuggestions = useMemo(() => getPageSuggestions(pathname), [pathname]);
    const suggestions = response?.suggestions?.filter((suggestion): suggestion is string => typeof suggestion === "string" && suggestion.length > 0).slice(0, 3) ?? pageSuggestions;
    const answer = error
        ? "I got a little tangled up. Please try that question again."
        : response?.answer
            ? response.answer
            : busy
                ? "Give me a moment—I'm thinking about that."
                : getPageGreeting(pathname, welcomeBack);
    const mood: MabelMood = error ? "confused" : busy && !response?.answer ? "thinking" : response?.mood ?? localMood;
    const action: MabelAction = busy && !response?.answer ? "idle" : response?.action ?? localAction;

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            try {
                const rawVisits = window.localStorage.getItem(storageKeys.visits)
                    ?? window.localStorage.getItem(storageKeys.legacyBotyuVisits)
                    ?? window.localStorage.getItem(storageKeys.legacyNaviVisits)
                    ?? "{}";
                const visits = JSON.parse(rawVisits) as Record<string, number>;
                setWelcomeBack((visits[pathname] ?? 0) > 0);
                visits[pathname] = (visits[pathname] ?? 0) + 1;
                window.localStorage.setItem(storageKeys.visits, JSON.stringify(visits));
                window.localStorage.removeItem("mabel-companion-messages");
                window.localStorage.removeItem("botyu-companion-messages");
                window.localStorage.removeItem("navi-companion-messages");
            }
            catch {
                // Ignore corrupt local companion state.
            }

            const speechWindow = window as unknown as {
                SpeechRecognition?: new () => SpeechRecognitionInstance;
                webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
            };
            setVoiceAvailable(Boolean(speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition));
            setLocalAction(getPageAction(pathname));
        }, 0);
        return () => window.clearTimeout(timeout);
    }, [pathname, setMessages]);

    useEffect(() => {
        if (messages.length === 0) return;
        const clearContext = window.setTimeout(() => setMessages([]), 15 * 60 * 1000);
        return () => window.clearTimeout(clearContext);
    }, [messages, setMessages]);

    useEffect(() => {
        const sleep = window.setTimeout(() => {
            if (!open && !busy) {
                setLocalMood("sleeping");
                setLocalAction("idle");
            }
        }, 30000);
        const hint = window.setTimeout(() => {
            if (!open) setShowHint(true);
        }, 7000);
        return () => {
            window.clearTimeout(sleep);
            window.clearTimeout(hint);
        };
    }, [busy, open, pathname]);

    useEffect(() => {
        if (!open) return;
        const reset = window.setTimeout(() => {
            if (!busy && !response) {
                setLocalMood("idle");
                setLocalAction(getPageAction(pathname));
            }
        }, 2200);
        return () => window.clearTimeout(reset);
    }, [busy, open, pathname, response]);

    const ask = (text: string) => {
        if (!text.trim() || busy) return;
        setLocalMood("thinking");
        setLocalAction("idle");
        void sendMessage({ text: text.trim().slice(0, 500) });
        setInput("");
    };

    const selectSkin = (next: MabelSkin) => {
        window.localStorage.setItem(storageKeys.skin, next);
        window.dispatchEvent(new Event(skinEvent));
        setSkinMenuOpen(false);
        setLocalMood("love");
        setLocalAction("celebrate");
    };

    const toggleSkinMenu = () => {
        const next = !skinMenuOpen;
        setSkinMenuOpen(next);
        if (next) setLocalMood("starstruck");
    };

    const speakAnswer = () => {
        if (!answer || !("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer));
    };

    const copyAnswer = async () => {
        if (!response?.answer) return;
        await navigator.clipboard.writeText(response.answer);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    const toggleListening = () => {
        if (listening) {
            recognitionRef.current?.stop();
            return;
        }
        const speechWindow = window as unknown as {
            SpeechRecognition?: new () => SpeechRecognitionInstance;
            webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
        };
        const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
        if (!Recognition) return;
        const recognition = new Recognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1]?.[0]?.transcript ?? "";
            setInput(transcript);
            setLocalMood("listening");
        };
        recognition.onend = () => setListening(false);
        recognition.onerror = () => {
            setListening(false);
            setLocalMood("confused");
        };
        recognitionRef.current = recognition;
        setListening(true);
        setLocalMood("listening");
        recognition.start();
    };

    const openCompanion = () => {
        setOpen(true);
        setShowHint(false);
        setLocalMood("happy");
        setLocalAction("wave");
    };

    return (
        <>
            {open ? (
                <section role="dialog" aria-label="Ask Mabel about Anant" className="mabel-stage fixed bottom-3 right-3 z-50 w-[min(27rem,calc(100vw-1.5rem))] overflow-visible rounded-[2rem] border bg-background/94 shadow-2xl shadow-foreground/15 backdrop-blur-xl sm:bottom-6 sm:right-6">
                    <span className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-[72%]">
                        <MabelPet size="compact" skin={skin} mood={mood} action="idle" className="mabel-holder" />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-[55%] bg-[radial-gradient(circle_at_50%_110%,color-mix(in_oklch,var(--primary)_25%,transparent),transparent_65%)]" />
                    <header className="relative z-20 flex items-center justify-between px-4 pt-3">
                        <div className="flex items-center gap-2 rounded-full border bg-background/75 px-2.5 py-1.5 shadow-sm backdrop-blur">
                            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgb(16_185_129_/_12%)]" />
                            <span className="text-[11px] font-medium text-foreground">Mabel</span>
                            <span className="text-[10px] text-muted-foreground">Anant&apos;s companion</span>
                        </div>
                        <div className="flex items-center rounded-full border bg-background/75 p-1 shadow-sm backdrop-blur">
                            <Button type="button" variant="ghost" size="icon-sm" className="rounded-full" aria-label="Choose Mabel's outfit" onClick={toggleSkinMenu}><span className="icon-[lucide--shirt] size-3.5" /></Button>
                            <Button type="button" variant="ghost" size="icon-sm" className="rounded-full" aria-label="Close Mabel" onClick={() => setOpen(false)}><span className="icon-[lucide--x] size-4" /></Button>
                        </div>
                    </header>

                    {skinMenuOpen ? (
                        <div className="absolute right-4 top-14 z-30 max-h-[min(28rem,calc(100vh-6rem))] w-72 overflow-y-auto rounded-2xl border bg-popover p-2.5 text-popover-foreground shadow-xl">
                            <p className="px-2 pb-2 pt-1 text-xs font-medium text-foreground">Choose Mabel&apos;s outfit</p>
                            <div className="grid grid-cols-3 gap-1.5">
                                {skins.map((item) => (
                                    <button key={item.id} type="button" onClick={() => selectSkin(item.id)} className={`grid place-items-center gap-1 rounded-xl p-2 text-[10px] transition-colors hover:bg-muted ${skin === item.id ? "bg-muted ring-1 ring-primary" : ""}`}>
                                        <MabelPet size="tiny" skin={item.id} />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="relative z-10 px-4 pb-4 pt-3">
                        <div className="mabel-speech relative max-h-52 min-h-28 overflow-y-auto rounded-2xl border bg-card/95 p-4 pr-12 text-sm leading-6 text-card-foreground shadow-lg shadow-foreground/5" aria-live="polite" aria-busy={busy}>
                            {latestUser && latestAssistant ? <p className="mb-1 truncate text-[10px] leading-4 text-muted-foreground">You asked: {messageText(latestUser)}</p> : null}
                            <RichText text={answer} />
                            {busy && !response?.answer ? <span className="ml-1 inline-flex translate-y-0.5 gap-1"><span className="size-1 animate-bounce rounded-full bg-primary [animation-delay:-.2s]" /><span className="size-1 animate-bounce rounded-full bg-primary [animation-delay:-.1s]" /><span className="size-1 animate-bounce rounded-full bg-primary" /></span> : null}
                            {response?.answer ? (
                                <span className="absolute right-2 top-2 flex rounded-full bg-muted/70 p-0.5">
                                    <button type="button" onClick={speakAnswer} className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground" aria-label="Read Mabel's answer"><span className="icon-[lucide--volume-2] size-3.5" /></button>
                                    <button type="button" onClick={() => void copyAnswer()} className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground" aria-label="Copy Mabel's answer"><span className={copied ? "icon-[lucide--check] size-3.5 text-emerald-500" : "icon-[lucide--copy] size-3.5"} /></button>
                                </span>
                            ) : null}
                        </div>

                        {!busy ? (
                            <div className="mb-2 mt-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                                {suggestions.map((suggestion) => (
                                    <button key={suggestion} type="button" onClick={() => ask(suggestion)} className="shrink-0 rounded-full border bg-background/80 px-3 py-1.5 text-[10px] font-medium text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:text-foreground">
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        ) : null}

                        {busy ? (
                            <button type="button" onClick={stop} className="mx-auto flex h-11 items-center gap-2 rounded-full border bg-background/80 px-4 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:text-foreground">
                                <span className="icon-[lucide--square] size-3" /> Stop thinking
                            </button>
                        ) : (
                            <form onSubmit={(event) => { event.preventDefault(); ask(input); }} className="flex items-end gap-1.5 rounded-2xl border bg-background/90 p-1.5 shadow-lg shadow-foreground/5">
                                {voiceAvailable ? <Button type="button" size="icon" variant={listening ? "default" : "ghost"} className="shrink-0 rounded-xl" aria-label={listening ? "Stop listening" : "Ask with voice"} onClick={toggleListening}><span className={listening ? "icon-[lucide--audio-waveform] size-4 animate-pulse" : "icon-[lucide--mic] size-4"} /></Button> : null}
                                <Textarea value={input} onFocus={() => setLocalMood("listening")} onBlur={() => setLocalMood("idle")} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); ask(input); } }} maxLength={500} rows={1} placeholder="Ask Mabel about Anant…" aria-label="Ask Mabel about Anant" className="max-h-24 min-h-9 resize-none border-0 bg-transparent py-2 text-sm shadow-none focus-visible:ring-0" />
                                <Button type="submit" size="icon" className="shrink-0 rounded-xl" aria-label="Ask Mabel" disabled={!input.trim()}><span className="icon-[lucide--arrow-up] size-4" /></Button>
                            </form>
                        )}
                        <p className="mt-2 text-center text-[9px] leading-4 text-muted-foreground">Knows Anant&apos;s public work · Short-term session context · AI may make mistakes</p>
                    </div>
                </section>
            ) : (
                <button type="button" onMouseEnter={() => { setLocalMood("curious"); setLocalAction("wave"); }} onMouseLeave={() => { setLocalMood("idle"); setLocalAction("idle"); }} onClick={openCompanion} aria-label="Ask Mabel about Anant" aria-expanded={false} className="group fixed bottom-3 right-3 z-40 grid h-28 w-24 place-items-end justify-items-center outline-none focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-ring sm:bottom-5 sm:right-5">
                    {showHint ? <span className="mabel-hint absolute bottom-[88%] right-[70%] w-max max-w-48 rounded-2xl rounded-br-sm border bg-background/95 px-3 py-2 text-left text-[10px] font-medium leading-4 text-foreground shadow-lg backdrop-blur">Curious about Anant?<span className="ml-1">Ask me.</span></span> : null}
                    <MabelPet size="compact" skin={skin} mood={mood} action={action} className="origin-bottom transition-transform duration-300 group-hover:scale-110" />
                    <span className="absolute bottom-0 rounded-full border bg-background/90 px-2 py-0.5 text-[9px] font-semibold text-foreground shadow-sm backdrop-blur">Mabel</span>
                </button>
            )}
        </>
    );
};

export default MabelCompanion;
