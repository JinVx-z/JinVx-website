# 第一版验证记录

验证日期：2026-10-10。环境：Windows，Node.js 24.21.0，Astro 7.3.8。

- `npm run verify` 通过：Astro/TypeScript 0 错误、0 警告、0 提示；静态构建 13 个页面；265 个本地链接与资源通过检查，包含文章目录锚点。
- 生产预览首页、Projects、Blog、Notes、About、Markdown/MDX 详情、RSS、robots 与 sitemap 返回 HTTP 200；不存在的路径返回 HTTP 404。
- 浏览器检查通过：深浅色切换、跨页主题保持、Blog/Notes 标签筛选、手机导航展开与收起、文章目录跳转、代码块与表格排版。桌面和手机布局已观察，检查页面无横向溢出。
- [浅色首页截图](./previews/home-light.jpg)、[深色首页截图](./previews/home-dark.jpg)、[手机首页截图](./previews/home-mobile.jpg)、[生产首页截图](./previews/production-home.jpg)。

网站仍是本地项目，未创建远程 GitHub 仓库或部署至 Vercel。个人信息与全部七篇内容保留演示标记，发布前按 README 替换。
