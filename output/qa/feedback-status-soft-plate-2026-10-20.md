# Feedback Status Semantic Solid · Alert / Message / Notification 沙盒

日期：2026-10-20  
范围：`output/qa/feedback-status-soft-plate-2026-10-20.html`、本说明与
`glass-frontend/src/styles/theme.css` 反馈 token  
**Light / Dark 不透明语义实色均已定稿并写入 theme.css**

## 怎么看

1. 浏览器打开 `output/qa/feedback-status-soft-plate-2026-10-20.html`。
2. 保持 Light，依次核对 Alert 四态、Message 六态、Notification 四态。
3. 重点看浅灰橱窗上的浅冷语义实板：无 Fan Tip、无 frost、无半透透底；只保留 Whisper Lift 外阴影与语义 icon 色。
4. 顶栏切到 Dark，确认四态为深井语义实板、无 blur / 半透透底、正文可读，绿 / 蓝 / 琥珀 / 红四组色相没有被换紫。
5. 用键盘 Tab 抽检关闭、文字操作和 Notice footer 按钮的焦点态；按钮本身只是视觉示意。

## 开关约定

| 属性 | Dark | Light |
|---|---|---|
| `html[theme-mode]` | `dark` | 移除 |
| `html[data-color-scheme]` | `dark` | `light` |
| `html.dark` | 有 | 无 |
| `localStorage` | `feedback-status-soft-plate-scheme` | 同 key |

## Light token 表

Light 值从现 `theme.css` 原样复制；Message / Notification 继续走 Alert 别名链，只改变密度与 DOM 形态。

| 概念 | 沙盒内联名 | 现 token / 值 |
|---|---|---|
| 圆角 | `--status-radius` | `--glass-wb-alert-radius` → `--glass-wb-field-radius` = `12px` |
| Alert 密度 | `--alert-pad-y/x` | `--glass-wb-alert-padding-y/x` = `12px / 16px` |
| Blur | `--status-blur` | `--glass-wb-alert-blur` = `none` |
| 阴影 | `--status-shadow` | `--glass-wb-alert-shadow` = `0 10px 28px rgba(0, 80, 180, 0.07)` |
| Message 密度 | `--message-pad-y/x` | `--glass-wb-message-padding-y/x` = `10px / 14px` |
| Notification 密度 | `--notification-pad-y/x` | `--glass-wb-notification-padding-y/x` = `14px / 16px` |
| Notification 宽度 | `--notification-width` | `--glass-wb-notification-width` = `360px` |
| 主文字 | `--ink` | `--glass-text-primary` = `#1a2332` |
| 次文字 | `--ink-2` | `--glass-text-secondary` = `#4a5568` |
| Alert operation | `--text-action-*` | `--glass-wb-text-cta-*`：字色 `#0052cc`、active `#0047b3`、hover wash `rgba(240,245,255,.62)` |

### Light 四态语义实色

| 状态 | token | fill |
|---|---|---|
| success | `--glass-wb-alert-success-fill` | `#dcf6e6` |
| info | `--glass-wb-alert-info-fill` | `#d6ebff` |
| warning | `--glass-wb-alert-warning-fill` | `#ffefd3` |
| error | `--glass-wb-alert-error-fill` | `#ffe5e5` |

Icon 色同样按别名链复制：success = `--glass-wb-online-text` = `#0e783b`；info / question / loading = `--glass-wb-btn-blue` = `#2f6bf6`；warning = `#9e6400`；error = `#e1251b`。

Light fill 均为单色 hex，不含 `linear-gradient` 或 alpha 透底；Message / Notification 继续通过别名链继承。

## Dark 定稿策略

用户判定 HTML 沙盒的实板观感优于 Lab 半透 frost。Dark 现为不透明语义实色：

| 组 | Dark 定稿 |
|---|---|
| 页底 / 橱窗 | 页底 `#181818`；深冷舞台 `#1f2734` |
| Plate fill | 四态单色 opaque，无 Fan Tip、无 alpha 渐变 |
| Blur | `none` |
| Shadow | 仅外阴影 `0 10px 28px rgba(0,0,0,.35)`；无白 rim / 强 brand inset |
| Title / content | Title `#eef4fc`；content `#c4d0df` |
| Icon | 色相冻结后提亮：绿 `#53d695`、蓝 `#79a8ff`、琥珀 `#f2c05f`、红 `#ff7f76` |
| Border / Tone Rail | 无左侧 Tone Rail；优先干净实板 |

四态 Dark 已写入 `theme.css` 暗色选择器组：

| 状态 | fill | icon |
|---|---|---|
| success | `#1b3f36` | `#53d695` |
| info | `#1b3252` | `#79a8ff` |
| warning | `#433724` | `#f2c05f` |
| error | `#48222c` | `#ff7f76` |

Message / Notification 的 fill / icon / blur / shadow 继续别名 Alert。`theme.css` 另以
`.t-alert` / `.glass-alert` / `.t-message` / `.t-notification` 的 Light + Dark 全局兜底将
`backdrop-filter` 明确置为 `none`。

## 对照结论

### 一致

- Light 四态已改为 `#dcf6e6` / `#d6ebff` / `#ffefd3` / `#ffe5e5` 单色实板；icon 色、12px 圆角、`none` blur、Whisper Lift、Alert / Message / Notification 密度与宽度均从现 token 链路抄入。
- Message 六态齐全；question / loading 复用 info 面与行动蓝 icon。
- Notification 四态齐全，固定约 360px，含 title + content；warning 带双按钮 footer。
- 三个组件区按固定顺序分为 Alert · Inline Banner、Message · Soft Toast、Notification · Soft Notice。
- Light 三区使用浅冷语义实色 · 无半透 frost · 无 Fan Tip · 仅 Whisper Lift 外阴影 · 无左侧 Tone Rail。
- Dark 三区显示语义实色 · 无半透 frost · 无左侧 Tone Rail，与用户确认的 HTML 实板观感一致。
- Dark 四态 fill / icon 已与 `theme.css` 暗色 token 同值；Message / Notification 自动继承 Alert 面。
- 顶栏同步三种 Dark 惯例，并使用指定 `localStorage` key。
- 无 TD / Vue / npm 运行时；icon 为内联 SVG，loading 为三条竖向音浪。
- 可点控件具备 hover / active / focus-visible；reduced-motion 下停用缩放与音浪动画。

### 偏差清单

- 本页是静态 QA 仿真，不是 TDesign 实际 DOM；Toast portal、自动消失和真实关闭行为未接入。
- 本轨未启动 Vite、未启动 Chromium / Playwright，因此没有浏览器截图或像素级 Render 对照证据；当前仅完成源 token 与静态结构自检。
- `theme.css` 的 Light / Dark 四态均已更新为语义实色；`alert-*-fill` 无 `linear-gradient` 残留。

### 待确认项

1. Light 四态实板的粉 / 艳程度是否可接受；若实际橱窗中偏粉或偏艳，可在保留当前色相与不透明前提下再收 chroma。
2. Notification warning footer 是否保持“稍后处理（quiet）+ 查看详情（primary）”的双按钮主次？
3. 如 Dark 实板在实际 Lab 中肉眼过闷，可在 RGB 通道各 ±3 内微调 chroma；仍须保持 opaque，不回 alpha 渐变。
4. 本轨不 commit；浏览器实机验收由 Cursor 执行。
