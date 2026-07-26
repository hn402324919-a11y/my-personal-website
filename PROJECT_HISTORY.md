# 项目概览

- 项目名称：CHENYNII Portfolio / 陈旖旎个人设计师作品集。
- 技术栈：TypeScript、React 19、Next.js 16 App Router、vinext、Vite、Tailwind CSS 4、手写 CSS、GSAP / ScrollTrigger / SplitText、Motion、OGL / WebGL、Vercel。
- 网站定位：陈旖旎的公开中文个人作品集，用于展示 UI/UX、品牌体验、营销活动、B 端网页与产品设计能力，并提供电话和微信联系入口。
- 当前业务形态：单页作品集加项目详情弹窗，没有实际数据库、登录、表单提交或后端业务状态。

# 当前网站结构

## 首页模块

- `app/layout.tsx` 负责中文 `lang="zh-CN"`、动态 metadata、favicon、Open Graph 与 Twitter Card。
- `app/page.tsx` 是当前主要页面入口，使用 `"use client"`，集中管理首页数据、页面结构、项目详情弹窗状态、案例切换和微信复制反馈。
- 首屏 Hero 包含：
  - 背景人物视觉 `/hero/chenynii-editorial-v2.png`；
  - `DIGITAL / Designer` 大标题；
  - 年份、设计方向、滚动引导和首屏 CTA；
  - `PortfolioMotion` 驱动的开场动画和首屏进入动效；
  - `SplitText` 驱动的文字拆分动画。
- 关于模块包含个人照片、姓名、出生年月、教育信息、联系方式、个人简介、工作经历时间线、教育经历和工具列表。
- 优势模块包含 4 张能力卡片：跨业务设计经验、端到端产品能力、设计体系建设、业务价值意识。

## 项目展示模块

- 项目展示由 `projects` 数据驱动，目前分为 3 个主项目方向：
  - 体验 / 界面；
  - 营销 / 运营；
  - B 端 / 网页。
- 项目卡片使用 `TiltedCard`、`SpecularFrame` 和自定义 CSS 组合，实现倾斜、边框高光和视觉封面。
- 项目区还包含 `work-manifesto` 与 `work-orbit` 两个品牌表达卡片，强调产品、体验、品牌和系统能力。

## 项目详情页

- 当前没有独立路由形式的项目详情页，项目详情以首页内的 modal 弹窗呈现。
- 弹窗支持：
  - 项目标题、项目职责、项目成就、标签；
  - 单图和多图长图展示；
  - 案例 tab 切换；
  - ArrowLeft、ArrowRight、Home、End 键盘切换；
  - Escape 关闭；
  - 打开时锁定 body 滚动；
  - 移动端案例导航置顶和内容对齐。

## 联系模块

- 联系模块位于首页底部 `#contact`。
- 包含动态绿色背景、联系标题、说明文案、电话链接和微信复制按钮。
- 电话使用 `tel:15988806213`。
- 微信号为 `chenynii`，复制成功后显示反馈文案。

## 其他重要页面和文件

- `app/globals.css`：全站主要视觉、响应式、动画和覆盖规则集中处。文件中存在多段历史追加样式，修改前必须搜索同一选择器的全部定义。
- `app/components/PortfolioMotion.tsx`：GSAP 开场动画、分区滚动动效、桌面端图片视差。
- `app/components/SplitText.tsx`：GSAP SplitText 封装，支持滚动触发和事件触发两种文字动画。
- `app/components/ColorBends.tsx`：OGL / WebGL 流动背景。
- `app/components/MagicBento.tsx`：卡片聚光、粒子和点击效果。
- `app/components/SpecularFrame.tsx`：卡片边框高光。
- `app/components/LineSidebar.tsx` 与 `LineSidebar.css`：项目详情案例切换侧边栏。
- `vercel.json`：Vercel 使用 `framework: null`，安装命令为 `npm ci`，构建命令为 `npm run build:vercel`。
- `.openai/hosting.json`：保留 OpenAI Sites 项目标识，当前 `d1` 和 `r2` 均为 `null`。
- `worker/index.ts`、`vite.config.ts`：仍保留 Cloudflare / vinext 本地运行和 Sites 相关配置，但当前上线规则以 Vercel 为主。

# 当前部署状态

- 当前分支：`main`。
- Git 远端：`https://github.com/hn402324919-a11y/my-personal-website.git`。
- 2026-07-26 已完成 Vercel 部署配置修复，`vercel.json` 当前指向 vinext / Vite 构建方式，不使用 Next.js framework preset。
- Vercel 构建命令：`npm run build:vercel`。
- Vercel 安装命令：`npm ci`。
- 已绑定自定义域名：`chenynii.cn`。
- Vercel 会从 `main` 分支自动部署新提交。
- 最新已推送上线提交：`5cae469 Make hero entrance visible after opener`。
- 本地当前仅剩未跟踪日志文档变更，核心代码修复已提交并推送到 `main`。

# 2026-07-26 更新记录

## 上线与部署

- 新增并调整 Vercel 部署配置：
  - 早期提交添加 Vercel 配置；
  - 随后修复配置冲突；
  - 最终改为 vinext SSR 在 Vercel 上构建部署；
  - `vercel.json` 使用 `framework: null`、`npm ci`、`npm run build:vercel`。
- 更新 `vite.config.ts`，在 Vercel / `NITRO_PRESET=vercel` 构建环境下启用 Nitro Vite 插件。
- 添加 `.vercelignore`，减少无关文件进入 Vercel 构建上下文。
- 域名 `chenynii.cn` 已绑定到 Vercel 并上线。
- `AGENTS.md` 增加部署规则：本项目部署在 Vercel，推送前必须运行 `npm run build`，代码变更后提交并推送到 `main`。

## 首页首屏动画恢复 / 调整

- `PortfolioMotion` 恢复并强化首屏开场动画流程：
  - 开场遮罩文字进入；
  - 开场横线展开；
  - 上下遮罩面板退场；
  - Hero 人像缩放回落；
  - 导航、kicker、年份、设计方向、底部信息依次进入。
- 首屏标题动画改为等待 `SplitText` 完成字符拆分后再启动，避免 `DIGITAL / Designer` 在字符尚未生成时错过 GSAP 动画。
- `SplitText` 增加 `startEvent` 支持，Hero 标题通过 `portfolio:hero-title-animation` 事件统一开启动画。
- `SplitText` 在完成拆分后派发 `splittext:ready` 事件，供 `PortfolioMotion` 判断首屏标题是否已经准备完成。
- 所有新增动画逻辑保留 `prefers-reduced-motion: reduce` 降级：减少动态效果时跳过开场动效并显示内容。
- 进一步修复开场遮罩层覆盖问题：
  - `.opening-sequence` 背景改为透明，避免上下遮罩退场后仍用整屏黑底盖住 Hero；
  - Hero 进入时间线调整到遮罩退场后的可见阶段；
  - `DIGITAL / Designer`、顶部信息、年份、右侧设计方向、描述和 CTA 按钮现在会在首屏画面中可见地依次进入。

## Hero 区域排版优化

- 调整 `hero-display` 标题字重、字号、行高和字距，使 `DIGITAL / Designer` 更接近作品集的编辑式视觉。
- 优化 Hero 区域右侧设计方向列表和底部 CTA 的对齐关系。
- 桌面端增加 `--hero-right-align`，统一 `Designer`、右侧 disciplines 和底部按钮组的右对齐参考。

## Designer 文字间距调整

- 收紧 `Designer` 的字号比例、右边距、字距和横向缩放。
- 移动端单独设置 `Designer` 的间距和缩放，避免与桌面端排版互相影响。
- 保持 `DIGITAL` 与 `Designer` 在桌面端形成左 / 右错位构图，在移动端保持可读和不溢出。

## 桌面端右对齐规则优化

- 在 `@media(min-width:1101px)` 下独立处理桌面端 Hero 右侧对齐。
- `hero-disciplines` 改为右对齐文字，并与 Hero 底部按钮组共享右侧偏移变量。
- 该规则只影响桌面宽屏，不应扩大到平板和移动端。

## 移动端项目详情字号和行高调整

- 修复移动端项目详情标题换行问题。
- 移动端 modal 标题与页面 section 标题使用一致的字号、字重、字距和行高规则。
- 限制移动端标题、拆分字符和行容器的最大宽度，避免长中文标题被挤压或横向溢出。
- 移动端项目详情布局调整为更适合小屏阅读的单列结构，案例导航置顶，长图内容保持宽度和行距稳定。

## 联系模块文字显示问题修复

- 修复移动端联系标题“期待您的联系。”拆字后显示、换行和标点溢出问题。
- 联系标题在移动端改用更稳的字号、字重、行高和宽度限制。
- 对 SplitText 生成的 word / char 元素补充显示规则，避免中文字符被异常裁切。
- 保持联系模块绿色动态背景和卡片高光，但移动端降低排版冲突风险。

## 字体与依赖调整

- 移除外部字体依赖，减少外部资源加载风险。
- `layout.tsx` 不再引入 `next/font` 的 Geist 配置，页面字体回落到 CSS 中的系统字体栈。
- `globals.css` 同步调整字体变量和 font-family 规则。

## 其他今天完成的修复

- 修复能力卡片 hover 高光覆盖层对齐问题，涉及 `SpecularFrame`、`app/page.tsx` 和 CSS。
- 项目详情切换逻辑中，案例切换后会尝试将当前案例内容滚动到合适位置，移动端会把 sticky 案例导航高度计入偏移。
- 更新测试文件以适配 Vercel SSR 构建产物路径，但 `PROJECT.md` 仍记录当前测试基线并非完全可用。
- 仓库中同时存在 `package-lock.json` 和 `pnpm-lock.yaml`。今天既有 npm 锁文件更新，也出现过 pnpm 锁文件更新；后续依赖调整必须明确使用哪一种包管理器。

# 当前设计规范

## 字体规则

- 全站默认字体使用 CSS 中的 `--sans`，并回落到 `"PingFang SC"`、`"Microsoft YaHei"`、sans-serif。
- 等宽信息、年份、标签、eyebrow、导航品牌等使用 `--mono` 或 monospace 回落。
- Hero 大标题使用大字号、低行高、接近编辑排版的字重与紧凑构图。
- 中文正文保持较高可读性，重要段落使用更大的字号和稳定行高。
- 不要随意恢复外部字体依赖，除非明确评估加载、授权和部署影响。

## 间距规则

- 页面主体使用 `--shell` 控制内容宽度。
- 大 section 默认保持较大的上下留白，桌面端强调作品集的呼吸感。
- 项目卡片、优势卡片和联系卡片使用明确 gap 与固定高度 / 最小高度，避免 hover、动画和图片加载导致布局跳动。
- `app/globals.css` 中存在后置覆盖规则，修改间距前必须搜索同一选择器的所有定义。

## 桌面端和移动端区别

- 桌面端：
  - Hero 使用强编辑式构图；
  - `DIGITAL` 左对齐，`Designer` 右对齐；
  - 右侧 disciplines 和底部按钮组使用统一右侧参考；
  - 项目网格为复杂多列布局；
  - 项目详情案例导航在左侧，内容在右侧；
  - 部分图片启用视差和裁切展开动效。
- 移动端：
  - Hero 高度、人物图位置、标题字号、`Designer` 缩放和行距单独设置；
  - 项目展示改为纵向排序；
  - 项目详情使用单列布局，案例导航置顶；
  - 联系标题与项目详情标题有专门的换行和裁切保护；
  - hover 聚光效果在触屏设备上降级。

## 动画使用方式

- 首屏和滚动动效主要由 `PortfolioMotion` 与 GSAP 控制。
- 文本拆分动画由 `SplitText` 控制，Hero 标题使用事件触发，普通 section 标题使用 ScrollTrigger。
- 背景流动效果由 `ColorBends` / OGL / WebGL 控制。
- 卡片 hover、倾斜、高光和粒子由 `TiltedCard`、`SpecularFrame`、`MagicBento` 分工实现。
- 所有新增动画必须尊重 `prefers-reduced-motion: reduce`。
- hover 和 pointer 特效必须考虑触屏设备，不要假设移动端支持 hover。
- Effect 中创建的事件监听器、requestAnimationFrame、Observer、GSAP context、Canvas 和 WebGL context 必须 cleanup。

## 不应该随意修改的设计原则

- 不要擅自改写陈旖旎的履历、联系方式、项目成果、品牌名称或作品图片。
- 不要替换或删除作品图片，除非任务明确要求并同步更新全部引用。
- 保持深色背景、荧光绿色强调、编辑式 Hero、大图项目展示和克制的科技感。
- 不要把局部修复变成整页重写。
- 不要继续在 `globals.css` 末尾追加新的“最终覆盖”补丁；触碰重复样式时应优先合并和清理。
- 不要启用 D1、R2、ChatGPT Auth、登录、表单或后端状态，除非任务明确要求。
- 不要把 Vercel 的 framework preset 改成 Next.js，除非项目结构和构建方式已经明确改变。

# 后续开发规则

- 修改前先阅读本文件、`PROJECT.md` 和 `AGENTS.md`。
- 修改前运行 `git status --short`，确认并保护用户或其他 Codex 已有改动。
- 优先保持现有设计语言：深色底、绿色强调、编辑式排版、项目长图展示、细粒度动效。
- 桌面端修改不要影响移动端；改桌面规则时优先放在桌面断点中验证。
- 移动端修改不要影响桌面端；改移动端规则时优先放在移动端断点中验证。
- 修改 Hero 前必须同时检查：
  - 首屏加载；
  - 开场动画；
  - `DIGITAL / Designer` 拆字动画；
  - 桌面右对齐；
  - 移动端标题不溢出。
- 修改项目数据或项目详情前必须检查：
  - 项目卡片编号和 key；
  - 案例 tab 的 activeIndex；
  - ArrowLeft、ArrowRight、Home、End；
  - `role="tablist"`、`role="tab"`、`role="tabpanel"`；
  - 单图和多图长图路径；
  - Escape 关闭和 body 滚动锁定。
- 修改联系模块前必须检查：
  - 电话链接；
  - 微信复制反馈；
  - 联系标题拆字和标点显示；
  - 桌面与移动端背景动效。
- 修改部署配置前必须检查：
  - `vercel.json`；
  - `package.json` scripts；
  - `vite.config.ts` 的 Vercel / Nitro 分支；
  - `npm run build`；
  - 自定义域名和 Vercel 自动部署规则。
- 每次更新上线后必须记录：
  - 更新日期；
  - commit hash 和提交标题；
  - 是否已 push 到 `main`；
  - Vercel 自动部署状态或触发情况；
  - 本次修改摘要；
  - 本次验证命令和已知 warning / failure。
- 代码变更后按项目规则至少运行：
  - `npm run lint`；
  - `npm run build`；
  - `npm test`。
- 如果基线仍有失败，交付时必须区分已有问题和本次新增问题。
