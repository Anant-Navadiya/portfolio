const links = [
    { label: "GitHub", href: "https://github.com/Anant-Navadiya" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/anant-navadiya-97a395245" },
    { label: "X", href: "https://x.com/anant_navadiya" },
];

const pages = [
    { label: "About", href: "/about" },
    { label: "Now", href: "/now" },
    { label: "Uses", href: "/uses" },
    { label: "Contact", href: "/contact" },
];

const Footer = () => (
    <footer className="flex flex-col gap-5 border-t py-8 text-xs text-muted-foreground">
        <nav aria-label="More pages" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {pages.map((page) => <Link key={page.label} href={page.href} className="transition-colors hover:text-foreground">{page.label}</Link>)}
        </nav>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5">© 2026 Anant Navadiya</p>
        <nav aria-label="Social links" className="flex items-center gap-5">
            {links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">{link.label}</a>)}
        </nav>
        </div>
    </footer>
);

export default Footer;
import Link from "next/link";
