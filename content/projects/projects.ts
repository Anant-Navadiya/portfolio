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
    {
        slug: "transpilex",
        title: "Transpilex",
        summary: "A python cli transpiler tool to convert html pages into the various frameworks.",
        outcome: "A converter tool that saves time drastically, and reduced workload",
        year: 2025,
        status: "completed",
        category: "tool",
        featured: true,
        role: "Designer and Developer",
        duration: "Few Weeks",
        technologies: ["Python", "Cookie Cutter"],
    },
] satisfies ProjectMetadata[];
export const getProjectMetadata = (slug: string) => {
    return projects.find((project) => project.slug === slug);
};
