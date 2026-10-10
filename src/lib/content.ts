import { getCollection, type CollectionEntry } from 'astro:content';

export type Writing = CollectionEntry<'blog'> | CollectionEntry<'notes'>;
export function getWriting(
  collection: 'blog',
): Promise<CollectionEntry<'blog'>[]>;
export function getWriting(
  collection: 'notes',
): Promise<CollectionEntry<'notes'>[]>;
export function getWriting(collection: 'blog' | 'notes'): Promise<Writing[]>;
export async function getWriting(
  collection: 'blog' | 'notes',
): Promise<Writing[]> {
  return (await getCollection(collection, ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}
export async function getProjects() {
  return (await getCollection('projects', ({ data }) => !data.draft)).sort(
    (a, b) => a.data.order - b.data.order,
  );
}
export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC',
  })
    .format(date)
    .replaceAll('/', '.');
}
export function readingTime(body = '') {
  const chinese = body.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const words = body
    .replace(/[\u3400-\u9fff]/g, '')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(chinese / 350 + words / 200));
}
