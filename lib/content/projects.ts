import type { ComponentType } from "react";
import { getProjectMetadata, projects } from "@/content/projects/projects";
import type { Project, ProjectMetadata } from "@/content/projects/types";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const getAllProjects = (): ProjectMetadata[] => {
    return [...projects].sort((a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year);
};
export const getFeaturedProjects = () => {
    return getAllProjects().filter((project) => project.featured);
};
export const getProject = async (slug: string): Promise<Project | undefined> => {
    if (!slugPattern.test(slug))
        return undefined;
    const metadata = getProjectMetadata(slug);
    if (!metadata)
        return undefined;
    try {
        const projectModule = (await import(`@/content/projects/posts/${slug}.mdx`)) as {
            default: ComponentType;
        };
        return { ...metadata, Component: projectModule.default };
    }
    catch {
        return undefined;
    }
};
