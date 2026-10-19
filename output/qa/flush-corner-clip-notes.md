# Flush Rail|Stage 方角漏出修复

日期：2026-10-19

## 判因

- `.glass-surface__body` 已有 `border-radius: calc(L1 - pad)` 与 `overflow: hidden`。
- `.glass-rail` / `.glass-stage` 原为 `border-radius: 0`，同时启用 `backdrop-filter`。
- Chromium / WebKit 中带 `backdrop-filter` 的子层可穿出父级圆角裁切，导致 Rail 左下与 Stage 右下漏出小方角。

## 改动

- `glass-frontend/src/styles/theme.css`
  - 新增 `--glass-wb-stack-flush-radius: calc(var(--glass-layer-l1-radius) - var(--glass-layer-l1-pad))`。
  - 未使用魔数；默认 token 下解析为 `24px - 16px = 8px`。
- `glass-frontend/src/components/glass/GlassRail.vue`
  - 外轮廓改为 `flush 0 0 flush`：左上 / 左下吃 flush radius，右侧贴缝边保持 0。
  - 新增 `overflow: hidden`，辅助裁切 `backdrop-filter`。
- `glass-frontend/src/components/glass/GlassStage.vue`
  - 外轮廓改为 `0 flush flush 0`：右上 / 右下吃 flush radius，左侧贴缝边保持 0。
  - 外层新增 `overflow: hidden`；滚动仍由既有 `.glass-stage__body { overflow: auto }` 承担。
- `glass-frontend/src/views/system/lab/LabLayoutView.vue`
  - §5 验收 note 补充「Rail 左角 / Stage 右角吃 flush-radius；backdrop 不得漏方角」。

## 不变量

- Surface inset `padding` 未改。
- Rail–Stage 仍未新增 gutter，`gap: 0` 保持。
- Region radius `16px` 未套到 Flush 贴缝边。
- Surface `__body` 仍负责整板裁切与圆角；Rail / Stage 的外侧圆角与其公式同源。

## 验证

- `npm --prefix glass-frontend run build`：通过（`vue-tsc -b && vite build`，退出码 0）。
- 构建提示仅有仓库既存的 `:deep` lightningcss warning 与 chunk size warning，无 TS / CSS / build error。
- 构建产物核对：
  - `.glass-rail`：`border-radius: var(--glass-wb-stack-flush-radius) 0 0 var(--glass-wb-stack-flush-radius); overflow: hidden;`
  - `.glass-stage`：`border-radius: 0 var(--glass-wb-stack-flush-radius) var(--glass-wb-stack-flush-radius) 0; overflow: hidden;`
- `git diff --check`：通过。

## 验收边界

本轮未启动 vite，也未完成可访问 Lab 页的实时截图；因此结论限定为代码、构建产物与几何链路核验。已有预览页恢复可访问后，应复查 §5：Rail 左上 / 左下与 Stage 右上 / 右下无 backdrop 方角漏出，中缝仍 `gap=0` 并保持明度差分界。
