/** 发布前优先替换这里。空联系方式不会生成虚假的外链。 */
export const site = {
  name: 'JinVx',
  url: 'https://example.com', // 改为 Vercel 地址或自己的域名；不要带路径
  description:
    'JinVx 的数字花园：构建 Personal Agent，记录开发实践、学习笔记与日常思考。',
  language: 'zh-CN',
  author: 'JinVx',
  role: 'Developer · Agent Explorer', // 演示个人定位，请替换
  intro:
    '你好，我是 JinVx。正在探索 AI Agent 与 Web 开发，把好奇心变成可以运行的小项目，也把途中的发现认真记下来。', // 演示介绍
  tagline: '保持好奇，持续构建。',
  github: '', // 如 https://github.com/your-username
  email: '', // 填写愿意公开的邮箱
  location: '', // 可选公开所在地
  demoProfile: true, // 替换个人介绍后改为 false，隐藏演示提示
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Notes', href: '/notes/' },
    { label: 'About', href: '/about/' },
  ],
};

export const hasRealDomain = new URL(site.url).hostname !== 'example.com';
