import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const writingSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  demo: z.boolean().default(false),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: writingSchema,
});
const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: writingSchema.extend({
    kind: z.enum(['学习笔记', '日常思考', '开发手记']).default('学习笔记'),
  }),
});
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(10),
    status: z.enum(['探索中', '开发中', '已上线', '已归档']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    visual: z.enum(['agent', 'site']).default('site'),
    draft: z.boolean().default(false),
    demo: z.boolean().default(false),
    repository: z.url({ protocol: /^https?$/ }).optional(),
    website: z.url({ protocol: /^https?$/ }).optional(),
  }),
});
export const collections = { blog, notes, projects };
