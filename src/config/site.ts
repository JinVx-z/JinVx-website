/** 站点信息与公开联系方式。 */
export const site = {
  name: 'JinVx',
  url: 'https://www.jinvx.top', // 站点正式地址；不要带路径
  description:
    'JinVx 的数字花园：构建 Personal Agent，记录开发实践、学习笔记与日常思考。',
  language: 'zh-CN',
  author: 'JinVx',
  avatar: '/avatar.png', // 当前为 GitHub 公开头像，可替换 public/avatar.png
  role: 'Developer · Agent Explorer',
  intro:
    '正在探索 AI Agent 与 Web 开发，边做项目边记录。平时喜欢足球、音乐和阅读，也想在这里留下一些学习与生活中的想法。',
  tagline: '保持好奇，持续构建。',
  github: 'https://github.com/JinVx-z',
  wechat: 'zjwlyf-',
  qq: '2902480395',
  location: '', // 可选公开所在地
  demoProfile: false,
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Notes', href: '/notes/' },
    { label: 'About', href: '/about/' },
  ],
};

export const hasRealDomain = new URL(site.url).hostname !== 'example.com';
