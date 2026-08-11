import type { Metadata } from "next";
import Link from "next/link";

import { aboutSections, workingPrinciples } from "@/content/site/about";
import Footer from "@/layouts/components/footer";
import Navbar from "@/layouts/components/navbar";

export const metadata: Metadata = {
    title: "About | Anant Navadiya",
    description: "Background, current studies, working approach, and interests of Anant Navadiya.",
};

const AboutPage = () => (
    <>
        <Navbar />
        <main className="pb-16 pt-12 sm:pb-24 sm:pt-20">
            <header className="max-w-2xl border-b pb-12">
                <p className="text-sm font-medium text-primary">About</p>
                <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">A developer who likes making complicated things feel clear.</h1>
                <p className="mt-7 text-[1.0625rem] leading-8">I&apos;m Anant Navadiya, a full-stack developer and Artificial Intelligence master&apos;s student. I build web products, explore applied AI, and write about what I learn along the way.</p>
            </header>

            <div className="divide-y">
                {aboutSections.map((section) => (
                    <section key={section.title} className="grid gap-5 py-10 sm:grid-cols-[10rem_1fr] sm:gap-10">
                        <h2 className="text-sm font-semibold text-foreground">{section.title}</h2>
                        <div className="space-y-4">{section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-7">{paragraph}</p>)}</div>
                    </section>
                ))}
            </div>

            <section className="border-t py-10">
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em]">Working principles</h2>
                <ol className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">{workingPrinciples.map((principle, index) => <li key={principle} className="flex gap-3 text-sm leading-6 text-muted-foreground"><span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span><span>{principle}</span></li>)}</ol>
            </section>

            <p className="border-t pt-10 text-sm">Want the short, current version? Visit <Link href="/now" className="font-medium text-foreground underline underline-offset-4">Now</Link>, or <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">get in touch</Link>.</p>
        </main>
        <Footer />
    </>
);

export default AboutPage;
