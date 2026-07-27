# CHENYNII Portfolio 项目说明

> 本文依据 2026-07-27 的当前代码、依赖配置以及本地验证结果整理。

## 1. 网站用途

这是陈旖旎（CHENYNII）的个人设计师作品集网站，主要用于：

- 展示 UI/UX、产品体验、品牌营销和 B 端网页设计能力；
- 介绍个人经历、教育背景、设计工具与核心优势；
- 通过项目详情长图呈现代表案例、项目职责和成果；
- 为招聘方、客户或合作伙伴提供电话、微信等联系入口；
- 通过完整的 SEO、Open Graph 和 Twitter Card 元数据支持站外分享。

当前网站是一个中文单页作品集，没有后台管理、登录、表单提交或实际数据库业务。

## 2. 当前技术栈

### 核心框架

- Node.js `>=22.13.0`
- TypeScript `5.9`
- React `19.2`
- Next.js `16.2` App Router
- vinext `0.0.50`：使用 Vite 构建 Next.js 应用
- Vite `8.0`
- Cloudflare Vite Plugin、Wrangler 和 Cloudflare Worker：用于本地运行及 Cloudflare/Sites 部署

### 样式与视觉

- Tailwind CSS `4.2` 与 PostCSS；当前页面主体仍以 `app/globals.css` 中的手写 CSS 为主
- 当前字体使用 CSS 系统字体栈，不依赖外部字体加载
- GSAP、ScrollTrigger、SplitText：首屏、滚动进入、文字拆分和视差动画
- Motion：项目卡片倾斜和弹簧交互
- OGL/WebGL：流动背景、卡片高光边框
- 自定义 CSS 动画、响应式断点和 `prefers-reduced-motion` 降级

### 数据与平台能力

- Drizzle ORM、Drizzle Kit 和 D1 适配代码已随脚手架保留
- `.openai/hosting.json` 当前 `d1`、`r2` 均为 `null`
- `db/schema.ts` 为空，当前页面未使用数据库
- `app/chatgpt-auth.ts` 提供 ChatGPT 登录辅助方法，但当前页面没有调用

### 工程质量

- ESLint 9、Next.js Core Web Vitals 和 TypeScript 规则
- Node.js 内置测试运行器
- 项目实际验证使用 `pnpm`；当前运行环境没有可用的 `npm` 命令
- 仓库目前同时存在 `package-lock.json` 和 `pnpm-lock.yaml`，依赖变更前需明确包管理器

## 3. 已完成的功能

### 内容与页面结构

- 完整首屏视觉、设计师定位、工作年限和滚动引导；
- 锚点导航，以及滚动后切换为悬浮导航；
- 个人简介、工作经历时间线、教育经历和工具列表；
- 三个项目方向：体验/界面、营销/运营、B 端/网页；
- 共 11 个案例，支持单图和多图项目长图展示；
- 四项设计能力说明和可视化卡片；
- 电话拨号、微信号复制和复制成功反馈；
- 中文页面标题、描述、favicon、Open Graph 和 Twitter Card。

### 交互与动效

- 首次进入的开场动画；
- 文字逐字进入、分区滚动揭示和桌面端图片视差；
- WebGL 流动背景和联系区域动态效果；
- 项目卡片倾斜、聚光、粒子与高光边框；
- 项目详情弹窗、案例切换和切换动画；
- 案例标签支持左右方向键、Home、End 操作；
- 弹窗支持 Escape 关闭，并在打开时锁定页面滚动；
- 桌面、平板和手机响应式布局；
- 对 `prefers-reduced-motion`、无悬停设备提供部分降级；
- 提供“跳到主要内容”链接和基础 ARIA 标注。

### 构建与部署

- vinext 生产构建可以完成；
- 已配置 Cloudflare Worker 入口和图片优化处理；
- 已配置 OpenAI Sites 项目标识；
- 当前无 D1/R2 绑定，站点实际为静态内容加客户端交互。

## 4. 当前存在的问题

### 2026-07-27 实际验证状态

1. **工作区状态**
   - `git status --short` 无输出，当前工作区 clean。

2. **npm 当前不可用**
   - `npm run lint` 和 `npm run build` 按字面执行均失败，原因是当前环境中 `npm` 命令不存在；
   - bundled runtime 提供 Node.js 与 `pnpm`，项目当前真实验证以 `pnpm` 为准。

3. **Lint 通过**
   - `pnpm run lint` 通过，0 个 error；
   - 仍有 8 条 `@next/next/no-img-element` warning，均来自 `app/page.tsx` 中的原生 `<img>`。

4. **Build 通过**
   - `pnpm run build` 通过；
   - 当前仍有 Vite chunk size warning：部分客户端 chunk 压缩后超过 500 kB；
   - vinext 仍提示 `/` 路由在构建时分类为 `Unknown`，属于 vinext 当前静态分析提示；
   - 本次验证输出中未再出现 CSS 失效历史图片路径 warning。

5. **测试状态未在本次复核**
   - 本次只按要求验证 `lint` 与 `build`，没有重新运行测试；
   - 旧文档中“测试全部失败”的记录已视为过期，需要后续单独以当前代码重新验证。

6. **文档和项目标识仍是脚手架内容**
   - `README.md` 仍在介绍 `vinext-starter`，没有说明当前作品集；
   - `package.json` 的包名仍为 `site-creator-vinext-starter`。

### 结构、性能与维护风险

- `app/page.tsx` 约 558 行，项目数据、页面结构、状态和弹窗逻辑集中在一个客户端组件中；
- `app/globals.css` 约 977 行，存在多轮按日期追加、重复覆盖的样式，修改早期规则可能不会产生实际效果；
- 首页整体使用 `"use client"`，并同时加载 GSAP、Motion、OGL/WebGL 等交互代码，首屏 JavaScript 成本较高；
- 多张作品图片体积较大，最大文件约 6.2 MB；当前原生 `<img>` 未获得 Next.js 响应式图片优化；
- 旧文档曾记录 CSS 历史失效资源构建告警；2026-07-27 的 `pnpm run build` 输出中未复现该 warning，但相关样式仍可在后续 CSS 清理时一并核查；
- 弹窗已具备 ARIA 和键盘切换基础，但尚无完整的焦点捕获、打开后初始聚焦、关闭后焦点恢复；
- Clipboard API 写入没有错误处理，在非安全上下文或权限被拒绝时没有降级方案；
- 缺少针对导航、项目弹窗、键盘交互、复制反馈和响应式布局的有效测试；
- 仓库同时保留 npm 与 pnpm 锁文件，且当前环境实际只能使用 `pnpm` 验证，依赖变更时可能出现版本漂移；
- Drizzle、D1 示例、ChatGPT 登录辅助及部分依赖目前未参与业务，应明确保留用途或清理，避免误认为网站已有后端能力；
- `public/` 中仍有 `.DS_Store`、未被页面使用的素材及较大的源文件，可进一步清理。

## 5. 下一步开发计划

### 第一阶段：恢复工程基线

1. 将现有测试按当前作品集页面重新验证和必要时改写；
2. 处理 `app/page.tsx` 中 8 条 `<img>` 图片优化 warning，或明确继续使用原生图片的部署原因；
3. 针对超过 500 kB 的客户端 chunk 做分包或延迟加载评估；
4. 更新 `README.md` 和包名，明确项目实际使用 `pnpm`；
5. 保持 `pnpm run lint` 与 `pnpm run build` 通过，并为测试建立可信基线。

### 第二阶段：性能优化

1. 将适合的图片迁移到 `next/image` 或明确配置 Cloudflare 图片优化；
2. 压缩大图、生成 WebP/AVIF 与多尺寸资源，保留必要的高清项目长图；
3. 对非首屏动画和项目详情代码做动态加载或延迟初始化；
4. 检查 WebGL 实例、动画循环和事件监听器的生命周期；
5. 使用 Lighthouse 和真实手机验证 LCP、INP、CLS、内存占用及低性能设备体验。

### 第三阶段：拆分与可维护性

1. 将首页拆分为 Hero、Profile、Work、Strengths、Contact、ProjectDialog 等分区组件；
2. 将项目、经历、优势和工具数据移出页面组件，形成类型明确的数据层；
3. 整理 CSS 设计变量、组件样式和响应式规则，移除历史补丁式覆盖；
4. 只在需要浏览器 API 和动效的组件中保留客户端边界。

### 第四阶段：体验与可访问性

1. 为项目弹窗补全焦点管理、焦点恢复和更完整的对话框键盘行为；
2. 为微信复制增加失败提示与兼容降级；
3. 验证触屏、键盘、减少动态效果和高对比度场景；
4. 增加核心交互测试和关键视口的视觉回归检查。

### 第五阶段：内容与上线完善

1. 核实项目年份、履历、联系方式、项目成果和图片版权；
2. 根据实际需求再决定是否增加邮箱、简历下载、访问统计或联系表单；
3. 如果启用表单、登录或数据存储，再接入 D1/R2/Auth；当前不应提前引入；
4. 部署后检查分享卡片、favicon、404、移动端和所有项目图片。
