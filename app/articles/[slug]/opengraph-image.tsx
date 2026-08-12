import { ImageResponse } from "next/og";

import { OgCard, ogImageContentType, ogImageSize } from "@/lib/og";
import { getArticleCategories, getArticlePost } from "@/lib/content/articles";
import { siteUrl } from "@/lib/site";

export const alt = "Article by Anant Navadiya";
export const size = ogImageSize;
export const contentType = ogImageContentType;

type Props = { params: Promise<{ slug: string }> };

const Image = async ({ params }: Props) => {
    const { slug } = await params;
    const [post, categories] = await Promise.all([getArticlePost(slug), getArticleCategories()]);
    const category = categories.find((item) => item.slug === post?.category);

    return new ImageResponse(
        <OgCard eyebrow={category?.label ? `Article · ${category.label}` : "Article"} title={post?.title ?? "Anant Navadiya"} footer={new URL(siteUrl).host} />,
        { ...size },
    );
};

export default Image;
