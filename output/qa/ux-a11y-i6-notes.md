# Track I6 · Token 对比度：muted / success / form-error / focus-ring

- 日期：2026-10-19
- 来源：`output/qa/ux-delivery-matrix-c-2026-10-19.md` §P1-2
- 权威：已定 `theme.css` token 体系；未换色板、未改 Scrim / 大面材质教条
- 范围：仅 `glass-frontend/src/styles/theme.css` 的相关 token
- 边界：未改组件内魔法色；未改 Lab 文案 / `docs-nav`；未引入依赖；未 commit

## 1. 实现结论

| 语义 | 调整 |
|---|---|
| muted 正文 | `--glass-text-muted: #94a3b8 → #58697d` |
| disabled 分离 | 新增 `--glass-text-disabled: #94a3b8`；tabs / radio segment / collapse / picker cell / dropdown 的 disabled token 改为引用它 |
| success 文字 / 图标 / Badge | `--glass-wb-online-text: #18b458 → #0e783b`；`#18B458` 只保留在装饰性透明尾染 |
| form error | `--glass-wb-form-error: #d94a4a → #bd3628`；required mark 继续派生；error hairline 改为由 form-error token 派生 |
| control focus ring | `rgba(47, 107, 246, 0.28) → rgba(29, 78, 216, 0.72)` |
| field focus ring | `rgba(47, 107, 246, 0.22) → rgba(29, 78, 216, 0.68)`（输入类控件同源收口） |

说明：

1. 把正文 muted 与 disabled 拆开，避免提高正文对比度后把禁用态误读为可用。
2. success 采用既有酷安绿语义的深档，不新增语义色板；`--glass-wb-btn-success` 保持 `#117E3E`。
3. form error 与 focus ring 只调整相关变量，没有改动 Alert danger、Scrim、玻璃材质或大面积底色。
4. `--glass-text-secondary: #4a5568` 已满足白底 7.53:1 / 页底 6.70:1，本轮保持不动。

## 2. 调前 / 调后对比度估算

计算口径：WCAG 2.x 相对亮度公式；半透明 focus ring 先按背景做 alpha 合成再计算。背景取页面中实际可能承载对应文字 / 控件的近白底色：

- 白底 `#ffffff`
- 页底 `#eef2f8`
- Lab frame `#e6ebf8`
- Glass surface 近似 `#f7fafd`
- Badge online 浅底 `#e7f8ef`
- 页底深端合成近似 `#e1e9f2`（用于看最差边界）

### 2.1 文本与状态文字

数值为「调前 → 调后」。

| 语义 | 颜色 | 白底 | 页底 | Lab frame | Badge online | 最深边界 |
|---|---|---:|---:|---:|---:|---:|
| muted 正文 | `#94a3b8 → #58697d` | 2.56 → 5.63 | 2.28 → 5.01 | 2.15 → 4.72 | 2.33 → 5.11 | 2.09 → 4.59 |
| success 文字 / 图标 | `#18b458 → #0e783b` | 2.72 → 5.57 | 2.42 → 4.96 | 2.28 → 4.67 | 2.47 → 5.06 | 2.22 → 4.55 |
| form error | `#d94a4a → #bd3628` | 4.18 → 5.64 | 3.72 → 5.02 | 3.50 → 4.73 | 3.79 → 5.12 | 3.41 → 4.60 |

结论：以上文字在实际测试底色与最深边界上均达到正文 `≥4.5:1`。

### 2.2 非文本 focus ring

数值为 ring 与相邻背景的合成对比度，「调前 → 调后」。

| Token | 调整 | 白底 | 页底 | Lab frame | Glass surface | 最深边界 |
|---|---|---:|---:|---:|---:|---:|
| `--glass-wb-control-focus-ring` | `#2f6bf6 @0.28 → #1d4ed8 @0.72` | 1.46 → 3.72 | 1.43 → 3.47 | 1.42 → 3.35 | 1.45 → 3.63 | 1.41 → 3.31 |
| `--glass-wb-field-focus-ring` | `#2f6bf6 @0.22 → #1d4ed8 @0.68` | 1.35 → 3.42 | 1.32 → 3.23 | 1.31 → 3.11 | 1.33 → 3.34 | 1.31 → 3.05 |

结论：非文本 UI focus 指示在测试底色上均达到 `≥3:1`。

## 3. 验证

```text
npm --prefix glass-frontend run build
→ exit 0
→ 4009 modules transformed
→ built in 663ms
```

仅保留仓库既有 warning：

- `lab-shared.css` 非 scoped 文件中的 `:deep()` 无效伪类 warning；
- 主 chunk 大于 500 kB 的拆包提示。

## 4. 未测 / 待确认

- 观感待人工抽检：本次为 token 数值与构建验证，未做真实浏览器截图 / 同视口肉眼对照；重点看 muted 是否过重、success 深档是否仍能被识别为“成功”、focus ring 是否过抢。
- 半透明玻璃 / backdrop 叠加后的实际合成底色可能随页面内容变化；建议在 `/forms`、`/inputs`、`/actions`、`/data` 用真实浅色与彩色内容各抽检一次 focus ring。
- 未运行 VoiceOver / NVDA；本轮只处理颜色对比，不涉及播报语义。

```text
结论：有条件通过
P1-2：muted 正文提升至 ≥4.5:1；success 文字 / Badge 成功文字提升至 ≥4.5:1；form error 提升至 ≥4.5:1；control / field focus ring 合成对比提升至 ≥3:1；build 通过。
未测/待确认：观感人工抽检待做，重点复核 muted 层级、success 深绿识别度与 focus ring 醒目度；玻璃 / 彩色底叠加后的实际合成对比需真实浏览器抽检。
```
