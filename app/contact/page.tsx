import type { Metadata } from "next";

import ContactForm from "@/components/contact/ContactForm";
import Footer from "@/layouts/components/footer";
import Navbar from "@/layouts/components/navbar";

export const metadata: Metadata = {
    title: "Contact | Anant Navadiya",
    description: "Contact Anant Navadiya about projects, collaboration, or opportunities.",
};

const ContactPage = () => (
    <>
        <Navbar />
        <main className="pb-16 pt-12 sm:pb-24 sm:pt-20">
            <header className="max-w-2xl border-b pb-12">
                <p className="text-sm font-medium text-primary">Contact</p>
                <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Let&apos;s talk about something worth building.</h1>
                <p className="mt-7 text-[1.0625rem] leading-8">Send a note if you have a project, opportunity, technical question, or simply want to start a conversation. A little context helps me respond thoughtfully.</p>
            </header>

            <section className="grid gap-10 py-12 sm:grid-cols-[12rem_1fr]">
                <div><h2 className="text-sm font-semibold">Send a message</h2><p className="mt-2 text-xs leading-5">Messages go directly into my private admin inbox.</p></div>
                <ContactForm />
            </section>

            <section className="grid gap-5 border-t py-10 sm:grid-cols-[12rem_1fr] sm:gap-10">
                <h2 className="text-sm font-semibold">Elsewhere</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm"><a href="https://github.com/Anant-Navadiya" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary">GitHub ↗</a><a href="https://www.linkedin.com/in/anant-navadiya-97a395245" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary">LinkedIn ↗</a><a href="https://x.com/anant_navadiya" target="_blank" rel="noreferrer" className="text-foreground hover:text-primary">X ↗</a></div>
            </section>
        </main>
        <Footer />
    </>
);

export default ContactPage;
