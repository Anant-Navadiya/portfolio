import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { projects } from "@/content/projects/projects";
import { aboutSections, workingPrinciples } from "@/content/site/about";
import { nowItems, nowUpdatedAt } from "@/content/site/now";
import { usesGroups } from "@/content/site/uses";
import { getAllArticlePosts } from "@/lib/content/articles";

type KnowledgeChunk = {
    title: string;
    url: string;
    text: string;
    keywords: string[];
};

const companionProfilePath = path.join(process.cwd(), "content/site/companion-about.md");

const sitePageChunks: KnowledgeChunk[] = [
    {
        title: "What Anant is doing now",
        url: "/now",
        text: `${nowUpdatedAt}. ${nowItems.flatMap((item) => [item.title, item.detail]).join(" ")}`,
        keywords: ["now", "current", "studying", "building", "exploring", "available"],
    },
    {
        title: "Tools Anant uses",
        url: "/uses",
        text: usesGroups.flatMap((group) => [group.title, group.description, ...group.items.flatMap((item) => [item.name, item.detail])]).join(" "),
        keywords: ["uses", "tools", "stack", "software", "workflow"],
    },
];

const stripMdx = (value: string) => value
    .replace(/^import\s+.*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`>|{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const loadProfile = async (): Promise<KnowledgeChunk> => {
    let text = "";

    try {
        text = stripMdx(await fs.readFile(companionProfilePath, "utf8"));
    }
    catch {
        text = [...aboutSections.flatMap((section) => [section.title, ...section.paragraphs]), ...workingPrinciples].join(" ");
    }

    return {
        title: "About Anant",
        url: "/about",
        text,
        keywords: ["anant", "about", "developer", "full-stack", "artificial intelligence", "ai", "student", "education", "study", "university", "germany", "oth", "background", "interests", "experience", "him", "he"],
    };
};

const readContent = async (directory: string, slug: string) => {
    try {
        return stripMdx(await fs.readFile(path.join(process.cwd(), directory, `${slug}.mdx`), "utf8"));
    }
    catch {
        return "";
    }
};

const tokenize = (value: string): string[] => value.toLowerCase().match(/[a-z0-9+#.-]{2,}/g) ?? [];

const loadKnowledge = async (): Promise<{ chunks: KnowledgeChunk[]; profile: KnowledgeChunk }> => {
    const profile = await loadProfile();
    const projectChunks = await Promise.all(projects.map(async (project) => ({
        title: project.title,
        url: `/projects/${project.slug}`,
        text: [project.summary, project.outcome, project.role, await readContent("content/projects/posts", project.slug)].join(" "),
        keywords: [project.category, project.status, ...project.technologies],
    })));

    const articles = await getAllArticlePosts();
    const articleChunks = await Promise.all(articles.map(async (article) => ({
        title: article.title,
        url: `/articles/${article.slug}`,
        text: [article.description, await readContent("content/articles/posts", article.slug)].join(" "),
        keywords: [article.category, article.subcategory ?? "", ...article.tags],
    })));

    return { chunks: [profile, ...sitePageChunks, ...projectChunks, ...articleChunks], profile };
};

export const retrievePortfolioContext = async (query: string, currentPath = "/") => {
    const queryTokens = new Set(tokenize(query));
    const { chunks, profile } = await loadKnowledge();
    const ranked = chunks.map((chunk) => {
        const titleTokens = tokenize(`${chunk.title} ${chunk.keywords.join(" ")}`);
        const contentTokens = new Set(tokenize(chunk.text));
        const score = [...queryTokens].reduce((total, token) => total + (titleTokens.includes(token) ? 4 : 0) + (contentTokens.has(token) ? 1 : 0), 0) + (chunk.url === currentPath ? 10 : 0);
        return { chunk, score };
    }).sort((a, b) => b.score - a.score);

    const selected = ranked.filter((item) => item.score > 0).slice(0, 4).map((item) => item.chunk);
    if (!selected.includes(profile)) selected.push(profile);

    return selected.map((item, index) => `[Source ${index + 1}: ${item.title}]\nURL: ${item.url}\n${item.text.slice(0, 3500)}`).join("\n\n");
};
