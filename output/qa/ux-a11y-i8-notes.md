# Track I8 · P2 小修打包

- 日期：2026-10-19
- 来源：`output/qa/ux-delivery-matrix-c-2026-10-19.md` §P2-1 / P2-2 / P2-3
- 范围：`GlassInput.vue` · `GlassSearchCapsule.vue` · `lab-shared.css` · `LabDataView.vue` Empty 区块
- 边界：未改 `docs-nav`；未大重构；未换 UI 库；未自动 commit

## 1. 实现

| P2 | 变更 |
|---|---|
| P2-1 SearchIcon | `GlassInput` 现有搜索图标保留 `aria-hidden="true"`；`GlassSearchCapsule` 的装饰搜索图标补齐同类属性 |
| P2-2 全局 `:deep()` | `lab-shared.css` 的 8 处 `:deep(.t-list-item*)` 改为普通后代选择器，保留原选择器语义；仅清理无效组合器，不改 token / 几何 |
| P2-3 Empty 矩阵说明 | Lab `/data` Empty 区块标注「E1–E5 为类型矩阵（无 action），业务空态须带下一步（见 E6 / E7）」；未给 E1–E5 强加 CTA |

## 2. 验证

```text
npm --prefix glass-frontend run build
→ exit 0
→ 4010 modules transformed
→ built in 712ms
```

- 修改前：8 条 `[lightningcss minify] 'deep' is not recognized as a valid pseudo-class`。
- 修改后：同类 warning 为 0；仅保留既有主 chunk > 500 kB 提示。
- `GlassInput.vue` / `GlassSearchCapsule.vue` 的 `SearchIcon` 均已含 `aria-hidden="true"`。
- `lab-shared.css` 中 `:deep(` 检索结果为 0。

## 3. 未测 / 待确认

- 未运行 VoiceOver / NVDA，未做真实读屏抽检；已核对源码属性与构建。
- 未启动浏览器做像素级 / 运行时 DOM 对照；本轮为样式选择器与装饰图标属性小修，未改视觉 token。
- `lab-shared.css` 中 `.lab-rail-item` / `.lab-rail-meta` 等当前无模板引用，按“保留语义、仅去无效组合器”处理；若后续确认永久废弃，可另起清理回合整段删除。

```text
结论：通过
P2：P2-1 完成（装饰 SearchIcon 均 aria-hidden）；P2-2 完成（lab-shared.css 8 处全局 :deep 改为后代选择器，build warning 归零）；P2-3 完成（Empty E1–E5 标注类型矩阵，未强加 CTA）。
未测/待确认：未做 VoiceOver / NVDA 与浏览器运行时对照；lab-shared.css 未被引用的 rail 子类仅保留语义改写，未整段删除。
```
