import type { MetadataRoute } from "next";

import { brandColors } from "@/lib/brand";

const manifest = (): MetadataRoute.Manifest => ({
    name: "Anant Navadiya",
    short_name: "Anant Navadiya",
    description: "Portfolio, projects, and articles by Anant Navadiya.",
    start_url: "/",
    display: "standalone",
    background_color: brandColors.backgroundLight,
    theme_color: brandColors.primaryLight,
    icons: [
        { src: "/icon", sizes: "32x32", type: "image/png" },
        { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
});

export default manifest;
