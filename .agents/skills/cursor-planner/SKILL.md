---
name: cursor-planner
description: >
  当 Cursor 作为总规划师编排本仓库任务时使用：角色边界、何时自做 vs 派 Codex、
  控上下文噪音、brief / Track 模板、验收收口。典型触发：「总规划」「拆 Track」
  「派发方案」「减少噪音」「Cursor 自己做还是派 Codex」「编排并行任务」。
  派通道细节见 codex-dispatch；业务步骤仍由 Codex Read 对应 glass-* / docs-shell / prototype-qa。
---

# cursor-planner — Cursor 总规划师编排 SOP

> **目标**：Cursor 上下文保持薄；重活进 Codex。本 skill 管「谁做 / 怎么编排」，不管具体组件怎么改。

## 1. 角色分工

| 角色 | 职责 | 禁止 |
|---|---|---|
| **Cursor（总规划师）** | 理解用户意图 → 定权威与红线 → 拆 Track → 写 brief → 选 `-m` / `-s` → 派发 → 摘要验收 → 问用户裁决 / 汇报 | 默认亲自改 `glass-frontend/**`；默认全文载入业务 skill；把整份 Codex log 堆进对话 |
| **Codex（执行面）** | 按 brief + 路由表 Read 业务 skill / rules → 改代码或写 QA → 落盘约定产出 | 改写规范真相源（除非 brief 明确且沙箱允许）；自动 commit |

mimo 仅用户点名（DEPRECATED）→ `mimo-dispatch`。

## 2. 何时 Cursor 自做（白名单）

与 `.agents/rules/cursor-planner.mdc` 一致，仅下列可自做：

1. 用户点名 Cursor 直改  
2. 规范轨（`AGENTS.md` / `.agents/**`）或 Codex 拒写 `.agents/` 时的落盘 / 挪入  
3. 编排：plan、prompt、派发、log 摘要、返工裁决、用户汇报  
4. 极小阻塞热修（Codex ≥2 轮失败 + ≤约 20 行 / 单文件），须标注「例外自做」  
5. 用户点名的 git / PR  

**灰色地带**：一眼能改的单 token / 单文案 → 仍优先派一条极短 Codex Track（保持「实现进 Codex」肌肉记忆）；仅当派发成本明显高于改动、且用户在催进度时，才用热修例外。

## 3. 标准编排节奏（每轮用户任务）

```text
意图澄清（必要时 1 个关键追问）
  → 写短方案 / Track 表（落 .agents/tmp-*-plan.md，可很短）
  → 每 Track：写 .agents/tmp-codex-<task>-prompt.txt（边界·红线·验收·必读路径）
  → 按模型矩阵选 -m（默认 flash；视觉目标拆 V/I）；按是否落盘选 -s
  → Shell all 拉起 codex exec（可并行多 Track；缺 all 勿派）
  → 先扫 run.log 头/尾：非 EPERM / app-server 失败后，再读 QA 结论段做验收
  → PASS → 向用户给对照结论；FAIL → 写返工 brief 再派（勿 Cursor 大面积接手）
```

并行 / 模型原则（细节见 `codex-dispatch`「模型选择」）：

- **默认** → `-m deepseek-flash`（常规实现、接线、rename、dry-run）  
- **V 视觉验收**（prototype-qa / 截图对照）→ flash（可 `-i`）  
- **I 按偏差改码** → 默认仍 flash；仅超大重构 / 跨模块契约 / 用户点名 → `deepseek-v4-pro`（禁 `-i`）  
- 视觉目标：V 与 I 可并行写 brief，**验收串行**（V 结论喂 I）；同文件冲突 Track 勿并行  

通道细节强制走 `codex-dispatch`（`-m` 必写、sandbox 跟落盘、`required_permissions: ["all"]`）。

## 4. Brief / Prompt 最小结构

每个可派 Track 的 prompt 文件建议含：

```markdown
# Track <ID> · <一句话目标>
角色：<实现 | Vision QA | 契约>
权威：已定 theme token + Lab Living
必读（你自己 Read，勿假设已在上下文）：
- AGENTS.md 路由相关行
- .agents/skills/<business>/SKILL.md
- .agents/rules/<相关>.mdc（按需）
范围：只改 <路径列表>
红线：不 commit；不扩 scope；不自造文案；…
完成标准：
- build 绿 / QA md 路径 / 对照结论格式
禁止：改 .agents/rules 真相源（除非本 Track 明确是规范轨且可写）
```

Cursor **不要**把业务 skill 全文粘进 prompt；只写路径让 Codex Read。

## 5. 噪音控制清单（每次动手前扫一眼）

| 做法 | 要 / 不要 |
|---|---|
| 规划时 Grep / `ls` / 读既有 tmp plan | 要 |
| 为改一行按钮整页 Read SFC + theme | 不要（派 Codex） |
| Cursor 全文 Read `glass-ui` 再自己写组件 | 不要；prompt 里写「Read glass-ui」 |
| 开多个 Cursor 子代理改 `glass-frontend` | 不要；改开多条 Codex |
| 验收时读 QA md 结论 + 抽查 build | 要 |
| 派 Codex 后先扫 run.log 头/尾，确认非 EPERM / app-server 假成功 | 要（见 `codex-dispatch`） |
| 把 `tee` 的完整 run.log 贴进下一条用户回复上下文 | 不要；摘要 5～15 行关键点 |
| 规范变更由 Cursor 落盘 | 要（白名单） |

## 6. 验收收口（Cursor）

1. 先扫 run.log 头/尾：若 `Operation not permitted` / `failed to initialize in-process app-server` → **通道 FAIL**，带 `all` 重派；禁止凭 exit 0 当完成。  
2. 读 Track 产出路径（优先 QA md / notes；log 只扫失败与文件清单）。  
3. 对照 brief 的完成标准 → **一致 / 偏差 / 待确认**。  
4. P0/P1：写返工 prompt 再派；P2：记入待确认问用户。  
5. 向用户汇报保持短：结论 + 偏差 + 下一步；不复述整份方案。

视觉总验收可派 `prototype-qa` 给 flash（V 轨）；返工实现默认仍 flash（I 轨），pro 仅例外——或 Cursor 只做「合流已有 QA」，避免再跑完整读码。

## 7. 与其它 skill / rule

| 文件 | 职责 |
|---|---|
| **本 skill** | Cursor 怎么编排、控噪音、何时自做 |
| `.agents/rules/cursor-planner.mdc` | 常驻硬纪律（短） |
| `codex-dispatch` | 怎么调用 CLI / `-m` / sandbox / Shell `all` |
| `glass-* / docs-shell` / `prototype-qa` | Codex 执行时 Read 的业务 SOP |
| `execution-discipline` | 分步可验收；Cursor 侧「写实现」= 派发除非白名单 |

## 8. 禁止

- 默认 Cursor 实现 Glass / Lab / 壳层 / 工作台  
- 用「更快」当借口跳过派发去做中大型改码（非白名单）  
- 为编排加载与本轮 Track 无关的大文件 / 历史 transcript 全文  
- 在规范里复制第二份业务 SOP 到 Cursor 专属目录  
