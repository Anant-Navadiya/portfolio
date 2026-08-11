import Image from "next/image";
import Link from "next/link";
import type { ProjectMetadata } from "@/content/projects/types";
import ProjectVisual from "@/components/projects/ProjectVisual";
const ProjectCard = ({ project, featured = false }: {
    project: ProjectMetadata;
    featured?: boolean;
}) => {
    return <article className={featured ? "grid overflow-hidden border bg-card md:grid-cols-[1.1fr_1fr]" : "overflow-hidden border bg-card"}><Link href={`/projects/${project.slug}`} className="block">{project.cover ? <Image src={project.cover.src} alt={project.cover.alt} width={1200} height={750} className="aspect-[16/10] w-full object-cover"/> : <ProjectVisual project={project}/>}</Link><div className="flex flex-col p-5 sm:p-6"><div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><span>{project.year}</span><span>·</span><span>{project.status}</span></div><h2 className="mt-3 text-xl font-semibold tracking-tight"><Link href={`/projects/${project.slug}`} className="hover:text-primary">{project.title}</Link></h2><p className="mt-3 text-sm leading-6">{project.summary}</p><div className="mt-4 flex flex-wrap gap-2">{project.technologies.slice(0, featured ? 6 : 4).map((technology) => <span key={technology} className="border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">{technology}</span>)}</div><Link href={`/projects/${project.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">View case study <span aria-hidden>→</span></Link></div></article>;
};
export default ProjectCard;
