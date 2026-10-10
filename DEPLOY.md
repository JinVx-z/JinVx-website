# 发布 JinVx

本文说明自行发布的流程。项目创建过程不会自动创建远程仓库、推送代码或部署线上站点。

## 1. 发布前准备

1. 在 `src/config/site.ts` 替换个人介绍、GitHub、公开联系方式，同时更新 `src/pages/about.astro` 的个人正文，再将 `demoProfile` 改为 `false`。
2. 替换或删除演示文章、笔记和项目；真实内容的 `demo` 设为 `false`，未完成内容的 `draft` 设为 `true`。
3. 运行 `npm run verify`，然后 `npm run preview` 检查首页、详情页、主题切换与手机布局。

不要在公开内容、配置或 Git 提交中加入私人资料、令牌与密码。这个静态网站无需数据库、CMS、登录系统或部署密钥。

## 2. 创建 GitHub 仓库

在 GitHub 创建自己的 `JinVx` 仓库。仓库没有初始化时可运行 `git init`；已经存在 `.git` 时省略该步骤。以下命令需要由你在确认待提交文件后执行，替换示例地址：

```powershell
git status
git add .
git commit -m "Create JinVx personal website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/JinVx.git
git push -u origin main
```

已有 `origin` 时先用 `git remote -v` 确认地址，按自己的仓库情况调整，不要重复添加。`node_modules/`、`dist/`、Astro 缓存与本地环境文件不应上传；依赖锁文件应上传。之后更新内容时提交并推送即可。

## 3. 导入 Vercel

在 Vercel 选择 **Add New → Project**，连接 GitHub 并导入自己的仓库。使用以下设置：

| 设置                  | 值                                      |
| --------------------- | --------------------------------------- |
| Framework Preset      | Astro                                   |
| Root Directory        | 仓库根目录                              |
| Install Command       | `npm ci`                                |
| Build Command         | `npm run build`                         |
| Output Directory      | `dist`                                  |
| Node.js               | 与 `package.json` 相容的版本，例如 22.x |
| Environment Variables | 无需设置                                |

JinVx 使用静态输出，不需要 Vercel adapter 或服务端函数。Astro 的 [Vercel 部署指南](https://docs.astro.build/en/guides/deploy/vercel/) 说明静态站点无需额外部署配置。

第一次部署得到实际的 `*.vercel.app` 地址后，把 `src/config/site.ts` 中的 `url` 改为该地址，提交并推送，等待新的部署完成。这会更新 canonical、RSS、sitemap 与分享地址。默认 `example.com` 配置保持 `noindex`；替换成真实 URL 后再发布，才能启用正常收录配置。

导入成功后的普通分支推送会生成预览部署，生产分支（通常为 `main`）推送会触发生产部署。免费计划的使用范围与额度以 Vercel 当前 [套餐说明](https://vercel.com/pricing) 为准。

## 4. 配置自己的域名

1. 在 Vercel 项目的 **Settings → Domains** 中添加已拥有的域名。
2. 去域名注册商的 DNS 面板，按 Vercel 当前显示的记录类型、名称和值添加记录。根域名与 `www` 的设置可能不同，以当前项目页面为准，不使用网上旧的 IP 或 CNAME 值。
3. 等待 DNS 验证完成、HTTPS 证书生效。选择一个主要域名，并在 Vercel 设置另一地址重定向至主要域名。
4. 把 `src/config/site.ts` 的 `url` 改为主要域名（例如 `https://your-domain.com`，不带子路径），提交、推送并重新部署。

完成后浏览首页和一篇详情页，确认页面源代码中的 canonical 地址、`/robots.txt`、`/sitemap-index.xml` 和 `/rss.xml` 使用实际域名。DNS 管理界面与记录要求可能变化，使用 Vercel [域名配置文档](https://vercel.com/docs/domains/working-with-domains/add-a-domain) 核对当前流程。

## 日常更新与恢复

内容变更遵循“编辑 → 本地验证 → Git 提交 → 推送 → 查看部署结果”。确认 Vercel 构建成功并打开实际页面后，才算发布完成。如果新版本有问题，可以在 Vercel 部署历史中恢复已验证版本，或在 Git 中修复后再次推送。无需迁移数据库。
