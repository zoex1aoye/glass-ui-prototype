# Interaction Token 建议面（按钮与行动）

> 实现时写入 `glass-frontend/src/styles/theme.css`；名称可微调，语义不可丢。  
> 规格权威：`.agents/tmp-button-motion-model.md`（Liquid Lift Press）· `.agents/tmp-quiet-active-contrast.md`（Separate Tracks）· `.agents/tmp-quiet-active-invert-eval.md`（Press Invert 否决）· `.agents/tmp-quiet-hover-border-eval.md`（Hairline / Hover Border Fade）。数值须与 theme.css 一致。  
> Status 色值权威：warning 见 `.agents/tmp-cnpc-baoshihua-warning-eval-v2.md`（中石油宝石花辅色 CNPC Baoshihua Accent Yellow · Pantone 137C，锚 `#FFA300` / 钮 **`#9E6400`**；**v1 钮 `#8C5A00` 已被 v2 纠正，勿再引用**）；success 酷安绿仍见 `.agents/tmp-baoshihua-coolapk-tones-eval.md`（该文件 **warning 黄丽段已作废**，仅 §2 Success 有效）；danger 见 `.agents/tmp-status-tone-refine-eval.md`（JD Red）。——Filled 轨 hover/active 行为不变，只认 hex。Danger 京东红冻结勿改。

## Color Shift 分轨（Separate Tracks）

| 轨 | 变体 | hover | active |
|---|---|---|---|
| **Tonal** | quiet / soft / ghost | wash 略深；**无** brightness | **Quiet Active Wash**（略深同色）；字色 contrast-safe 深字；**禁止**近黑 / brightness 压暗；**禁止 Press Invert**（字色反转浅/白） |
| **Filled** | primary / send / FAB / danger / warning / success | `brightness(1.04)` / FAB `1.06` | filter 回 `none` 或略深；白字不变；按压不削弱 |

> **Press Invert = 评估否决项**（B/C 方案均不做）。理由与五维评估见 `.agents/tmp-quiet-active-invert-eval.md`。Tonal active 只允许 Quiet Active Wash + 深字；勿为「按压更明显」把字色翻白。

## Hairline Border / Hover Border Fade（Tonal Quiet Chrome）

> 裁定见 `.agents/tmp-quiet-hover-border-eval.md`（**C + hover A**）。  
> soft / ghost **取消实线 `border`**（盖掉 TDesign 渗色）；轮廓只走 `inset 0 0 0 1px` hairline。  
> quiet = Shadow-only Chrome（对齐 t1 `.pill` 语义），维持 `border: none`。  
> hover：hairline **更淡（Fade）**；悬停表达交给 fill + Hover Lift + Shadow Bloom，**禁止**实线描边箍边。  
> focus ring 与 border 分离；**禁止** soft/ghost 使用 `--glass-wb-pill-hover-border` / `--glass-wb-field-hover-border`。

```css
/* Quiet Chrome — Hairline Border（Tonal soft/ghost；非 Field） */
--glass-wb-tonal-hairline: inset 0 0 0 1px rgba(120, 160, 210, 0.22);
--glass-wb-tonal-hairline-hover: inset 0 0 0 1px rgba(120, 160, 210, 0.1); /* Hover Border Fade */
--glass-wb-tonal-hairline-active: inset 0 0 0 1px rgba(120, 160, 210, 0.14);
```

soft/ghost 影组合（**hairline 在前，外影在后**）：

| 态 | box-shadow |
|---|---|
| default | `var(--glass-wb-tonal-hairline)` |
| hover | `var(--glass-wb-tonal-hairline-hover), var(--glass-wb-pill-quiet-hover-shadow)` |
| active | `var(--glass-wb-tonal-hairline-active), var(--glass-wb-pill-quiet-active-shadow)` |
| focus-visible | rest hairline + `--glass-wb-control-focus-ring`（勿改 border-color） |

alpha 叙事：default **0.22** → hover **0.10**（Fade）→ active **0.14**（略回、仍 Quiet）。Primary / send / FAB 保持满浓 `border: none` 策略，不套 hairline。

## Suggest Chip Lift（`GlassSuggestChip`）

> 裁定见 `.agents/tmp-chip-and-input-chrome-eval.md` §2。本质 Quiet/soft pill（Tonal + Quiet 幅度），非 Primary。

| 态 | 位移 | 填充 / 字色 | 轮廓 |
|---|---|---|---|
| rest | 0 | `--glass-wb-pill-bg` / `--glass-wb-pill-text` | `border: none` + `--glass-wb-tonal-hairline`（无外影） |
| hover | `translateY(var(--glass-wb-control-lift-quiet))` | `--glass-wb-pill-hover-bg`；无 brightness | hairline Fade → `--glass-wb-tonal-hairline-hover` |
| active | `translateY(--glass-wb-control-press-y)` + scale 0.98 | **Quiet Active Wash**：`--glass-wb-pill-quiet-active-bg` / `-color`（深字，不反转） | `--glass-wb-tonal-hairline-active` |
| focus-visible | 无位移 | 不变 | rest hairline + `--glass-wb-control-focus-ring` |

**Icon Leading**：`#icon` slot（左侧 14–16px，gap 6–8px）；`text` / default 文案 slot 保留。  
**禁止**：`--glass-wb-pill-hover-border` / 实线描边加深；Primary 幅度；Press Invert。reduced-motion：无 transform。

## Input Quiet Chrome（裁定 C · Field / Capsule）

> 见 `.agents/tmp-chip-and-input-chrome-eval.md` §3。Kill Inner Rect 之后收束**外层**边框；Focus Ring Follows Radius 不变。

| 态 | 外层 chrome |
|---|---|
| rest | `border: none`；`box-shadow: var(--glass-wb-field-hairline)` |
| hover（非 focus） | hairline Fade → `--glass-wb-field-hairline-hover`；**禁止** `--glass-wb-field-hover-border` 实线；无 lift |
| focus-within | **ring only**：`box-shadow: var(--glass-wb-field-focus-ring)`；hairline / border 透明 |
| disabled | rest hairline + 降透；无 ring |

```css
/* Input Quiet Chrome — Field / Capsule（非 Tonal 按钮，但同 hairline 技法） */
--glass-wb-field-hairline: inset 0 0 0 1px rgba(120, 160, 210, 0.2);
--glass-wb-field-hairline-hover: inset 0 0 0 1px rgba(120, 160, 210, 0.1);
/* focus：不用 hairline；仅 --glass-wb-field-focus-ring */
```

同步 `GlassInput` + `GlassSearchCapsule`；Form 内嵌勿双环。遗留 `--glass-wb-field-hover-border` / `--glass-wb-field-focus-border`：Input/Capsule/Form **停止消费**。输入禁止按钮式大位移 lift。

## Quiet Field Chrome（Form 裸控件）· Validation Whisper

> 见 `.agents/tmp-glass-form-density-eval.md` §5。Form 内 `t-input` / `t-select` / `t-textarea` 与 Input 裁定 C 同技法。

| 项 | 约定 |
|---|---|
| rest / hover / focus | 同 Input Quiet Chrome：hairline · Fade · **ring only** |
| Kill Inner Rect | Select / Textarea 内芯禁双环；GlassInput 外壳自理 |
| error / warning | 柔和 hairline 色 `--glass-wb-field-error-border` / `--glass-wb-field-warning-border`（inset 1px）；**禁止** focus 亮实线 |
| Validation Whisper | 12px tip；`--glass-wb-form-error` / `--glass-wb-form-warning` / `--glass-wb-online-text`；默认 `statusIcon=false` |
| Label Rhythm | top：下距 6–8px；left/right：取消下 padding、与 Field 38 垂直居中 |
| Choice Quiet | Checkbox / Radio / Switch：字色 secondary、选中 `--glass-brand-blue`、禁用 `--glass-wb-control-disabled-opacity` |

## Quiet Grid / Table（`GlassTable`）

> 映射权威：`.agents/tmp-glass-table-t1t4-plan.md`。单一 Quiet Grid 语言，按区域借用 t1–t4 材质语义（不做四套主题切换）。

| 语义 | 签名 class | 落点 | Token |
|---|---|---|---|
| **t1 Host Tray** | `.big` | 表格外壳 `variant="tray"`（默认） | `--glass-wb-table-fill` / `-blur` / `-radius` / `-shadow` / `-hairline` |
| **Stage Nested Chrome** | — | 表格外壳 `variant="inset"` | `--glass-wb-table-inset-fill` / `-blur(none)` / `-shadow(none)` / `-hairline` / `-radius(12)`；Stage 内嵌禁双托盘 |
| **Header Band** | `.t3 .bph` | `thead` 一体带 | `--glass-wb-table-header-fill`（线性缎带；th/tr 透明；字 secondary） |
| **t3 Quiet Ribbon** | 缎带柔长程 | 行分割 + pagination | `--glass-border-soft` 水平 soft；无竖线 |
| **t4 Near-White** | `.bchat` | `td` / 空态 | 行体透明吃外壳；空态 `--glass-text-muted` |
| **Hover Whisper** | session list | 行悬停 | `--glass-wb-table-row-hover`（session-hover 族） |
| **Selected Whisper** | AI 紫点缀 | 行选中 | `--glass-wb-table-row-selected`（极淡紫 wash） |

inset vs tray：Lab 独立橱窗 / 无 Stage 宿主用 `tray`；工作台 Stage / 业务页嵌表用 `inset`（近白微 wash、blur/shadow none、hairline 更淡、radius 12）。

禁止：实白 Excel 卡 + 重阴影、1px 硬描边当玻璃、竖线网格、组件内魔法色。Compound Wrapper 材质在 `GlassTable`，行为透传 `t-table`。Row Density 见 `size="small"`。

## Descriptions 宿主（`GlassDescriptions`）

密 KV 主路径：`GlassPanel variant="standalone"`（Focus Panel L3）→ `GlassDescriptions`。  
Token：L3 standalone 族（`--glass-layer-l3-standalone-*` / `--glass-layer-l3-hairline`）；不另设密信息容器 token。  
Don't：`GlassStage`（会话画布）· `GlassCard`（Cite）· Host Tray / 二次 Surface。A 窄岛 / B Stage canvas / C FormPane 侧详均已撤回。  
**字色三档**：label=`secondary` · content=`primary` · content secondary=`muted`。bordered=Tone Grid + soft hairline（底 wash + 偶数行 `row-stripe` + `label-fill` + `--glass-wb-descriptions-hairline` 柔和 1px 网格）；hairline 只属于 Descriptions 组件网格，Panel standalone / Surface 等容器外轮廓仍不加。

Lab `/data` 橱窗宿主（Descriptions / Empty / List / Loading / Skeleton / Statistic 同路径）：`GlassSurface → GlassPanel variant="standalone" → GlassXxx`。组件本体仍透明底 host-first；禁再用 Soft Surface + `border-soft` 小卡冒充容器。历史密信息详情板（DetailPlate / `.bub-a`）已并入 L3 standalone。

**Loading 动效**：默认三条竖向音浪（`.glass-loading__wave` / `__wave-bar`：三根冷蓝胶囊、条宽 16% / 间隙 14%、`border-radius: 999px`；1.05s 错峰 `height 38%→100%`，禁 `scaleY` 以免圆角压扁成矩形；整组不旋转）。禁 TD 硬圆环 / 锐白核；`prefers-reduced-motion` 下三根等高中等高度静止。

**Skeleton 动效**：微透 · 叠压染色（`.cell-see` / `.lay`：冷蓝半透底 + cyan/zhihu 双层软染强呼吸叠压；**禁**近白高光 / chalk 扫光）。gradient 染层 opacity 约 `0.1→0.95`（2.2s）；flashed 对呼吸约 `0.06↔0.98`（1.2s）。`prefers-reduced-motion` 下静止。

## 建议新增 / 补齐

```css
/* Control interaction — Liquid Lift Press */
/* Hover Lift amplitudes（Quiet < Primary < FAB） */
--glass-wb-control-lift-quiet: -1px;
--glass-wb-control-lift-primary: -2px;
--glass-wb-control-lift-fab: -3px;
--glass-wb-control-press-y: 1px; /* active 微下沉（相对 rest） */
--glass-wb-control-active-scale: 0.98; /* Primary/Quiet */
--glass-wb-fab-active-scale: 0.96;
--glass-wb-control-hover-bright: brightness(1.04); /* Primary；Quiet 不用 */
--glass-wb-control-hover-bright-fab: brightness(1.06);
--glass-wb-control-active-shadow-tight: 0 4px 12px rgba(0, 82, 204, 0.18);
--glass-wb-control-focus-ring: 0 0 0 2px rgba(47, 107, 246, 0.28);
--glass-wb-control-ease-lift: cubic-bezier(0.2, 0.8, 0.2, 1);
--glass-wb-control-transition:
  filter 0.15s ease,
  transform 0.15s var(--glass-wb-control-ease-lift),
  box-shadow 0.15s ease,
  background-color 0.15s ease,
  color 0.15s ease;

/* Shadow Bloom / Settle + Color Shift */
--glass-wb-pill-quiet-hover-shadow: 0 10px 22px rgba(0, 80, 180, 0.12);
--glass-wb-pill-quiet-active-shadow: 0 4px 10px rgba(0, 80, 180, 0.1);
--glass-wb-pill-pri-hover-shadow: 0 14px 32px rgba(0, 82, 204, 0.3);
--glass-wb-btn-blue-hover-shadow: 0 10px 22px rgba(47, 107, 246, 0.32);
--glass-wb-fab-hover-shadow: 0 26px 56px rgba(0, 82, 204, 0.32);
--glass-wb-fab-active-shadow: 0 8px 18px rgba(0, 82, 204, 0.2);

/* Tonal — Quiet Active Wash（Contrast-Safe Press；wash ≠ 墨渍；禁止 Press Invert） */
--glass-wb-pill-quiet-active-bg: rgba(220, 230, 248, 0.78);
--glass-wb-pill-quiet-active-color: #0047b3; /* 保持深字，禁止反转 */
--glass-wb-soft-active-bg: #e6ecf5;
--glass-wb-soft-active-color: var(--glass-text-primary);
--glass-wb-ghost-active-bg: #e8eef7;
--glass-wb-ghost-active-color: var(--glass-text-secondary);
```

## 组件映射

| 组件 | Hover Lift | Color Shift | Active Press | Shadow Bloom → Settle |
|---|---|---|---|---|
| `GlassButton` quiet / soft / ghost | lift-quiet (-1px) | Tonal wash 略深；无 brightness | **Quiet Active Wash** + contrast-safe 字色；press-y + scale 0.98 | quiet bloom → quiet settle |
| `GlassButton` primary (+pill) | lift-primary (-2px) | bright 1.04 | Filled Press：filter 回落；press-y + scale 0.98 | blue/pri bloom → tight |
| `GlassButton` send（可用） | lift-primary | bright 1.04 | 同 primary（Filled） | blue bloom → tight |
| `GlassButton` danger / warning / success（Status Semantic Filled） | lift-primary (-2px) | bright 1.04 | Filled Press：filter 回落；press-y + scale 0.98 | status bloom → status active-shadow |
| `GlassToolbarActions` | 继承 Button | 继承 | 继承 | 继承 |
| `GlassStickyTool` | lift-fab (-3px) | bright-fab 1.06 | Filled Press；press-y + scale 0.96 | fab bloom → fab-active |

## reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  /* 取消 translateY / scale；保留 Color Shift + 阴影状态切换 */
  .glass-button,
  .glass-sticky-tool__orb {
    transition:
      background-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease,
      filter 0.15s ease;
  }
  .glass-button:not(.glass-button--locked):hover,
  .glass-button:not(.glass-button--locked):active,
  .glass-sticky-tool__orb:not(.glass-sticky-tool__orb--locked):hover,
  .glass-sticky-tool__orb:not(.glass-sticky-tool__orb--locked):active {
    transform: none;
  }
}
```
