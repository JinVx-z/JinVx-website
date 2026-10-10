import rss from '@astrojs/rss';
import { getWriting } from '../lib/content';
import { site } from '../config/site';
export async function GET() {
  const entries = [
    ...(await getWriting('blog')),
    ...(await getWriting('notes')),
  ].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return rss({
    title: `${site.name} · Blog & Notes`,
    description: site.description,
    site: site.url,
    items: entries.map((entry) => ({
      title: `${entry.data.demo ? '[演示] ' : ''}${entry.data.title}`,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: `/${entry.collection}/${entry.id}/`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
