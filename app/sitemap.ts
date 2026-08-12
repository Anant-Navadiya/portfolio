import type { MetadataRoute } from "next";
import { connection } from "next/server";

import { getAllArticlePosts } from "@/lib/content/articles";
import { getAllProjects } from "@/lib/content/projects";
import { absoluteUrl } from "@/lib/site";

const staticRoutes = ["/", "/about", "/projects", "/articles", "/now", "/uses", "/contact"];

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    await connection();

    const [articles, projects] = await Promise.all([getAllArticlePosts(), Promise.resolve(getAllProjects())]);

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
        url: absoluteUrl(route),
        lastModified: new Date(),
        changeFrequency: route === "/articles" ? "weekly" : "monthly",
        priority: route === "/" ? 1 : 0.6,
    }));

    const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
        url: absoluteUrl(`/articles/${article.slug}`),
        lastModified: article.date ? new Date(article.date) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
        url: absoluteUrl(`/projects/${project.slug}`),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [...staticEntries, ...articleEntries, ...projectEntries];
};

export default sitemap;
