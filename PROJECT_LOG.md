# PROJECT LOG

## 记录规则

- 每次更新上线后，都必须在本文件追加一条记录。
- 记录内容至少包括：日期、commit hash、是否已 push 到 `main`、Vercel 自动部署触发情况、修改摘要、验证结果和已知遗留问题。
- 如果更新影响项目状态、结构、部署规则、设计规则或重要已完成功能，需要同步更新 `PROJECT_HISTORY.md`。

## 2026-07-27

### 上线记录：项目卡片分类标签桌面端左上对齐

- 提交：`8f268c4 fix: move project tags left on desktop`。
- 分支：`main`。
- 远端：已 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 定位首页项目模块中的项目卡片分类标签 `.card-top`；
  - 在桌面断点 `min-width:761px` 下将项目卡片分类文字从右上移动到左上；
  - 保留原有 `top:24px`、左右边距、字体、字号、颜色、透明度、背景样式、图片和 hover / reveal 动画；
  - 移动端继续沿用既有右上角位置。
- 验证结果：
  - `npm run lint`、`npm run build`、`npm test` 按字面执行失败：当前环境无 `npm` 命令；
  - 使用 bundled runtime 执行 `pnpm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `node --test tests/rendered-html.test.mjs` 通过，2/2；
  - 本地浏览器桌面端 `1440px` 量测：三个项目标签均为 `justify-content:flex-start`，距卡片左侧 `24px`、顶部 `24px`；
  - 本地浏览器移动端 `390px` 量测：三个项目标签仍为 `justify-content:flex-end`，距卡片右侧 `24px`、顶部 `24px`。
- 已知遗留问题：
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning；
  - 当前工作区另有未暂存的 `app/globals.css` opening sequence 差异，未纳入本次提交。

### 状态复核：pnpm lint/build 当前真实通过

- 提交：本次为文档状态复核，尚未提交。
- 分支：`main`。
- 远端：本次复核时未 push。
- 上线方式：未触发 Vercel 部署。
- 修改内容：
  - 根据 2026-07-27 实际验证结果修正 `PROJECT.md`；
  - 将旧的 `SplitText` lint error、hooks warning、测试全部失败、CSS 失效图片构建告警记录标注为过期或待重新验证；
  - 明确当前环境没有可用的 `npm` 命令，项目实际验证使用 bundled Node.js 与 `pnpm`。
- 验证结果：
  - `node_modules` 已存在，跳过安装；
  - `npm run lint` 按字面执行失败：`npm` command not found；
  - `npm run build` 按字面执行失败：`npm` command not found；
  - `pnpm run lint` 通过，0 个 error，仍有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `git status --short` 在验证前后均无输出，工作区 clean。
- 已知遗留问题：
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning；
  - README 与包名仍保留脚手架标识；
  - 测试未在本次复核中重新运行，需要后续单独确认。

## 2026-07-26

### 上线记录：首屏 Hero 动画可见性修复

- 提交：`5cae469 Make hero entrance visible after opener`。
- 分支：`main`。
- 远端：已 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 修复开场层 `.opening-sequence` 背景遮挡 Hero 动画的问题；
  - 将 `.opening-sequence` 背景从黑色改为透明，让上下遮罩退场时露出 Hero 本体；
  - 调整 `PortfolioMotion` 中 Hero 文案进入时间点，让标题、顶部信息、年份、右侧设计方向、描述和 CTA 在首屏画面中可见地依次进入；
  - 保留既有 GSAP、SplitText、easing、duration、stagger 和整体视觉布局。
- 验证结果：
  - `pnpm lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm build` 通过，仍有既有 Vite chunk size warning；
  - `node --test tests/rendered-html.test.mjs` 通过；
  - 本地浏览器 `http://localhost:3000/` 已验证 Hero 中间帧可见，控制台无 error / warning。
- 备注：
  - 当前运行环境没有可用的 `npm` 命令，因此使用 bundled `pnpm` 和 Node 执行等价验证；
  - `pnpm test` 会因脚本内部调用 `npm run build` 而失败，这属于当前环境命令可用性问题，不是本次动画修复引入。

### 修改内容

- 恢复并调整首页首屏标题动画启动方式。
- 将 Hero 标题 `DIGITAL / Designer` 的 SplitText 字符动画从 `PortfolioMotion` 直接选择 `.split-char` 改为事件驱动：
  - `SplitText` 拆分完成后派发 `splittext:ready`；
  - `PortfolioMotion` 等待 Hero 标题字符生成完成；
  - 开场时间线运行到标题阶段时派发 `portfolio:hero-title-animation`；
  - Hero 标题收到事件后再执行字符进入动画。
- 为 Hero 标题新增统一动画参数：
  - 初始状态：透明、向下偏移、轻微 3D 旋转；
  - 结束状态：恢复可见、归位、旋转归零。
- 优化动画 cleanup：
  - 清理 `requestAnimationFrame`；
  - 移除事件监听；
  - kill 当前 SplitText 动画和 ScrollTrigger；
  - revert GSAP context 和 SplitText 实例。
- 保留 `prefers-reduced-motion: reduce` 降级逻辑，减少动态效果时跳过首屏开场动画。

### 涉及文件

- `app/components/PortfolioMotion.tsx`
  - 新增 Hero SplitText ready 检查；
  - 新增 `splittext:ready` 监听；
  - 将开场时间线中的标题动画改为派发自定义事件；
  - 增加 active 状态、RAF 和 GSAP context 的清理逻辑。
- `app/components/SplitText.tsx`
  - 新增 `startEvent` prop；
  - 新增默认 `from` / `to` 动画参数常量；
  - 在 SplitText 完成拆分后派发 `splittext:ready`；
  - 支持由外部事件触发文字动画；
  - 优化动画和 ScrollTrigger cleanup。
- `app/page.tsx`
  - 新增 Hero 标题动画事件名和动画参数；
  - 为 `DIGITAL` 与 `Designer` 两个 `SplitText` 组件传入 `from`、`to` 和 `startEvent`。
- `PROJECT_HISTORY.md`
  - 已创建项目历史与交接说明文件，记录项目概览、结构、部署、2026-07-26 更新、设计规范和后续开发规则。

### 修改原因

- 之前首屏标题动画依赖 `PortfolioMotion` 直接设置 `.hero-display .split-char`。
- 当 GSAP 开场动画启动时，如果 `SplitText` 尚未完成字体加载和字符拆分，标题字符节点可能还不存在，导致 `DIGITAL / Designer` 动画丢失或显示时机不稳定。
- 新方案让 `PortfolioMotion` 等待 SplitText 准备完成，再按开场时间线统一触发标题动画，避免首屏开场与文字拆分之间的竞态。
- 同时把 Hero 标题动画参数放在 `page.tsx` 中显式传入，方便后续维护首屏标题效果。

### 当前项目状态

- 当前分支为 `main`。
- 首屏动画修复相关代码已提交并推送到 `main`：
  - `c8e86e9 Restore hero entrance animation`；
  - `5cae469 Make hero entrance visible after opener`。
- Vercel 会从 `main` 自动部署上述提交。
- 本次补充日志前，`PROJECT_HISTORY.md` 和 `PROJECT_LOG.md` 为未跟踪文档；后续需要纳入版本控制，保证上线记录随仓库保存。

### 下一步待办事项（已部分过期，见 2026-07-27 状态复核）

- 对当前首屏动画改动运行验证：
  - 当前环境应使用 `pnpm run lint`；
  - 当前环境应使用 `pnpm run build`；
  - 测试需后续单独复核。
- 本地浏览器检查首屏加载和开场动画：
  - 普通模式下 `DIGITAL / Designer` 是否按顺序进入；
  - 刷新页面时标题是否稳定显示；
  - `prefers-reduced-motion: reduce` 下内容是否正常可见；
  - 桌面端与移动端 Hero 排版是否保持稳定。
- 如果验证通过，提交并推送到 `main`，等待 Vercel 自动部署。
- 后续可考虑把当前仍是脚手架内容的 `README.md` 更新为 CHENYNII Portfolio 正式项目说明。
