import { ImageResponse } from "next/og";

import { OgCard, ogImageContentType, ogImageSize } from "@/lib/og";
import { getProject } from "@/lib/content/projects";
import { siteUrl } from "@/lib/site";

export const alt = "Project by Anant Navadiya";
export const size = ogImageSize;
export const contentType = ogImageContentType;

type Props = { params: Promise<{ slug: string }> };

const Image = async ({ params }: Props) => {
    const { slug } = await params;
    const project = await getProject(slug);

    return new ImageResponse(
        <OgCard eyebrow={project ? `Project · ${project.category}` : "Project"} title={project?.title ?? "Anant Navadiya"} footer={new URL(siteUrl).host} />,
        { ...size },
    );
};

export default Image;
