import type { Metadata } from "next";

import { usesGroups } from "@/content/site/uses";
import Footer from "@/layouts/components/footer";
import Navbar from "@/layouts/components/navbar";

export const metadata: Metadata = {
    title: "Uses | Anant Navadiya",
    description: "Software, services, and tools Anant uses to build, study, and work.",
};

const UsesPage = () => (
    <>
        <Navbar />
        <main className="pb-16 pt-12 sm:pb-24 sm:pt-20">
            <header className="max-w-2xl border-b pb-12">
                <p className="text-sm font-medium text-primary">Uses</p>
                <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Tools I use to build and learn.</h1>
                <p className="mt-7 text-[1.0625rem] leading-8">A living inventory of the software, services, and equipment in my workflow. The structure is ready; I&apos;ll keep filling in the personal details over time.</p>
            </header>

            <div className="divide-y">
                {usesGroups.map((group) => (
                    <section key={group.title} className="grid gap-6 py-10 sm:grid-cols-[12rem_1fr] sm:gap-10">
                        <div><h2 className="text-sm font-semibold">{group.title}</h2><p className="mt-2 text-xs leading-5">{group.description}</p></div>
                        {group.items.length > 0 ? <dl className="divide-y border-y">{group.items.map((item) => <div key={item.name} className="flex items-baseline justify-between gap-5 py-3"><dt className="text-sm font-medium text-foreground">{item.name}</dt><dd className="text-right text-xs text-muted-foreground">{item.detail}</dd></div>)}</dl> : <p className="text-sm italic text-muted-foreground">Details coming soon.</p>}
                    </section>
                ))}
            </div>
        </main>
        <Footer />
    </>
);

export default UsesPage;
