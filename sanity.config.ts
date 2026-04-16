"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { singletonPlugin, singletonStructure } from "./sanity/lib/singletonPlugin";

const singletonTypes = ["siteSettings", "homePage"];

export default defineConfig({
  name: "trustpoint-studio",
  title: "Trust Point IT Solutions",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: "/studio",
  plugins: [
    structureTool({ structure: singletonStructure(singletonTypes) }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    singletonPlugin(singletonTypes),
  ],
  schema: {
    types: schemaTypes,
  },
});
