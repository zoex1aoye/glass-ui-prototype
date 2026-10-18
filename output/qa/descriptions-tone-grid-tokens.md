# Descriptions Tone Grid · interaction-tokens 待挪入

目标文件：`.agents/skills/crm-glass-ui/references/interaction-tokens.md`  
段落：`## Descriptions 宿主（GlassDescriptions）`

将原句：

> **字色三档**：label=`secondary` · content=`primary` · content secondary=`muted`。bordered 内部格线属组件网格。

替换为：

> **字色三档**：label=`secondary` · content=`primary` · content secondary=`muted`。bordered=Soft Tone Grid（底 wash + 偶数行 `row-stripe` + `label-fill`，零 1px 网格）。

原因：`.agents/**` 在当前 Codex 沙箱为只读，写入被拒；由 Cursor 合流。
