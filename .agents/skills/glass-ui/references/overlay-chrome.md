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

## 2. 材质（WinUI ContentDialog · Floating Solid）

Dialog 与 FormPane **面板**材质对齐 WinUI ContentDialog：高遮罩近实、不靠 frost 透背后。  
（历史曾对齐 t1 `.bchat` 半透板；当前权威改为 ContentDialog / Floating Solid。）

| Token 族 | 口径 |
|---|---|
| fill | `var(--glass-layer-l3-standalone-fill)`（Light 近白冷底 / Dark 深冷实板；非 gradient、非 `.6` 半透） |
| blur | `none` |
| shadow | 单层 Whisper Lift（Light `0 12px 30px rgba(15,60,140,.07)`；Dark 同量级深影） |
| radius | `--glass-wb-card-radius`（**18**；历史 bchat 12 为自觉例外） |
| padding | TD `t-dialog` shell **32**（历史 10×12 为自觉例外；Form 呼吸优先） |

FormPane 宽默认 **480**；Dialog Confirm 宽 **420**。FormPane token 以 `var(--glass-wb-dialog-*)` 起步，改材质时优先改 Dialog 源、FormPane 跟随，除非刻意分轨。

## 3. Modal Scrim（降浅换微透）

```text
--glass-wb-dialog-scrim: rgba(15, 40, 80, 0.14)
--glass-wb-form-pane-scrim: var(--glass-wb-dialog-scrim)
```

- 同色相降 alpha；背后色相靠 **Scrim** 透出，不靠面板 frost / backdrop-filter。  
- **禁止**用抬 fill / 白渐变 / 面板内花瓣径向「补白」。  
- 再调 scrim 须用户裁决（全库 Modal 对比度）。
## 4. 分区节奏：纯间距（非 hairline）

Overlay 壳（Dialog / FormPane）的 header↔body↔footer，以及 `GlassDialogSection` 的 `divider`：

- **只**用垂直 padding（如 12px）建立节奏；  
- **禁止** inset `box-shadow` hairline 当分界。

> 注意：按钮 Tonal Quiet 的 `--glass-wb-tonal-hairline` 是**小物件轮廓**，与 Overlay 分区线无关，勿混删。

## 5. Nested Chrome 禁令

仅搬 ContentDialog Floating Solid 面板材质进 Overlay。**禁止**搬进 Dialog / FormPane 面板：

- `.t1 .air` / 花瓣径向 / PosterWash / hero-air  
- `.t1 .bph` 扇形头  
- `.t1 .bsurf` / `.big` 大托盘  
- 聊天气泡 `.ba` / `.bu`、输入条 `.bin`（属 Composer / 未来 ChatPane）

附图 t1「花瓣·扇形过渡」是**主题签名板**，整装 ≠ Confirm Sheet；整装表单走 FormPane，整装聊天另案。

## 6. API 契约差

| | Dialog | FormPane |
|---|---|---|
| 默认脚钮 | 有（quiet 取消 + primary/danger 确认） | **无**（强制 `#footer` slot） |
| theme | `default` / `danger` | 无 destructive theme 轨（危险确认仍用 Dialog） |
| 分段 | `GlassDialogSection` | 同左（可共用；divider=纯间距） |
| Enter | `confirmOnEnter` 默认 false | 不开启（Enter 归 Form） |

## 7. Lab 活文档

`/system/lab/feedback`：§ 表单整装演示 → FormPane；短确认 / danger → Dialog。文案须写清二者边界。
