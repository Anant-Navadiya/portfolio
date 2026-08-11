"use client";

import { usePathname } from "next/navigation";

import ArticleDock from "@/components/articles/ArticleDock";
import MabelCompanionLoader from "@/components/companion/MabelCompanionLoader";

const PublicSiteWidgets = () => {
    const pathname = usePathname();

    if (pathname === "/admin" || pathname.startsWith("/admin/")) return null;

    return (
        <>
            <ArticleDock />
            <MabelCompanionLoader />
        </>
    );
};

export default PublicSiteWidgets;
