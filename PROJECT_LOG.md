# PROJECT LOG

## 记录规则

- 每次更新上线后，都必须在本文件追加一条记录。
- 记录内容至少包括：日期、commit hash、是否已 push 到 `main`、Vercel 自动部署触发情况、修改摘要、验证结果和已知遗留问题。
- 如果更新影响项目状态、结构、部署规则、设计规则或重要已完成功能，需要同步更新 `PROJECT_HISTORY.md`。

## 2026-07-27

### 上线记录：营销项目卡片媒体区域下方留白优化

- 功能提交：`818eba6 fix: compact mobile project cards`。
- 分支：`main`。
- 远端：将 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 仅修改 `app/globals.css` 中项目展示区移动端样式；
  - 将移动端「体验 / 界面」与「营销 / 运营」项目卡片高度从固定 `520px` 收紧为 `clamp(410px,112vw,440px)`；
  - 将移动端「B 端 / 网页」项目卡片高度从固定 `320px` 收紧为 `clamp(280px,78vw,310px)`；
  - 收紧移动端项目卡片分类标签与标题文案的边距和标题/副标题间距；
  - 仅针对移动端「营销 / 运营」封面媒体组，将 `.campaign-phone` 与 `.campaign-tile` 最终生效位置调整到 `top:42%`，让三张图结束后更自然衔接标题内容；
  - 保持三张图片的宽高比例、资源路径、排列关系、`background-size` 和标题文案不变；
  - 未裁切或替换作品图片，未修改其他项目卡片、项目详情逻辑、Vercel 配置或部署配置。
- 验证结果：
  - `npm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `npm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `npm test` 通过，2/2，构建阶段仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - 曾尝试本地 headless Chrome 移动端截图验证，但现有 `SpecularFrame` / WebGL 在无 WebGL 环境下会触发运行时错误，未扩大本次 CSS 修复范围。
- 已知遗留问题：
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning；
  - vinext 仍提示 `/` 路由在构建时分类为 `Unknown`。

### 上线记录：桌面端项目卡片比例与营销封面完整展示优化

- 功能提交：`f40ceff fix: compact desktop project cards`。
- 分支：`main`。
- 远端：将 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 仅修改 `app/globals.css` 中项目展示区相关桌面端样式；
  - 在 `min-width:1101px` 下将 Project Cards 调整为更紧凑的 4 列非等高网格；
  - 缩短项目展示区整体纵向高度，保留大卡偏横向、小卡接近方形或轻微横向的 Masonry / Grid 节奏；
  - 保持移动端既有 flex 布局和卡片高度规则不变；
  - 调整「营销 / 运营」封面内部三张图的比例容器与位置；
  - 主手机 mockup 使用真实 `1074/2326` 比例与 `background-size: contain`，避免作品截图上下裁切；
  - 左右辅助截图使用各自真实比例容器与 `contain` 完整展示；
  - 将营销封面三张图整体下移，收紧图片组与底部标题文案之间的空白；
  - 未修改作品内容、图片资源、项目详情逻辑、Vercel 配置或部署配置。
- 验证结果：
  - 本地预览 `http://localhost:3001/` 已启动并由用户确认项目卡片整体高度比例满意；
  - `pnpm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `pnpm test` 通过，2/2，构建阶段仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `npm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示。
- 已知遗留问题：
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning；
  - vinext 仍提示 `/` 路由在构建时分类为 `Unknown`。

### 上线记录：PROJECT 2 QQ 星亲子打卡图片替换

- 功能提交：`ff16e31 fix: replace qq star campaign detail image`。
- 分支：`main`。
- 远端：将 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 定位 PROJECT 2「营销 / 运营」中「伊利 QQ 星亲子打卡」案例的图片引用；
  - 将错误的单张 `/work/project-campaign-04-qq-star.webp` 替换为 4 张新的纵向 WebP 分片；
  - 新增 `/work/project-campaign-04-qq-star-part-01.webp` 至 `/work/project-campaign-04-qq-star-part-04.webp`；
  - 为 4 张新切片补充真实 `width`、`height`；
  - 保留 `CaseGallery`、IntersectionObserver 渐进挂载逻辑和既有 `gallery is-sliced` 无缝拼接规则；
  - 未修改其他项目内容、其他页面样式、案例顺序、Vercel 配置或部署配置。
- 验证结果：
  - `npm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `npm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `npm test` 通过，2/2，构建阶段仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - 静态校验：旧单图不再被页面引用，新切片数组满足 `isSliced: true`，详情页初始仍只挂载前 2 张图片，后续切片保持渐进加载。
- 已知遗留问题：
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning。

### 上线记录：项目详情图片渐进挂载优化

- 功能提交：`1cbd94e fix: progressively load project detail images`。
- 分支：`main`。
- 远端：将 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 新增项目详情 `CaseGallery` 渐进图片渲染逻辑；
  - 切片/多图案例首次打开时只挂载前 2 张真实 `<img>`；
  - 后续切片先保留等比例占位，进入弹窗滚动视口附近后再通过 IntersectionObserver 挂载真实图片；
  - 为详情图片补充真实 `width`、`height`，让占位保持原图片比例，减少滚动高度跳动；
  - 保留原 `gallery is-sliced` 结构和视觉规则，不改变切片顺序、gap、边框、圆角或无缝拼接效果；
  - 未修改作品内容、图片资源、案例顺序、Vercel 配置或部署配置。
- 验证结果：
  - `pnpm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `pnpm test` 通过，2/2，构建阶段仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - 本地浏览器验证：Heychic 4 张切片初始只挂载前 2 张 `<img>`，后 2 张为占位；弹窗滚动后后续切片按预期挂载；
  - 本地浏览器验证：切片 gallery 计算样式保持 `rowGap: 0px`，中间切片无边框，最后一张保留底部边框和圆角。
- 已知遗留问题：
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning；
  - 本地仍有 5 个未跟踪旧版整张 WebP 文件，未纳入本次上线提交。

### 上线记录：项目详情长图 WebP 切片与无缝拼接

- 功能提交：`c598b22 fix: optimize project detail images`。
- 分支：`main`。
- 远端：已 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 将项目详情页中超长作品图从原始 JPG 引用改为 WebP 资源；
  - 对 Heychic、AScoin、小 CK、伊利冬奥新春、ESD 音响等超长作品图按原始 JPG 宽度重新切成纵向 WebP 分片；
  - 更新 `app/page.tsx` 的案例 `src` 数据，让页面按原视觉顺序展示所有分片；
  - 保留原始 JPG 文件，不删除备份素材；
  - 新增仅识别 `*-part-xx.webp` 的切片样式标记，避免普通多图案例被误判为长图切片；
  - 对切片案例移除相邻图片间距、中间底部边框和中间说明文字，仅保留最后一张底部圆角/边框/说明，使视觉上接近一整张完整长图；
  - 未修改页面布局、组件逻辑、案例顺序或部署配置。
- 验证结果：
  - `npm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `npm test` 通过，2/2；
  - `pnpm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - 直接执行 `node --test tests/rendered-html.test.mjs` 通过，2/2。
- 已知遗留问题：
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning；
  - 本地仍保留未被页面引用的旧版整张长图 WebP 作为废弃文件，未纳入本次上线提交。

### 上线记录：移动端 skip link 默认隐藏修复

- 功能提交：`f461a1c fix: hide mobile skip link focus issue`。
- 分支：`main`。
- 远端：将 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 定位首页无障碍跳转链接 `<a className="skip" href="#content">跳到主要内容</a>`；
  - 将 `.skip` 默认隐藏方式从单纯 `transform` 位移改为视觉裁剪隐藏；
  - 保留键盘可见焦点时的 skip link 显示能力；
  - 增加 `.skip:focus:not(:focus-visible)`，避免移动端触屏滚动或普通 focus 状态让绿色按钮露出；
  - 未修改导航、页面布局、作品内容、动画时间线或部署配置。
- 验证结果：
  - 本地移动端预览 `390px × 844px` 首屏：`.skip` 保持 `1px × 1px`、`opacity:0`、`pointer-events:none`；
  - 本地移动端预览滚动到第二屏：`.nav is-fixed` 正常出现，`.skip` 仍保持隐藏；
  - `pnpm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `pnpm test` 按项目脚本失败：脚本内部调用 `npm run build`，当前环境无 `npm` 命令；
  - 直接执行 `node --test tests/rendered-html.test.mjs` 通过，2/2。
- 已知遗留问题：
  - 当前环境无 `npm` 命令，`pnpm test` 脚本仍不能按字面执行；
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning。

### 上线记录：移动端导航左右安全距离对齐

- 提交：本次上线提交，push 后以 `origin/main` 最新提交为准。
- 分支：`main`。
- 远端：将 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 仅修改 `app/globals.css` 中移动端导航宽度规则；
  - 在 `max-width: 768px` 下让 `.nav` 与 `.nav.is-fixed` 使用 `var(--shell)`；
  - 将既有 `max-width: 760px` 移动端导航宽度从 `calc(100vw - 24px)` 同步为 `var(--shell)`；
  - 使移动端顶部导航与下方个人信息卡片、正文内容使用一致的左右安全距离；
  - 保持导航圆角、背景、按钮尺寸、内部 padding 和桌面端样式不变。
- 验证结果：
  - 本地预览 `http://localhost:3001/` 已启动并由用户确认可以；
  - `pnpm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `pnpm test` 按项目脚本失败：脚本内部调用 `npm run build`，当前环境无 `npm` 命令；
  - 直接执行 `node --test tests/rendered-html.test.mjs` 通过，2/2。
- 已知遗留问题：
  - 当前环境无 `npm` 命令，`pnpm test` 脚本仍不能按字面执行；
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning。

### 上线记录：移动端开屏文字排版优化

- 提交：本次上线提交，push 后以 `origin/main` 最新提交为准。
- 分支：`main`。
- 远端：将 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 仅修改 `app/globals.css` 中 opening sequence 的移动端断点样式；
  - 将开场断点从 `max-width: 767px` 对齐为 `max-width: 768px`；
  - 保持 `CHENYNII` 字号和字重不变，只通过副标题上边距增强与 `PORTFOLIO` 的呼吸感；
  - 收紧 `PORTFOLIO · 2017—2026` 的移动端字距，调整字号层级，并强制 `white-space: nowrap`；
  - 增加年份行与底部绿色横线之间的距离；
  - 未修改桌面端 opening sequence、Hero 内容、动画时间线、作品内容或部署配置。
- 验证结果：
  - 本地移动端预览 `390px × 844px`：`PORTFOLIO · 2017—2026` 保持单行且不溢出；
  - 本地窄屏预览 `320px × 700px`：`PORTFOLIO · 2017—2026` 保持单行且不溢出；
  - `pnpm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `npm test` 按字面执行失败：当前环境无 `npm` 命令；
  - 直接执行 `node --test tests/rendered-html.test.mjs` 通过，2/2。
- 已知遗留问题：
  - 当前环境无 `npm` 命令，项目真实验证继续使用 bundled Node.js 与 `pnpm`；
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning。

### 上线记录：恢复满意版开屏动画并同步移动端项目标签位置

- 线上状态：Vercel Production 已回滚到 `1612cd8`，该版本的首页开屏动画为当前满意基准。
- 提交：`67c7684 baseline: restore preferred opening animation`。
- 分支：`main`。
- 远端：将 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 将 `app/globals.css` 中 `.opening-sequence`、`.opening-panel`、`.opening-mark`、`.opening-mark__line`、`.opening-rail` 相关样式恢复到 `1612cd8` 的 opening animation 结构；
  - 删除后续 loading glow / 左侧锚定优化引入的 `.opening-sequence::before` 光晕层；
  - 保留项目卡片 `.card-top` 左上角定位修复，并将 `.work .project-card .card-top` 的 `right:auto` 逻辑应用到移动端；
  - 首页项目模块分类标签 `体验 / 界面`、`营销 / 运营`、`B 端 / 网页` 在 PC 与移动端均锚定到卡片左上角。
- 验证结果：
  - 用户确认当前首页开屏动画已经恢复到满意版本；
  - 本地创建稳定基准 commit `67c7684`；
  - `pnpm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `pnpm test` 按项目脚本失败：脚本内部调用 `npm run build`，当前环境无 `npm` 命令；
  - 直接执行 `node --test tests/rendered-html.test.mjs` 通过，2/2；
  - 本地 dev server 已启动到 `http://localhost:3000/` 供上线前预览。
- 已知遗留问题：
  - 当前环境无 `npm` 命令，`pnpm test` 脚本仍不能按字面执行；
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning。

### 上线记录：按预览注释精确锚定项目分类标签

- 提交：`7831472 fix: anchor project tags left on desktop`。
- 分支：`main`。
- 远端：已 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 根据本地预览注释重新定位项目卡片图片区域内的分类标签 `.card-top`；
  - 在桌面断点 `min-width:761px` 下显式设置 `right:auto`，让标签文案真正锚定到左上角 `left:24px`；
  - 保留原有 `top:24px`、字体、字号、颜色、透明度、背景样式、图片、标题描述布局和 hover / reveal 动画；
  - 移动端继续沿用既有右上角位置。
- 验证结果：
  - `npm run lint`、`npm run build`、`npm test` 按字面执行失败：当前环境无 `npm` 命令；
  - 使用 bundled runtime 执行 `pnpm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `node --test tests/rendered-html.test.mjs` 通过，2/2；
  - 本地浏览器桌面端 `1440px` 量测：三个项目标签均距卡片左侧 `24px`；
  - 本地浏览器移动端 `460px` 量测：三个项目标签仍距卡片右侧 `24px`。
- 已知遗留问题：
  - 当前环境无 `npm` 命令，项目真实验证继续使用 bundled Node.js 与 `pnpm`；
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning。

### 上线记录：Loading 进度条与文字基准线回归修复

- 提交：`8bd1e43 fix: restore loading rail alignment`。
- 分支：`main`。
- 远端：已 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 修复 `.opening-mark` 使用 grid 左对齐后导致 `.opening-rail` 不再 stretch、进度条宽度塌陷的问题；
  - 将 loading 文字组改为 `flex` 纵向布局，容器自身维持左侧锚点，主标题和副标题共享同一个左侧基准线；
  - 为 `.opening-rail` 明确设置 `align-self: stretch`、`width: 100%` 和 `min-width: 100%`，恢复原位置、长度和 GSAP scaleX 动画承载面；
  - 保留已经优化过的绿色 glow 伪元素、`overflow: visible` 和 z-index 层级，不恢复光晕裁切问题；
  - 未修改 GSAP 动画时间、触发时机和 loading 退出逻辑。
- 验证结果：
  - 使用 bundled runtime 执行 `pnpm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `pnpm test` 按项目脚本失败：脚本内部调用 `npm run build`，当前环境无 `npm` 命令；
  - 直接执行 `node --test tests/rendered-html.test.mjs` 通过，2/2；
  - 本地 dev server `http://localhost:3001/` 已热更新 CSS。
- 已知遗留问题：
  - 当前环境无 `npm` 命令，`pnpm test` 脚本仍不能按字面执行；
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning。

### 上线记录：Loading 光晕与文字左对齐优化

- 提交：`90ee88c fix: refine loading glow alignment`。
- 分支：`main`。
- 远端：已 push 到 `origin/main`。
- 上线方式：Vercel 监听 `main` 自动部署。
- 修改内容：
  - 将 `.opening-sequence` 顶层容器从 `overflow:hidden` 调整为 `overflow:visible`，避免首屏绿色光晕在视口边缘出现硬裁切；
  - 将绿色光晕从上下幕布背景中拆出，改为顶层伪元素的大范围柔和 `radial-gradient` 与 blur，保持黑底绿光风格；
  - 保留上下幕布、进度条样式与 GSAP timeline，不改变 loading 整体时长、触发逻辑和后续 Hero 入场；
  - 将 loading 文字容器改为桌面左侧锚点，并对标题、副标题行显式设置左对齐和左侧自对齐。
- 验证结果：
  - 使用 bundled runtime 执行 `pnpm run lint` 通过，仍有既有 8 条 `@next/next/no-img-element` warning；
  - `pnpm run build` 通过，仍有既有 Vite chunk size warning 与 vinext route classification `Unknown` 提示；
  - `pnpm test` 按项目脚本失败：脚本内部调用 `npm run build`，当前环境无 `npm` 命令；
  - 直接执行 `node --test tests/rendered-html.test.mjs` 通过，2/2；
  - 本地 dev server 可启动到 `http://localhost:3001/`，但 Playwright 浏览器二进制未安装，未完成自动截图。
- 已知遗留问题：
  - 当前环境无 `npm` 命令，`pnpm test` 脚本仍不能按字面执行；
  - `app/page.tsx` 仍使用原生 `<img>`，产生 8 条 Next.js 图片优化 warning；
  - 客户端产物仍有超过 500 kB 的 chunk size warning。

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
