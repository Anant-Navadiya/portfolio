import { ImageResponse } from "next/og";

import { OgCard, ogImageContentType, ogImageSize } from "@/lib/og";

export const alt = "Anant Navadiya";
export const size = ogImageSize;
export const contentType = ogImageContentType;

const Image = () => new ImageResponse(
    <OgCard eyebrow="Anant Navadiya" title="Full-stack developer and AI student" footer="Projects, articles, and notes" />,
    { ...size },
);

export default Image;
