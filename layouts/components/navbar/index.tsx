import Link from "next/link";

const Navbar = () => (
    <nav aria-label="Primary" className="flex items-center justify-between border-b py-5">
        <Link href="/" className="text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-primary">Anant Navadiya</Link>
        <div className="flex items-center gap-4 text-xs sm:gap-7 sm:text-sm">
            <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
            <Link href="/projects" className="text-muted-foreground transition-colors hover:text-foreground">Projects</Link>
            <Link href="/articles" className="text-muted-foreground transition-colors hover:text-foreground">Articles</Link>
        </div>
    </nav>
);

export default Navbar;
