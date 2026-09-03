import type { Metadata } from "next";
import "@/assets/css/styles.css";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import { siteUrl } from "@/lib/site";
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from "@/components/ui/tooltip";
import PublicSiteWidgets from "@/components/site/PublicSiteWidgets";
import { GeistMono } from 'geist/font/mono';
import { GeistPixelSquare, GeistPixelGrid, GeistPixelCircle, GeistPixelTriangle, GeistPixelLine } from 'geist/font/pixel';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: "Anant Navadiya",
    description: "Portfolio, projects, and articles by Anant Navadiya.",
    alternates: {
        types: { "application/rss+xml": "/feed.xml" },
    },
};
const RootLayout = ({ children, }: Readonly<{
    children: React.ReactNode;
}>) => {
    return (<html lang="en" className={cn("h-full", "antialiased", GeistMono.variable, GeistPixelSquare.variable, GeistPixelGrid.variable, GeistPixelCircle.variable, GeistPixelTriangle.variable, GeistPixelLine.variable)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com/" />
        <link rel="preconnect" href="https://cdn.fontshare.com/" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap" />
      </head>
      <body>
          <div className="mx-auto max-w-3xl px-5 sm:px-6">
            <ThemeProvider>
              <TooltipProvider>
               {children}
               <PublicSiteWidgets />
              </TooltipProvider>
            </ThemeProvider>
          </div>
      </body>
    </html>);
};
export default RootLayout;
