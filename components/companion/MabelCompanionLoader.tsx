"use client";

import dynamic from "next/dynamic";

const LazyMabelCompanion = dynamic(() => import("@/components/companion/MabelCompanion"), {
    loading: () => null,
    ssr: false,
});

const MabelCompanionLoader = () => <LazyMabelCompanion />;

export default MabelCompanionLoader;
