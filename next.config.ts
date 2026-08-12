import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-math"],
    rehypePlugins: [
      "rehype-katex",
      ["rehype-pretty-code", { theme: { light: "github-light", dark: "github-dark" }, keepBackground: false, bypassInlineCode: true }],
    ],
  },
});

export default withMDX(nextConfig);
