# Dark Mode 方案 A · Win11 中性炭黑分层

日期：2026-10-21

## 结论

**一致**

- Dark L0 / L1 Mica fallback 使用 `#202020`，页面、Sidebar 与 Surface 同属中性 Base，不再以冷蓝径向 air 或品牌 wash 主导页底。
- Stage 使用 `#2a2a2a`；L2 与 L3 主层使用 `#2c2c2c`；L3 standalone / Dialog 跟随时使用 `#333333`，形成 WinUI 式中性明度阶。
- Rail wash 改为白 alpha 极淡 tint，list item hover / active / pressed 全部改为中性白 alpha，不再使用 alipay / AI 大比例 wash。
- Field、Search、Soft、Pill、Send、Card、Bubble、Reply、Table、Tabs、Collapse、Avatar 等暗色表面均去除品牌蓝底板；按钮蓝、链接/选中文字、语义反馈色与 focus ring 保留。
- Surface Mica/Frost、Stage、L2、L3、Search、Pill Quiet、Table、Dropdown、Popconfirm、Dialog 的 Dark blur 均为 `none`。FormPane 继续沿用 Dialog fill / blur / scrim 别名。
- Dark Scrim 改为 `rgba(0, 0, 0, 0.5)`；Dialog 与 FormPane 共用该 Smoke 黑半透。
- Light `:root` token 未被本轨修改；本轮新增/调整声明均位于 dark 选择器作用域。

**偏差**

- 现状工作区在本轨开始前已有未提交改动（Dialog Solid、warning 色、Lab Actions 与 overlay 文档等）；本轨未回退这些改动，QA 结论只针对 Dark 方案 A 增量。
- `--glass-chroma-ice` / `frost` / `paper` 仍保留既有色相，作为 Lab 色相抽检 token；它们不是本次页面或主要组件表面。`--glass-chroma-poster` 已收为 `#202020`。

**待确认**

- Smoke Scrim 当前取 `0.5`，处于用户给定的 `0.45–0.55` 区间；如实机对比认为 Dialog 分离感偏强，可再裁到约 `0.45–0.48`。
- 当前执行环境无法取得本地浏览器渲染截图，因此未声明像素级 / 同视口视觉一致；已完成构建、Dark token 值断言与关键 blur 断言。后续可用既有 Lab 页面做一次同视口截图复核。

## 抽检结果

| 检查项 | 结果 |
|---|---|
| L0 / L1 Mica / page | `#202020` |
| Stage | `#2a2a2a` |
| L2 / L3 main / L3 inset | `#2c2c2c` |
| L3 standalone / Dialog | `#333333` |
| Contour / hairline | 白 `0.08–0.14` alpha 中性层 |
| Dialog / FormPane scrim | 黑 `0.5`，FormPane 跟随 Dialog |
| Surface 大面积品牌蓝染 | 已移除 |
| Light 漂移 | 本轨未修改 Light token |
| blur none | Mica/Frost、Stage、L2、L3、Search、Pill Quiet、Table、Dropdown、Popconfirm、Dialog 已断言为 `none` |

## 验证

```text
npm --prefix glass-frontend run build
✓ vue-tsc + vite build passed

Dark token assertions
✓ 11/11 target values passed
✓ 13/13 blur-none assertions passed
```

构建仅输出既有的大 chunk 警告，无 TypeScript / Vite error。

## 改动文件

- `glass-frontend/src/styles/theme.css`
- `output/qa/dark-win11-neutral-a-notes.md`

未修改 `docs-nav`、路由、组件脚本逻辑或依赖；未启动 Vite；未 commit。
