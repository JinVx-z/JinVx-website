# JinVx

一个轻量的个人网站：Home、Projects、Blog、Notes 与 About。使用干净的 Astro Starter 起步，以 TypeScript、Tailwind CSS 和 Markdown / MDX 内容集合构建静态页面。支持响应式布局、深浅色模式、文章目录、RSS 与基础 SEO。

## 本地运行

使用 Node.js 22.12.0 或更高的受支持版本，先安装依赖：

```powershell
npm install
npm run dev -- --background
```

浏览器打开命令输出的本地地址，通常为 `http://localhost:4321/`。按照本项目的开发约定，开发服务器在后台运行：

```powershell
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

| 命令              | 用途                             |
| ----------------- | -------------------------------- |
| `npm run check`   | Astro 与 TypeScript 检查         |
| `npm run build`   | 生产构建，输出到 `dist/`         |
| `npm run verify`  | 检查、构建，并验证生成页面与链接 |
| `npm run preview` | 本地预览生产构建                 |
| `npm run format`  | 整理源码与文档格式               |

## 先替换这些信息

编辑 `src/config/site.ts`，统一设置姓名、网站 URL、描述、自我介绍、定位、导航、GitHub、公开邮箱与可选所在地。空的联系方式不会生成假链接；设置真实 GitHub 地址后即可显示入口。还要替换 `src/pages/about.astro` 中的兴趣方向与个人正文，再将 `demoProfile` 改为 `false`。

默认 URL 为 `https://example.com`，此时页面保持 `noindex`，避免演示版本被搜索引擎收录。发布前改为实际 Vercel 地址或自有域名，并重新构建。`public/` 存放公开静态资源，favicon 与默认分享图也可以按个人品牌替换。

所有初始文章、笔记和项目介绍均标为 **演示内容**，没有虚构履历、成果或 GitHub 仓库。请替换正文和元数据后，再将各文件的 `demo` 改为 `false`。Personal Agent 页面当前描述的是演示规划，不代表已实现的能力。

## 更新内容

在相应目录新增 `.md` 或 `.mdx` 文件。文件名形成 URL，例如 `src/content/blog/my-first-post.md` 对应 `/blog/my-first-post/`。普通内容使用 Markdown；需要嵌入 Astro 提示块等组件时使用 MDX，可参考现有示例。

博客与笔记使用以下元数据：

```yaml
---
title: '新的开发记录'
description: '一句话说明这篇内容'
date: 2026-10-10
updated: 2026-10-10 # 可选
tags: ['Astro', '开发']
draft: true
demo: false
---
```

笔记可以额外设置 `kind: 学习笔记`，可选值为 `学习笔记`、`日常思考`、`开发手记`。`draft: true` 不生成公开页面，也不进入列表与 RSS；准备发布时改为 `false`。日期使用 `YYYY-MM-DD`。

项目的必填字段为 `title`、`description`、`status`。`status` 可选 `探索中`、`开发中`、`已上线`、`已归档`；`order` 越小越靠前，`featured: true` 用于重点展示。`visual: agent` 使用 Agent 概念插图，默认 `visual: site` 使用网站插图，它与重点展示互相独立。还可设置 `tags`、`draft`、`demo`，以及真实的 `repository` / `website` 完整 URL。不需要的外链字段直接省略。

编辑后运行 `npm run verify`，再浏览文章、项目和手机尺寸布局。内容字段的完整约束位于 `src/content.config.ts`。

## 项目结构

```text
src/
  config/site.ts          # 个人信息、导航与网站配置
  content.config.ts      # 内容集合与字段校验
  content/
    blog/                # 长文，支持 Markdown / MDX
    notes/               # 笔记与日常思考
    projects/            # 项目介绍
  components/            # 导航、卡片、提示块等原创组件
  layouts/               # 通用页面与阅读布局
  pages/                 # 页面、内容路由、RSS、robots
  styles/                # 全站主题与排版
public/                  # favicon、分享图等静态资源
scripts/                 # 生产输出验证
docs/design-reference.md # 参考研究与原创设计边界
```

GitHub 上传、Vercel 部署和域名配置见 [DEPLOY.md](./DEPLOY.md)。设计研究见 [设计参考说明](./docs/design-reference.md)。参考只用于观察设计与内容组织，没有复用作者私人内容、图片或整套代码。
