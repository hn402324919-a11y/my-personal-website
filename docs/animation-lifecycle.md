# Animation Lifecycle Architecture

## 1. 页面整体动画流程

页面初次加载后，`PortfolioMotion` 会在 `useLayoutEffect` 中注册 `ScrollTrigger`，并通过 `requestAnimationFrame` 启动主动画流程。HTML 会先加上 `motion-ready`，用于标记 JS 动画系统已经接管。

Opening Animation 会尽快开始，不再等待 Hero 的 `SplitText` 初始化完成。Opening 层负责短暂展示品牌开场，并在结束后隐藏 `.opening-sequence`。

Hero 内容本身会随页面一起渲染。Opening 是覆盖在页面上方的增强动画，不应该成为 Hero DOM 渲染的阻塞条件。

Opening 结束后，流程进入两部分：

- 隐藏 Opening 覆盖层。
- 初始化页面下方各 section 的 ScrollTrigger reveal，并立即执行一次 `ScrollTrigger.refresh()`。

如果 JS 动画接管较晚，CSS fallback 会先完成 Opening，并隐藏覆盖层。此时 `PortfolioMotion` 检测到 Opening 已结束后，会跳过 Hero 标题事件动画，并继续初始化 Section Reveal。

## 2. Opening Animation

所属文件：

- `app/components/PortfolioMotion.tsx`
- `app/globals.css`

负责组件：

- `PortfolioMotion`

GSAP timeline 结构：

- `.opening-mark__line`：品牌文字和副标题进入，带短 stagger。
- `.opening-rail span`：绿色进度线横向展开。
- `.opening-mark`：品牌文字整体淡出并上移。
- `.opening-panel--top` / `.opening-panel--bottom`：上下黑色面板向外打开。
- `.opening-sequence`：设置为 `display: none`。
- `heroEnter`：进入 Hero reveal 阶段。
- Hero portrait、导航、kickers、Hero 标题事件、index、disciplines、lower/meta 依次进入。

开始条件：

- 非 reduced motion。
- `PortfolioMotion` 挂载后进入 `requestAnimationFrame(startPortfolioMotion)`。
- 不等待 Hero `SplitText` ready。

结束条件：

- GSAP timeline `onComplete` 执行。
- 或者 CSS fallback 已经把 `.opening-sequence` 隐藏，JS 接管后走 `openingAlreadyFinished` 分支。

是否阻塞页面显示：

- 不应该阻塞页面 DOM 渲染。
- Opening 只作为覆盖层存在，Hero 应尽快渲染在其下方。
- Section ScrollTrigger 会等 Opening 结束后初始化，但这不影响首屏 Hero 显示。

## 3. Hero Animation

Hero 自己的 reveal 逻辑由 `PortfolioMotion` 主 timeline 里的 `heroEnter` 阶段控制。

相关 class / data 属性：

- `.hero-portrait`
- `.nav`
- `.hero-kickers`
- `.hero-display`
- `.hero-index`
- `.hero-disciplines`
- `.hero-lower`
- `.hero-meta`
- `.hero [data-reveal]`
- `.hero .split-char`

Hero 标题使用 `SplitText`，通过 `portfolio:hero-title-animation` 事件启动。为了避免事件先于 `SplitText` listener 发生，当前实现会写入全局 key：`__splitTextStart:portfolio:hero-title-animation`。

Hero 受到 `motion-ready` 控制，但作用范围必须限制在 `.hero` 内：

- `.motion-ready .hero [data-reveal]`
- `.motion-ready .hero .split-char`
- `.motion-ready .hero-display`

不能把 `motion-ready` 扩展到全站 `[data-reveal]` 或全局 `.split-char`。

## 4. Section Reveal系统

Section Reveal 由 `PortfolioMotion.tsx` 中的 `buildResponsiveSectionMotion()` 初始化。

ScrollTrigger 初始化时机：

- Opening timeline 结束后，在 `onComplete` 中初始化。
- 如果 CSS fallback 已经完成 Opening，则在 `openingAlreadyFinished` 分支中初始化。
- 初始化后执行 `ScrollTrigger.refresh()`，保证布局测量基于 Opening 隐藏后的页面状态。

使用 `data-reveal` 的模块：

- PROFILE：`#about`
- ABILITY：`#strengths`
- PROJECT：`#work`
- CONTACT：`#contact`

初始化依赖条件：

- DOM 已渲染。
- Opening 覆盖层已隐藏。
- 不处于 reduced motion。
- 桌面和移动端分别通过 `gsap.matchMedia()` 建立对应 reveal 参数。

PROFILE：

- 使用 `buildProfileMotion()`。
- 包含标题、id card、portrait、lead、timeline、education/tools 等独立节奏。
- 桌面端还会开启 portrait / project / strength visual 的 parallax。

PROJECT：

- 使用通用 `buildSectionMotion()`。
- 标题、project cards、manifesto、orbit、visual clip-path reveal 由同一个 section timeline 控制。

ABILITY：

- 使用通用 `buildSectionMotion()`。
- strength cards 由 `.strength-card-shell` reveal，内部视觉由 `.strength-visual` clip-path reveal。

CONTACT：

- 使用通用 `buildSectionMotion()`。
- 标题为 `.contact-content h2`。
- 卡片 reveal 目标为 `.contact-actions > .magic-bento-card`。
- visual 目标为 `.contact-actions`。

## 5. Contact特殊动画系统

Contact 模块包含三个动画/视觉层：

- `MagicBento`：负责 hover spotlight、卡片磁吸、粒子、hover glow CSS 变量。
- `SpecularFrame`：负责每张联系卡片内部的 canvas 边缘高光。
- Section reveal：负责 Contact 进入视口时的整体进入动画。

`MagicBento` 所属文件：

- `app/components/MagicBento.tsx`

`SpecularFrame` 所属文件：

- `app/components/SpecularFrame.tsx`

Contact 卡片的边框和光效不是单一来源，包含：

- 卡片自身 CSS 边框/背景。
- `magic-bento-card--border-glow` 的伪元素光效。
- `SpecularFrame` 注入的 WebGL canvas 边缘高光。

为什么不能提前初始化：

- `MagicBento` 和 `SpecularFrame` 都依赖元素尺寸、鼠标位置、合成层和可见性判断。
- 如果在 Opening 覆盖层、全局 `transform`、全局 `autoAlpha` 或全站 `[data-reveal]` 状态尚未稳定时接管，可能出现重复边框、残留 transform、光效叠层或测量偏差。
- Contact 的 reveal 必须交给 Section ScrollTrigger 生命周期，在 Opening 完成后再初始化。

动画结束要求：

- Section card reveal 完成后清理 `transform` 和 `will-change`。
- Contact hover 效果由 `MagicBento` 自己接管，不应被 Opening 或 Hero 的全局样式覆盖。

## 6. 全局状态注意事项

不能全局修改或覆盖的选择器：

- `[data-reveal]`
- `.split-char`
- `.magic-bento-card`
- `.magic-bento-card--border-glow`
- `.specular-frame`
- `.contact-actions`

`motion-ready` 的作用范围：

- 用于标记 JS 动画系统已经接管。
- 当前只允许作为 Hero 首屏兜底使用。
- 规则必须限定在 `.hero` 内，避免影响 PROFILE、ABILITY、PROJECT、CONTACT。

修改 Opening 时不能影响的模块：

- Section ScrollTrigger 初始化顺序。
- Contact / MagicBento / SpecularFrame 的 hover 与 canvas 生命周期。
- 非 Hero 的 `SplitText` scroll-trigger 动画。
- 非 Hero 的 `[data-reveal]` 初始隐藏和进入状态。

## 7. 后续修改原则

- 首屏优化只能影响 Opening 和 Hero。
- 不允许为了首屏速度提前初始化所有 ScrollTrigger。
- 不允许全局覆盖 `[data-reveal]`。
- 不允许全局覆盖 `.split-char`。
- Opening 不应等待 Hero `SplitText` ready。
- Section ScrollTrigger 应在 Opening 结束并隐藏覆盖层后初始化。
- 修改 GSAP timeline 后，需要检查 PROFILE、ABILITY、PROJECT、CONTACT 四个 section。
- Contact 视觉异常应优先检查动画生命周期、全局 transform、`autoAlpha`、`will-change`、`clearProps`，不要通过删除 Contact 的边框、伪元素或 canvas 光效来解决。
- 所有 reveal 动画结束后，应清理不再需要的 `will-change`；卡片类 reveal 结束后应清理残留 `transform`。
