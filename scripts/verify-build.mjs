import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';

const root = resolve('dist');
const errors = [];
const pages = new Map();
let checkedLinks = 0;

function decodeEntities(value) {
  return value.replace(
    /&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi,
    (whole, entity) => {
      if (entity.startsWith('#')) {
        const code =
          entity[1].toLowerCase() === 'x'
            ? Number.parseInt(entity.slice(2), 16)
            : Number.parseInt(entity.slice(1), 10);
        return code > 0 && code <= 0x10ffff
          ? String.fromCodePoint(code)
          : whole;
      }
      return (
        { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[
          entity.toLowerCase()
        ] ?? whole
      );
    },
  );
}

function tagsOf(html) {
  // Script strings and HTML comments are not document elements.
  const markup = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b([^>]*)>[\s\S]*?<\/\1\s*>/gi, '<$1$2></$1>');
  return [
    ...markup.matchAll(/<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi),
  ].map((tag) => {
    const attributes = {};
    for (const match of tag[2].matchAll(
      /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g,
    )) {
      attributes[match[1].toLowerCase()] = decodeEntities(
        match[2] ?? match[3] ?? match[4] ?? '',
      );
    }
    return { name: tag[1].toLowerCase(), attributes };
  });
}

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && extname(file) === '.html') {
      const html = readFileSync(file, 'utf8');
      const tags = tagsOf(html);
      const label = relative(root, file).split(sep).join('/');
      const canonical = tags.find(
        ({ name, attributes }) =>
          name === 'link' && attributes.rel?.split(/\s+/).includes('canonical'),
      )?.attributes.href;
      let origin = 'https://build-verification.invalid';
      try {
        const canonicalURL = new URL(canonical);
        if (!['http:', 'https:'].includes(canonicalURL.protocol))
          throw new Error('Invalid protocol');
        origin = canonicalURL.origin;
      } catch {
        errors.push(`${label}: 缺少有效的绝对 canonical URL`);
      }
      if (!/<title\b[^>]*>\s*[^<\s][\s\S]*?<\/title>/i.test(html)) {
        errors.push(`${label}: 缺少非空 title`);
      }
      if (
        !tags.some(
          ({ name, attributes }) =>
            name === 'meta' &&
            attributes.name === 'description' &&
            attributes.content?.trim(),
        )
      ) {
        errors.push(`${label}: 缺少非空 description`);
      }
      const headingCount = tags.filter(({ name }) => name === 'h1').length;
      if (headingCount !== 1)
        errors.push(`${label}: 应有一个 h1，实际为 ${headingCount}`);
      const route = `/${label.replace(/(^|\/)index\.html$/, '$1')}`;
      pages.set(file, {
        label,
        tags,
        base: new URL(route, origin),
        ids: new Set(
          tags
            .filter(({ attributes }) => 'id' in attributes)
            .map(({ attributes }) => attributes.id),
        ),
      });
    }
  }
}

function isFile(file) {
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
}

function resolveOutput(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const target = resolve(root, `.${decodedPath}`);
  if (target !== root && !target.startsWith(`${root}${sep}`)) return undefined;
  // Astro directory routes and the standalone 404.html output are both valid.
  const candidates = [target, join(target, 'index.html')];
  if (!extname(target)) candidates.push(`${target}.html`);
  return candidates.find(isFile);
}

function checkLinks() {
  for (const page of pages.values()) {
    for (const { attributes } of page.tags) {
      for (const attribute of ['href', 'src']) {
        const raw = attributes[attribute]?.trim();
        if (
          !raw ||
          raw === '#' ||
          /^(?:mailto:|tel:|data:|javascript:|blob:)/i.test(raw)
        )
          continue;
        let url;
        try {
          url = new URL(raw, page.base);
        } catch {
          errors.push(`${page.label}: 无效 ${attribute} ${raw}`);
          continue;
        }
        if (
          !['http:', 'https:'].includes(url.protocol) ||
          url.origin !== page.base.origin
        )
          continue;
        checkedLinks++;
        let target;
        try {
          target = resolveOutput(url.pathname);
        } catch {
          errors.push(`${page.label}: URL 编码无效 ${raw}`);
          continue;
        }
        if (!target) {
          errors.push(`${page.label}: 本地目标不存在 ${raw}`);
          continue;
        }
        if (url.hash.length > 1 && pages.has(target)) {
          let id;
          try {
            id = decodeURIComponent(url.hash.slice(1));
          } catch {
            errors.push(`${page.label}: 锚点编码无效 ${raw}`);
            continue;
          }
          if (!pages.get(target).ids.has(id))
            errors.push(`${page.label}: 目标页面没有 id="${id}" (${raw})`);
        }
      }
    }
  }
}

function checkFeeds() {
  const required = [
    ['rss.xml', /<rss\b/i],
    ['sitemap-index.xml', /<sitemapindex\b/i],
    ['robots.txt', /User-agent\s*:/i],
  ];
  for (const [name, pattern] of required) {
    const file = join(root, name);
    if (!isFile(file) || !pattern.test(readFileSync(file, 'utf8')))
      errors.push(`${name}: 缺少有效输出`);
  }
  const sitemap = join(root, 'sitemap-index.xml');
  if (isFile(sitemap)) {
    for (const match of readFileSync(sitemap, 'utf8').matchAll(
      /<loc>\s*([^<]+)\s*<\/loc>/g,
    )) {
      try {
        const url = new URL(decodeEntities(match[1].trim()));
        if (!resolveOutput(url.pathname))
          errors.push(`sitemap-index.xml: 子 sitemap 不存在 ${url.pathname}`);
      } catch {
        errors.push('sitemap-index.xml: 无效 loc URL');
      }
    }
  }
}

try {
  walk(root);
  if (pages.size === 0) errors.push('dist 中没有 HTML 页面');
  checkLinks();
  checkFeeds();
  if (errors.length)
    throw new Error(
      `生产输出验证失败：\n${errors.map((error) => `- ${error}`).join('\n')}`,
    );
  console.log(
    `生产输出验证通过：${pages.size} 个页面，${checkedLinks} 个本地链接及资源，RSS / sitemap / robots 正常。`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
