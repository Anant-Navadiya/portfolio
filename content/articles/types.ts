import type { ComponentType } from "react";

export type ArticlePostMetadata = {
  title: string;
  slug: string;
  description: string;
  date: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  image?: {
    url: string;
    alt: string;
  };
  pinned: boolean;
  views: number;
  usefulCount: number;
};

export type ArticlePost = ArticlePostMetadata & {
  Component: ComponentType;
};
