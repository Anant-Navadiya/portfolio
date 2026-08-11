import type { Metadata } from "next";
import Link from "next/link";

import { nowItems, nowUpdatedAt } from "@/content/site/now";
import Footer from "@/layouts/components/footer";
import Navbar from "@/layouts/components/navbar";

export const metadata: Metadata = {
    title: "Now | Anant Navadiya",
    description: "What Anant Navadiya is currently studying, building, and exploring.",
};

const NowPage = () => (
    <>
        <Navbar />
        <main className="pb-16 pt-12 sm:pb-24 sm:pt-20">
            <header className="max-w-2xl border-b pb-12">
                <p className="text-sm font-medium text-primary">Now</p>
                <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">What I&apos;m focused on right now.</h1>
                <p className="mt-7 text-[1.0625rem] leading-8">A short snapshot of my current work and attention. This page changes as my priorities do.</p>
                <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">Last updated {nowUpdatedAt}</p>
            </header>

            <div className="divide-y">
                {nowItems.map((item) => <section key={item.title} className="grid gap-3 py-8 sm:grid-cols-[8rem_1fr] sm:gap-10"><h2 className="text-sm font-semibold">{item.title}</h2><p className="text-sm leading-7">{item.detail}</p></section>)}
            </div>

            <p className="border-t pt-10 text-sm">For finished work, browse my <Link href="/projects" className="font-medium text-foreground underline underline-offset-4">projects</Link> and <Link href="/articles" className="font-medium text-foreground underline underline-offset-4">articles</Link>.</p>
        </main>
        <Footer />
    </>
);

export default NowPage;
