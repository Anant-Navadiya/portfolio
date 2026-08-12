import "server-only";

import { getAllArticlePosts } from "@/lib/content/articles";
import { getAllProjects } from "@/lib/content/projects";

export type SearchIndexEntry = {
    title: string;
    description: string;
    href: string;
    group: "Pages" | "Articles" | "Projects";
};

const staticPages: SearchIndexEntry[] = [
    { title: "Home", description: "Back to the homepage", href: "/", group: "Pages" },
    { title: "About", description: "Background and working approach", href: "/about", group: "Pages" },
    { title: "Projects", description: "Selected work and case studies", href: "/projects", group: "Pages" },
    { title: "Articles", description: "Technical writing and notes", href: "/articles", group: "Pages" },
    { title: "Now", description: "What I'm currently doing", href: "/now", group: "Pages" },
    { title: "Uses", description: "Tools and everyday setup", href: "/uses", group: "Pages" },
    { title: "Contact", description: "Get in touch", href: "/contact", group: "Pages" },
];

export const getSearchIndex = async (): Promise<SearchIndexEntry[]> => {
    const [articles, projects] = await Promise.all([getAllArticlePosts(), Promise.resolve(getAllProjects())]);

    return [
        ...staticPages,
        ...articles.map((post): SearchIndexEntry => ({ title: post.title, description: post.description, href: `/articles/${post.slug}`, group: "Articles" })),
        ...projects.map((project): SearchIndexEntry => ({ title: project.title, description: project.summary, href: `/projects/${project.slug}`, group: "Projects" })),
    ];
};
