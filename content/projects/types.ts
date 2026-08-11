import type { ComponentType } from "react";

export type ProjectCategory = "ai" | "full-stack" | "frontend" | "experiment";
export type ProjectStatus = "active" | "completed" | "archived";

export type ProjectMetadata = {
  slug: string;
  title: string;
  summary: string;
  outcome: string;
  year: number;
  status: ProjectStatus;
  category: ProjectCategory;
  featured: boolean;
  role: string;
  duration: string;
  technologies: string[];
  repository?: string;
  demo?: string;
  cover?: {
    src: string;
    alt: string;
  };
};

export type Project = ProjectMetadata & {
  Component: ComponentType;
};
