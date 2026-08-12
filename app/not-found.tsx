import type { Metadata } from "next";
import Link from "next/link";

import MabelPet from "@/components/companion/MabelPet";
import Footer from "@/layouts/components/footer";
import Navbar from "@/layouts/components/navbar";

export const metadata: Metadata = {
    title: "Page Not Found | Anant Navadiya",
    description: "The page you're looking for doesn't exist.",
};

const NotFound = () => (
    <>
        <Navbar />
        <main className="flex flex-col items-center gap-8 pb-16 pt-16 text-center sm:pb-24 sm:pt-24">
            <MabelPet mood="confused" size="stage" />
            <div className="max-w-md">
                <p className="text-sm font-medium text-primary">404</p>
                <h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">This page went missing.</h1>
                <p className="mt-4 text-[1.0625rem] leading-8 text-muted-foreground">Whatever you were looking for isn&apos;t here anymore, or never was. Try one of these instead.</p>
            </div>
            <nav aria-label="Suggested pages" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium">
                <Link href="/" className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-primary">Home <span aria-hidden>→</span></Link>
                <Link href="/projects" className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-primary">Projects <span aria-hidden>→</span></Link>
                <Link href="/articles" className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-primary">Articles <span aria-hidden>→</span></Link>
            </nav>
        </main>
        <Footer />
    </>
);

export default NotFound;
