# Feedback · WinUI InfoBar / Toast Semantic Solid 收口记录

日期：2026-10-21  
范围：`GlassAlert` / `GlassMessage` / `GlassNotification` 与 Feedback Lab 材质标注  
视觉依据：已定 `--glass-wb-*`、Dashboard WinUI Mica 分层，以及
`output/qa/feedback-status-soft-plate-2026-10-20.md` 的 Semantic Solid 定稿。

## 一致

- Light / Dark 的 `--glass-wb-alert-blur` 均已收为 `none`；Message / Notification 继续通过
  `--glass-wb-message-blur` → `--glass-wb-alert-blur` 和
  `--glass-wb-notification-blur` → `--glass-wb-message-blur` 继承。
- Alert 改为 Inline 专用轻 Rest：
  - Light：`var(--glass-wb-contour), 0 2px 8px rgba(15, 40, 80, 0.04)`
  - Dark：`var(--glass-wb-contour), 0 2px 8px rgba(0, 0, 0, 0.18)`
- Message / Notification 保留浮层单层 Whisper Lift，并不再复用 Alert 的轻 Rest：
  - Light：`0 10px 28px rgba(0, 80, 180, 0.07)`
  - Dark：`0 10px 28px rgba(0, 0, 0, 0.35)`
  - Notification 的 `--glass-wb-notification-shadow` 继续别名
    `--glass-wb-message-shadow`。
- Light 四态浅洗实色与 Dark 四态深井实色均保持不变；Tone Spectrum icon 色相锚未改。
- Feedback fill 仍为不透明 hex / token 别名，未出现 Fan Tip 或其他渐变 fill。
- Alert / Message / Notification 仍无左侧 Tone Rail；密度、radius、Notification 宽度与
  live region / Plugin API 均未改。
- Lab 中三处会误导的 `Status Soft Plate / Fan Tip / Light Frost / Notice Soft Plate`
  材质标注已改为 Semantic Solid，并明确 Alert 为 InfoBar、浮层为 Toast / Soft Notice；
  其他固定业务文案与信息架构未改。

## 偏差

- 本轨按约束未启动 Vite、Chromium / Playwright，因此没有浏览器截图或像素级 Render
  对照；以上结论来自源码 token、组件引用与构建产物检查。
- `npm --prefix glass-frontend run build` 无 error；仍有仓库既有的单个 chunk 超过
  500 kB 警告，与本轮 Feedback 改动无关。

## 待确认

1. 需在真实 Lab Light / Dark 视口中确认：Alert 的 contour + 极轻 Rest 是否足够稳定，
   以及 Message / Notification 的 Whisper Lift 是否仍有清晰浮层感。
2. Lab 分区标题与 `messages.ts` 中既定的 `Soft Toast / Soft Notice` 命名本轮未改；
   若要把产品文案全面统一为 WinUI `Toast` 口径，需另行确认，避免越过固定文案纪律。

## 改动文件

- `glass-frontend/src/styles/theme.css`
- `glass-frontend/src/components/glass/GlassAlert.vue`
- `glass-frontend/src/components/glass/GlassMessage.vue`
- `glass-frontend/src/components/glass/GlassNotification.vue`
- `glass-frontend/src/components/glass/GlassMessagePlugin.ts`
- `glass-frontend/src/components/glass/GlassNotificationPlugin.ts`
- `glass-frontend/src/views/system/lab/LabFeedbackView.vue`
- `output/qa/feedback-winui-solid-notes.md`

## 抽检记录

- `--glass-wb-alert-blur`：Light / Dark 均为 `none`。
- 阴影分轨：Alert 为 `0 2px 8px` 轻 Rest；Message / Notification 为
  `0 10px 28px` 浮层 Lift。
- Feedback 组件和 token 中无 `linear-gradient` fill，无左侧 Tone Rail。
- `git diff --check`：通过。
- `npm --prefix glass-frontend run build`：通过，无 error。
