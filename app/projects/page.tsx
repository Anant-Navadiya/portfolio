import type { Metadata } from "next";
import ProjectCard from "@/components/projects/ProjectCard";
import { getAllProjects } from "@/lib/content/projects";
import Navbar from "@/layouts/components/navbar";
export const metadata: Metadata = {
    title: "Projects | Anant Navadiya",
    description: "Selected full-stack and AI projects, including architecture, decisions, and lessons learned.",
};
const ProjectsPage = () => {
    const projects = getAllProjects();
    const featured = projects.filter((project) => project.featured);
    const otherProjects = projects.filter((project) => !project.featured);
    return (<>
      <Navbar />
      <main className="my-10 space-y-12">
        <header className="space-y-4 border-b pb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">Selected work</p>
          <h1 className="text-4xl font-semibold tracking-tight">Projects built around real problems</h1>
          <p className="max-w-2xl">Case studies covering product decisions, system architecture, implementation trade-offs, and what I learned along the way.</p>
        </header>

        {featured.length > 0 && <section className="space-y-5"><div className="flex items-end justify-between border-b pb-3"><div><p className="text-xs font-medium uppercase tracking-wider text-primary">Highlights</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Featured projects</h2></div><span className="text-sm text-muted-foreground">{featured.length} {featured.length === 1 ? "project" : "projects"}</span></div><div className="space-y-5">{featured.map((project) => <ProjectCard key={project.slug} project={project} featured/>)}</div></section>}

        {otherProjects.length > 0 && <section className="space-y-5"><div className="flex items-center justify-between border-b pb-3"><h2 className="text-2xl font-semibold tracking-tight">More projects</h2><span className="text-sm text-muted-foreground">{otherProjects.length} projects</span></div><div className="grid gap-5 sm:grid-cols-2">{otherProjects.map((project) => <ProjectCard key={project.slug} project={project}/>)}</div></section>}

        {projects.length === 0 && <div className="border bg-card p-8 text-center"><p>No projects have been published yet.</p></div>}
      </main>
    </>);
};
export default ProjectsPage;
