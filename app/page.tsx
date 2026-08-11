import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import { getFeaturedProjects } from "@/lib/content/projects";
import { getAllArticlePosts } from "@/lib/content/articles";
import Footer from "@/layouts/components/footer";
import Navbar from "@/layouts/components/navbar";

export const metadata: Metadata = {
    title: "Anant Navadiya — Full-stack developer and AI student",
    description: "Anant Navadiya is a full-stack developer and Artificial Intelligence master's student building practical web products, AI systems, and technical writing.",
};

const externalLinks = [
    { label: "GitHub", href: "https://github.com/Anant-Navadiya" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/anant-navadiya-97a395245" },
    { label: "X", href: "https://x.com/anant_navadiya" },
];

const Page = async () => {
    await connection();
    const projects = getFeaturedProjects().slice(0, 3);
    const articles = (await getAllArticlePosts()).slice(0, 3);

    return (
        <>
            <Navbar />

            <main className="pb-16 pt-12 sm:pb-24 sm:pt-20">
                <section aria-labelledby="introduction" className="max-w-2xl">
                    <p className="mb-4 text-sm font-medium text-primary">Hello, I&apos;m Anant.</p>
                    <h1 id="introduction" className="text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">I build thoughtful software for the web and explore what&apos;s possible with AI.</h1>
                    <div className="mt-8 space-y-5 text-[1.0625rem] leading-8 text-muted-foreground">
                        <p>I&apos;m a full-stack developer who enjoys turning complicated requirements into clear, practical products. I care about the small details, but I&apos;m equally interested in the systems and processes that help good work happen consistently.</p>
                        <p>I&apos;m currently pursuing a master&apos;s degree in Artificial Intelligence at <a href="https://www.oth-aw.de/en/" target="_blank" rel="noreferrer" className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary">OTH Amberg-Weiden</a>. My recent work sits between modern web development, applied AI, and technical communication.</p>
                    </div>
                    <nav aria-label="Explore Anant's work" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
                        <Link href="/projects" className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-primary">Projects <span aria-hidden>→</span></Link>
                        <Link href="/articles" className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-primary">Articles <span aria-hidden>→</span></Link>
                        {externalLinks.slice(0, 2).map((item) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">{item.label} <span aria-hidden>↗</span></a>)}
                    </nav>
                </section>

                <section aria-labelledby="selected-work" className="mt-24 sm:mt-32">
                    <div className="flex items-baseline justify-between gap-4 border-b pb-3">
                        <h2 id="selected-work" className="text-sm font-semibold uppercase tracking-[0.14em]">Selected work</h2>
                        <Link href="/projects" className="text-xs text-muted-foreground transition-colors hover:text-foreground">All projects →</Link>
                    </div>
                    <div>
                        {projects.map((project) => (
                            <article key={project.slug} className="group border-b py-6 sm:grid sm:grid-cols-[1fr_auto] sm:gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold tracking-tight"><Link href={`/projects/${project.slug}`} className="transition-colors group-hover:text-primary">{project.title}</Link></h3>
                                    <p className="mt-2 max-w-2xl text-sm leading-6">{project.summary}</p>
                                    <p className="mt-3 text-xs leading-5 text-muted-foreground">{project.technologies.slice(0, 4).join(" · ")}</p>
                                </div>
                                <div className="mt-3 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground sm:mt-1 sm:block sm:text-right"><span>{project.year}</span><span className="sm:ml-2">{project.status}</span></div>
                            </article>
                        ))}
                        {projects.length === 0 ? <p className="border-b py-6 text-sm">I&apos;m preparing the first project case study.</p> : null}
                    </div>
                </section>

                <section aria-labelledby="recent-writing" className="mt-20 sm:mt-24">
                    <div className="flex items-baseline justify-between gap-4 border-b pb-3">
                        <h2 id="recent-writing" className="text-sm font-semibold uppercase tracking-[0.14em]">Recent writing</h2>
                        <Link href="/articles" className="text-xs text-muted-foreground transition-colors hover:text-foreground">All articles →</Link>
                    </div>
                    <div>
                        {articles.map((article) => (
                            <article key={article.slug} className="group border-b py-5 sm:grid sm:grid-cols-[7.5rem_1fr] sm:gap-5">
                                <time dateTime={article.date} className="text-xs text-muted-foreground">{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(article.date))}</time>
                                <div className="mt-2 sm:mt-0">
                                    <h3 className="font-semibold tracking-tight"><Link href={`/articles/${article.slug}`} className="transition-colors group-hover:text-primary">{article.title}</Link></h3>
                                    <p className="mt-1 text-sm leading-6">{article.description}</p>
                                </div>
                            </article>
                        ))}
                        {articles.length === 0 ? <p className="border-b py-6 text-sm">I write about artificial intelligence, software architecture, and the practical details behind building products.</p> : null}
                    </div>
                </section>

                <section aria-labelledby="away-from-keyboard" className="mt-20 max-w-2xl sm:mt-24">
                    <h2 id="away-from-keyboard" className="text-sm font-semibold uppercase tracking-[0.14em]">Away from the keyboard</h2>
                    <p className="mt-5 text-[1.0625rem] leading-8">When I&apos;m not building or learning something new, I&apos;m usually reading, listening to music, or playing games. There&apos;s more to add here, but this is a good place to start.</p>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default Page;
