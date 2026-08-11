import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectVisual from "@/components/projects/ProjectVisual";
import { Button } from "@/components/ui/button";
import { projects } from "@/content/projects/projects";
import { getProject } from "@/lib/content/projects";
import Navbar from "@/layouts/components/navbar";
type ProjectPageProps = {
    params: Promise<{
        slug: string;
    }>;
};
export const dynamicParams = false;
export const generateStaticParams = () => {
    return projects.map((project) => ({ slug: project.slug }));
};
export const generateMetadata = async ({ params }: ProjectPageProps): Promise<Metadata> => {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project)
        return { title: "Projects | Anant Navadiya" };
    return { title: `${project.title} | Projects`, description: project.summary };
};
const ProjectPage = async ({ params }: ProjectPageProps) => {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project)
        notFound();
    const Content = project.Component;
    return <><Navbar /><main className="my-10"><article><header className="border-b pb-10"><Link href="/projects" className="inline-flex items-center gap-2 text-sm text-primary hover:underline"><span aria-hidden>←</span> All projects</Link><div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"><span>{project.category}</span><span>·</span><span>{project.year}</span><span>·</span><span>{project.status}</span></div><h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1><p className="mt-5 text-lg leading-8">{project.outcome}</p><div className="mt-7 flex flex-wrap gap-3">{project.demo && <Button asChild><a href={project.demo} target="_blank" rel="noreferrer"><span className="icon-[lucide--external-link] size-4"/>Live demo</a></Button>}{project.repository && <Button asChild variant="outline"><a href={project.repository} target="_blank" rel="noreferrer"><span className="icon-[lucide--github] size-4"/>Source code</a></Button>}</div><dl className="mt-8 grid gap-5 border-y py-5 text-sm sm:grid-cols-3"><div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Role</dt><dd className="mt-1 font-medium">{project.role}</dd></div><div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Duration</dt><dd className="mt-1 font-medium">{project.duration}</dd></div><div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Stack</dt><dd className="mt-1 font-medium">{project.technologies.slice(0, 3).join(", ")}</dd></div></dl>{project.cover ? <Image src={project.cover.src} alt={project.cover.alt} width={1200} height={750} priority className="mt-8 aspect-[16/10] w-full border object-cover"/> : <ProjectVisual project={project} className="mt-8"/>}</header><div className="project-content mdx-content"><Content /></div><footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t pt-6"><div><p className="text-sm font-medium text-foreground">Interested in the implementation?</p><p className="text-sm">I’m happy to discuss the decisions behind this project.</p></div><Button asChild variant="outline"><Link href="/projects">More projects</Link></Button></footer></article></main></>;
};
export default ProjectPage;
