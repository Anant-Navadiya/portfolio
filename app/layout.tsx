import type { Metadata } from "next";
import "@/assets/css/styles.css";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from "@/components/ui/tooltip";
import PublicSiteWidgets from "@/components/site/PublicSiteWidgets";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare, GeistPixelGrid, GeistPixelCircle, GeistPixelTriangle, GeistPixelLine } from 'geist/font/pixel';
export const metadata: Metadata = {
    title: "Anant Navadiya",
    description: "Portfolio, projects, and articles by Anant Navadiya.",
};
const RootLayout = ({ children, }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (<html lang="en" className={cn("h-full", "antialiased", GeistSans.variable, GeistMono.variable, GeistPixelSquare.variable, GeistPixelGrid.variable, GeistPixelCircle.variable, GeistPixelTriangle.variable, GeistPixelLine.variable)} suppressHydrationWarning>
      <body className="mx-auto max-w-3xl px-5 sm:px-6">
          <ThemeProvider>
            <TooltipProvider>
             {children}
             <PublicSiteWidgets />
            </TooltipProvider>
          </ThemeProvider>
      </body>
    </html>);
};
export default RootLayout;
