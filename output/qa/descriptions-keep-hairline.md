# Descriptions · Tone Grid + soft hairline

目标文件：`.agents/skills/crm-glass-ui/references/interaction-tokens.md`
段落：`## Descriptions 宿主（GlassDescriptions）`

将原句：

> **字色三档**：label=`secondary` · content=`primary` · content secondary=`muted`。bordered=Soft Tone Grid（底 wash + 偶数行 `row-stripe` + `label-fill`，零 1px 网格）。

替换为：

> **字色三档**：label=`secondary` · content=`primary` · content secondary=`muted`。bordered=Tone Grid + soft hairline（底 wash + 偶数行 `row-stripe` + `label-fill` + `--glass-wb-descriptions-hairline` 柔和 1px 网格）；hairline 只属于 Descriptions 组件网格，DetailPlate / Surface 等容器外轮廓仍不加。

规则：

- Tone Grid 继续负责 label/content 底色分层与偶数行 content 条纹。
- Soft hairline 只恢复 bordered 组件的外框与右侧/底部格线，末列去右线、末行去底线。
- 容器外轮廓（DetailPlate / Surface）仍禁止新增 hairline。

原因：`.agents/**` 在当前 Codex 沙箱为只读，`apply_patch` 写入被拒；由 Cursor 合流。
