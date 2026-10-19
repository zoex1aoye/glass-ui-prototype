# Flush 圆角对齐：托盘 32 / Region 16 / Flush 16

日期：2026-10-19

## 判因

产品托盘是 `GlassSurface`（Host Tray），不是 Lab 橱窗壳 `lab-frame`。本轮之前：

- `--glass-wb-surface-radius` 为 24px，`Surface __body` 为裸 `calc(24 - 16) = 8px`。
- `.lab-frame--surface` 仍吃 `--glass-wb-card-radius`（18px），与 Surface 的 24px 形成双托盘圆角竞争。
- Lab §4 的 `.lab-stub--rail` / `.lab-stub--stage` 未设 flush 圆角，backdrop 可漏方角。

## 改动

- `glass-frontend/src/styles/theme.css`
  - `--glass-wb-surface-radius`：24px → 32px。
  - `--glass-wb-stack-flush-radius` 保持 `calc(L1 - pad)` 单源公式；默认解析为 `32px - 16px = 16px`。
  - 注释同步为 L1=32、Region=16、Flush=16。
- `glass-frontend/src/components/glass/GlassSurface.vue`
  - `__body` 圆角从裸 `calc(L1 - pad)` 改为 `var(--glass-wb-stack-flush-radius)`。
- `glass-frontend/src/views/system/lab/lab-shared.css`
  - `.lab-frame--surface` 圆角改为 `var(--glass-wb-surface-radius)`，并加 `overflow: hidden`。
  - `.lab-stub--rail`：`flush 0 0 flush` + `overflow: hidden`。
  - `.lab-stub--stage`：`0 flush flush 0` + `overflow: hidden`。
- `glass-frontend/src/views/system/lab/LabLayoutView.vue`
  - §2 / §4 / §5 验收文案统一为：托盘=GlassSurface；L1=32；Region/Flush=16；Lab frame 对齐 Surface。

## 不变量

- Surface `padding: var(--glass-layer-l1-pad)` 未改，四周 Inset Reveal 保留。
- Rail–Stage 仍为 `gap: 0`，未新增 gutter。
- Rail 左侧 / Stage 右侧贴缝边仍为 0；外角统一吃 flush token 16px。
- `docs-nav` 未改；未 commit；未启动 Vite。

## 验证

- `npm --prefix glass-frontend run build`：通过（`vue-tsc -b && vite build`，退出码 0）。
- 构建仅有仓库既存的 `:deep` lightningcss warning 与 chunk size warning，无 TS / CSS / build error。
- `git diff --check`：通过。
- 构建产物核对：
  - `--glass-wb-surface-radius: 32px`
  - `--glass-wb-stack-flush-radius: calc(var(--glass-layer-l1-radius) - var(--glass-layer-l1-pad))`
  - `.glass-surface__body` / `.glass-rail` / `.glass-stage` 均引用 `var(--glass-wb-stack-flush-radius)`
  - `.lab-frame--surface` 引用 `var(--glass-wb-surface-radius)` 且 `overflow: hidden`
  - `.lab-stub--rail` / `.lab-stub--stage` 为镜像非对称 flush 圆角且 `overflow: hidden`

## 验收边界

本轮未启动 Vite，未生成 Lab 页同视口截图；结论限定为代码、构建产物与几何链路核验。预览服务恢复后应复查 `/layout` §4 / §5：Surface 四周 pad 可见、Lab frame 与 Surface 外圆角对齐、Rail/Stage 外角 16px、贴缝仍无缝且无 backdrop 方角漏出。
