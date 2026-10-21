# Overlay Chrome · Dialog / FormPane / Nested Chrome

> 权威落地：`theme.css` 的 `--glass-wb-dialog-*` / `--glass-wb-form-pane-*`；组件 `GlassDialog` / `GlassFormPane` / `GlassDialogSection`。  
> 方案溯源：`.agents/tmp-glass-form-pane-plan.md` · `.agents/tmp-glass-dialog-t1-bchat-plan.md` · Vision QA `.agents/tmp-glass-dialog-t1-session-vision-qa.md`。  
> 本文件 = 库契约详表；红线摘要见 `.agents/rules/glass-component-kit.mdc`。

## 1. 组件选型（兄弟项目）

| 场景 | 用 | 不用 |
|---|---|---|
| 短确认 / 危险确认（1～2 字段可） | **GlassDialog**（Confirm Sheet） | FormPane |
| 开一窗填表（多段 Form） | **GlassFormPane**（表单整装会话窗） | Dialog |
| 页内焦点面（非浮层） | **GlassPanel** | Dialog / FormPane |
| 表单行为（校验 / submit） | **GlassForm**（嵌在上述壳内） | — |
| 聊天气泡 + Composer | **未建**（ChatPane 另案）；Composer 已有 | 禁止塞进 Dialog |

拼写：**FormPane**（Form），禁止 `FromPane`。

## 2. 材质（WinUI ContentDialog · ice 借鉴轻亚克力）

Dialog 与 FormPane **面板**对齐 WinUI / Kit ContentDialog 浮层体量，材质**借鉴** ice Rail 冷晶透感（**不**照抄 `--glass-wb-rail-wash`）。  
（历史：t1 `.bchat` → Floating Solid / B 中性灰白 → 当前：ice 色相 + 高遮罩微透 + 轻 blur。）

| Token 族 | 口径 |
|---|---|
| fill | Light：`color-mix(ice+white 88%, transparent)`（`chroma-ice 46% + white`）/ Dark：**试装 Surface 同款** `var(--glass-wb-surface-fill)`（mica `#202020`；未定稿） |
| blur | Light `blur(20px) saturate(1.2)` · Dark：`var(--glass-wb-surface-blur)`（mica = none） |
| shadow | Light `0 10px 26px rgba(15,40,80,.07)` · Dark：`var(--glass-wb-surface-shadow)` |
| radius | `--glass-wb-card-radius`（**18**；历史 bchat 12 为自觉例外） |
| padding | 壳层 **`--glass-wb-dialog-pad: 14px`** + 纵向 **`--glass-wb-dialog-stack-gap: 12px`**（对齐 HTML 假页；**不再**跟 TD default 32） |

禁令：禁止把 Dialog 做成第二条 ice Rail / Mica 导航带；浮层须保持可读与 Whisper Lift。

### 2.1 默认宽（TDesign Grid 断点 · 自适应）

断点与 [TDesign Grid](https://tdesign.tencent.com/vue-next/components/grid) 一致：`xs<768` / `sm≥768` Pad / `md≥992` / `lg≥1200` Web / `xl≥1400`。  
宽用 token + `min(token, 100vw − gutter)`，**永不撑破屏**（gutter=`32`）。

| 档 | Grid | Confirm (`--glass-wb-dialog-width`) | FormPane (`--glass-wb-form-pane-width`) |
|---|---|---|---|
| 手机 | xs | `100vw − 32` | 同左 |
| Pad | sm | **420** | **560** |
| 默认 | md | **420** | **640** |
| Web | lg / xl | **480** | **720** |

语义上约等于 24 栅的短确认 ~10–14 列、整装表单 ~14–18 列；**不**在组件内嵌 `t-row/t-col`，只复用断点。  
FormPane 材质仍跟随 Dialog token，除非刻意分轨。

## 3. Modal Scrim（降浅换微透）

```text
/* Light */
--glass-wb-dialog-scrim: rgba(15, 40, 80, 0.14)
/* Dark */
--glass-wb-dialog-scrim: rgba(0, 0, 0, 0.55)
--glass-wb-form-pane-scrim: var(--glass-wb-dialog-scrim)
```

- 浅色：同色相降 alpha；深色：中性烟幕。背后色相靠 **Scrim** 透出；面板另有轻 `backdrop-filter`（ice Acrylic），二者分工。  
- **禁止**用抬 fill / 白渐变 / 面板内花瓣径向「补白」。  
- 再调 scrim 须用户裁决（全库 Modal 对比度）。

## 4. Header（裸行）+ Body Tray G（Dialog / FormPane 共用）

两组件默认 header / body **同一套**（class：`.glass-overlay-header*` / `.glass-overlay-body-tray`；token：`--glass-wb-overlay-*`）。

| 区 | 规则 |
|---|---|
| Header | **无容器底板**；仅 flex 行承载可选 **默认圆形** icon（`#icon`）+ Title / Subtitle，保留 gap 与右侧关闭钮避让。无 `#icon` **不占空圆**。`#header` 全自定义时不注入本结构。 |
| Leading | **默认圆形实色**徽标（32 · radius 999）：Neutral = `btn-blue` 实底 + 白线标 + 蓝悬浮影；`theme=danger` 且无 `#icon` 时 GlassDialog **默认注入** `ErrorCircleIcon`，圆标走 `--glass-wb-overlay-header-icon-bg-danger` / `-shadow-danger`。glyph 16 居中；**禁** TD 原生 theme header icon（须隐藏）、accent wash 空心圆 / 方角 mark / soft 灰底 / `GlassAvatar`。 |
| Body | default / `#body` 默认包 Body Tray：**试装 Stage 同款 fill**（未定稿；无 seam/shadow）。Light / Dark 均 `var(--glass-wb-stage-fill)`（深色即实色 `#2a2a2a`）。radius 10、pad 16、hairline none。`bodyTray={false}` 可裸出。 |
| Footer | 不变；header↔body↔footer 分界仍只靠纯间距（见 §5）。 |

禁 Nested Chrome：托盘内**禁止**再叠 Surface / PosterWash / 花瓣 / page-bg 脏灰双卡。Dark 面板壳试装 Surface fill ≠ 在 tray 内嵌第二层 Surface。

## 5. 分区节奏：纯间距（非 hairline）

Overlay 壳（Dialog / FormPane）的 header↔body↔footer，以及 `GlassDialogSection` 的 `divider`：

- **只**用垂直 padding（如 12px）建立节奏；  
- **禁止** inset `box-shadow` hairline 当分界（Body Tray G：`hairline: none`，不靠描边造卡）。

> 注意：按钮 Tonal Quiet 的 `--glass-wb-tonal-hairline` 是**小物件轮廓**，与 Overlay 分区线无关，勿混删。

## 6. Nested Chrome 禁令

仅搬 ContentDialog Floating Solid 面板材质进 Overlay。**禁止**搬进 Dialog / FormPane 面板：

- `.t1 .air` / 花瓣径向 / PosterWash / hero-air  
- `.t1 .bph` 扇形头  
- `.t1 .bsurf` / `.big` 大托盘  
- 聊天气泡 `.ba` / `.bu`、输入条 `.bin`（属 Composer / 未来 ChatPane）

附图 t1「花瓣·扇形过渡」是**主题签名板**，整装 ≠ Confirm Sheet；整装表单走 FormPane，整装聊天另案。

## 7. API 契约差

| | Dialog | FormPane |
|---|---|---|
| 默认脚钮 | 有（quiet 取消 + primary/danger 确认） | **无**（强制 `#footer` slot） |
| theme | `default` / `danger` | 无 destructive theme 轨（危险确认仍用 Dialog） |
| 分段 | `GlassDialogSection` | 同左（可共用；divider=纯间距） |
| Enter | `confirmOnEnter` 默认 false | 不开启（Enter 归 Form） |
| `#icon` / `bodyTray` | 共用（见 §4） | 同左 |

## 8. Lab 活文档

`/system/lab/overlay`：Confirm Sheet / FormPane / Popconfirm；Header Icon + Body Tray 演示见「新建」FormPane 与信息确认 Dialog。文案须写清 Dialog vs FormPane 边界。
