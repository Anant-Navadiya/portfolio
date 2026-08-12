import { connection } from "next/server";

import { getAllArticlePosts } from "@/lib/content/articles";
import { absoluteUrl, siteUrl } from "@/lib/site";

const escapeXml = (value: string) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET = async () => {
    await connection();

    const posts = await getAllArticlePosts();

    const items = posts.map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${absoluteUrl(`/articles/${post.slug}`)}</link>
      <guid>${absoluteUrl(`/articles/${post.slug}`)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${post.date ? new Date(post.date).toUTCString() : new Date().toUTCString()}</pubDate>
    </item>`).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Anant Navadiya</title>
    <link>${siteUrl}</link>
    <description>Articles and notes by Anant Navadiya on AI, software, and building things.</description>
    <language>en</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
};
