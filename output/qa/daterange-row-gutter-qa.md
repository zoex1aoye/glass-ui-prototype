# DateRange 行间 Gutter QA

日期：2026-10-18

## 改动

- `--crm-wb-picker-cell-margin-y: 4px`
- `--crm-wb-picker-range-band-height: 24px`
- 日格竖向 margin 改用 `--crm-wb-picker-cell-margin-y`
- range `::before` / `::after` 高度改用 `--crm-wb-picker-range-band-height`
- Week Row 整周带同步收矮并改为垂直居中

## 几何核对

- 日格行距：`30px + 4px × 2 = 38px`
- Range 带高度：`24px`，低于 `--crm-wb-picker-cell-size: 30px`
- 相邻行带间留白：约 `38px - 24px = 14px`
- Range 带仍使用 `top: 50% + translateY(-50%)`，与实心端点保持同一垂直中线
- 未改 `active-start` / `active-end` 的横向 inset、圆角与图层语义

## 构建

`npm --prefix crm-frontend run build`：通过。

## 视觉复核限制

本轮沙箱拒绝本地 dev server 监听（`EPERM 127.0.0.1:5173`），Computer Use 浏览器亦不可用，未能生成改动后的实际截图；以上 gutter 与衔接结论来自 CSS 几何核对。
