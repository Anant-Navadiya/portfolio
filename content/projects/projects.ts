import type { ProjectMetadata } from "@/content/projects/types";
export const projects = [
    {
        slug: "portfolio-content-platform",
        title: "Portfolio Content Platform",
        summary: "A personal publishing platform for technical articles, built around local MDX and database-backed editorial workflows.",
        outcome: "A focused portfolio and publishing system with protected content management, structured taxonomy, and fast MDX reading pages.",
        year: 2026,
        status: "active",
        category: "full-stack",
        featured: true,
        role: "Designer and full-stack developer",
        duration: "Ongoing",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle ORM", "Supabase", "Tailwind CSS"],
    },
] satisfies ProjectMetadata[];
export const getProjectMetadata = (slug: string) => {
    return projects.find((project) => project.slug === slug);
};
