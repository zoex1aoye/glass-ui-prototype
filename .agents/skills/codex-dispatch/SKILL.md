---
name: codex-dispatch
description: >
  当需要用 Codex CLI（npm @openai/codex）派发实现任务时使用。覆盖 interactive /
  headless `codex exec`、必须显式 `-m`（flash=默认+唯一 Vision；pro=例外无 Vision）、
  flash/pro 价格与双轨编排、sandbox、环境（PATH/nvm、DEEPSEEK_API_KEY）、
  Cursor Shell 无沙箱纪律与 dry-run。
  典型触发：「派 Codex」「codex exec」「-m deepseek」「headless 派发」
  「派发实现任务」。编排节奏 / 噪音控制见 cursor-planner；业务实现由 Codex
  Read 对应 glass-* / docs-shell / prototype-qa；本 skill 只负责派通道。
---

# codex-dispatch — Codex CLI 派发约定

> **默认执行面**：产品实现与视觉 QA 默认走 Codex CLI，不再默认走 mimo。  
> Cursor 是总规划师（见 `cursor-planner`）：写 brief、选模型、拉起本通道、摘要验收——**不**默认亲自改 `glass-frontend/**`。  
> mimo 仅当用户点名时使用 → `.agents/skills/mimo-dispatch/`（DEPRECATED）。

## 何时用

| 场景 | 动作 |
|---|---|
| Cursor 总规划师要把实现 / Vision QA 派给执行面 | 按 `cursor-planner` 写 brief → 读本 skill → `codex exec`（**勿**先全文载入业务 skill） |
| 本机交互开仓改代码 | `codex` TUI（见下） |
| 用户明确说「派 mimo」 | 改走 `mimo-dispatch`（非默认） |

**本 skill 不负责**：脚手架 / 布局 / 工作台 / 玻璃组件 / 验收清单的业务步骤——那些由 **Codex** 按 prompt 路径 Read `glass-* / docs-shell` / `prototype-qa`。Cursor 只在 prompt 里写必读路径。
## 环境（派发前）

1. **CLI**：npm 版 `@openai/codex`（验证时以 `codex --version` 为准）。  
   - **禁止**把 ChatGPT.app 捆绑的 `codex` 当默认（PATH 优先用 nvm/npm 全局 bin）。
2. **PATH / nvm**：非交互 shell 可能未加载 nvm；派发前确保 `which codex` 指向 npm 安装路径，或先 `source` nvm。
3. **Key**：`DEEPSEEK_API_KEY`（通常在 `~/.zshrc`）。非交互 shell **须显式 `export`**，勿写入仓库文件。
4. **登录态**：若 ChatGPT 登录与 DeepSeek provider 冲突 → `codex logout` 后再派。
5. **模型**：见下节「模型选择」——**headless 派发必须显式 `-m`**。Codex **不会**按任务内容自动选 DS 模型。

## 模型选择（必须 `-m`）

**事实**：`codex exec` 只认 (1) `~/.codex/config.toml` 的全局默认，或 (2) 调用参数里的 `-m` / `--model` / `-c model=…`。  
**不会**根据「视觉 / 结构 / Lab」等任务语义自行路由。总规划师在 Cursor 侧选的编排模型 ≠ Codex 执行模型。

**纪律**：凡本仓库 **headless 派发**（`codex exec`），**必须**在命令里写 `-m <slug>`，使日志与意图自描述；禁止依赖「碰巧等于 config 默认」而不写。

### 能力矩阵（Codex DS 档）

依据 [DeepSeek Models & Pricing](https://api-docs.deepseek.com/quick_start/pricing)、[V4.1-Flash 说明](https://api-docs.deepseek.com/news/news260910)、本机 `~/.codex/models.json`：

| 维度 | `deepseek-flash`（V4.1-Flash） | `deepseek-v4-pro`（V4-Pro） |
|---|---|---|
| Vision | **支持**（可 `-i` / 吃截图） | **不支持** |
| Codex catalog | Latest frontier … **with image input** | Most capable frontier（文案偏旧） |
| 上下文 / 输出上限 | 1M / 最大 384K（官方页） | 同左 |
| 并发上限（官方） | 2500 | 500 |
| Agentic coding（官方 HF 表，max effort） | DeepSWE **74.2** · TB2.1 **90.6** · Codeforces **3471** | DeepSWE 62.7 · TB2.1 87.9 · Codeforces 3348 |
| 纯文本硬推理（同表） | GPQA 90.9 · HLE 偏低 | GPQA **92.4** · HLE 略高 |

**选型含义**：Flash 在多数 **agentic 改码**基准上领先且独占 Vision；Pro 仅在少数纯文本硬推理项略优。禁止再写死「pro = 更强默认档」。

### 价格对比（数量级；以官方页为准）

单位：USD / 1M tokens。空闲 = 高峰一半。高峰：UTC 周一至周五 01:00–04:00 与 06:00–10:00（中国法定假日与周末整段为空闲）。仓库只缓存数量级，调价以 [pricing](https://api-docs.deepseek.com/quick_start/pricing) 为准。

| 计费项 | Flash 空闲 → 高峰 | Pro 空闲 → 高峰 | 约相对 Flash |
|---|---|---|---|
| 输入（缓存命中） | $0.003 → $0.006 | $0.022 → $0.044 | ~**7×** |
| 输入（缓存未命中） | $0.15 → $0.30 | $0.66 → $1.32 | ~**4×** |
| 输出 | $0.60 → $1.20 | $1.98 → $3.96 | ~**3×** |

Agent 工作流大量吃 cache-hit + 输出：默认 flash 可明显省费。勿为「感觉更强」无差别派 pro。

### 任务 → `-m`（默认 flash）

| 任务类型 | 推荐 `-m` | 说明 |
|---|---|---|
| **需要看图**（Lab 截图、`-i`、视觉 QA / prototype-qa） | `deepseek-flash` | **唯一** Vision；禁止派 pro「看图」 |
| 常规实现 / 视觉抛光（token 已写清、可不附图）/ Lab 接线 / rename / dry-run | `deepseek-flash` | **默认档**（能力 + 价格） |
| 纯文本硬推理例外：超大重构、跨多模块契约、用户点名「上 pro」 | `deepseek-v4-pro` | **例外档**；**禁止** `-i`；brief 须写清为何不用 flash |
| 用户点名其它 slug | 以用户为准 | catalog 以 `~/.codex/models.json` 为准 |

### 视觉目标双轨（V + I）

视觉目标（对照 Lab 截图 / Living）默认拆两段；**看图只能 flash，落地也不再默认绑 pro**：

```text
V  Vision Diff / prototype-qa   →  -m deepseek-flash（可 -i）
I  按偏差清单改码 / 接线        →  -m deepseek-flash（默认）
                                   仅例外条件满足时 → deepseek-v4-pro
合流：Cursor 把 V 的偏差清单写入 I 的 prompt；禁止指望 pro 自己看图。
```

- V / I 可并行写 brief，**验收串行**（先 V 结论再派或返工 I）。  
- 同文件冲突的 Track 勿并行。  
- 单 Track「边看边改」且需附图 → 整轨只用 flash（仍可 `-i`）。

**曾错：**  
1. 「视觉 → pro、非视觉 → flash」——与 Vision 能力相反。  
2. 「无图强推理 → 默认 pro」——V4.1-Flash 后 agentic 多数已领先，且贵 3–7×；改为 **默认 flash，pro 例外**。  

`model_provider` 仍由 config 的 `deepseek` 提供；一般不必在 CLI 再写 provider。

## Sandbox 选择

**判决句：看「要不要写工作区」，不看「是不是改产品代码」。**

| Flag | 适用 |
|---|---|
| `-s read-only` | 纯探查 / 问答 / dry-run；**完成标准不含任何工作区落盘** |
| `-s workspace-write` | 凡需写入工作区：实现、注释、Lab 文案、**以及** `.agents/tmp-*` QA / brief / refs 截图（本仓库派发默认） |
| `-s danger-full-access` | **仅**当 Codex 必须本机 `listen`（自启 vite / preview）或跑需全网的浏览器自动化，且用户知情；默认不用 |

**铁律（曾错：Vision QA 用 `read-only` → 无法落盘 QA md，空转找绕路）**：

- 产出路径在 `.agents/tmp-*` 或 `.agents/refs/*` 的 Track（含 Vision Diff、prototype-qa、方案/QA 文档）→ **必须** `-s workspace-write`。
- 「禁止改业务源码 / 只读对照」写进 **prompt 红线**，**禁止**用 `read-only` 代替。
- 规划表若写了「产出：`.agents/tmp-…`」却标 `Sandbox: read-only` → 自检失败，改 sandbox 再派。

**飞轮（曾错：`workspace-write` 下 `vite listen EPERM` → 浏览器验收空转）**：

- Codex `-s workspace-write` **不能 bind/listen**。自启 `npm run dev` / `vite preview` 常见报错：`listen EPERM: operation not permitted 127.0.0.1:5173`（与 Cursor Shell 是否 `all` 无关）。
- `approval policy never` 时 Codex **无法自行升沙箱**，会空转 `file://` / 拼静态 QA HTML / 报 CUA 无应用——浪费 token。
- **默认解法（优先）**：
  1. Cursor 先确认本机已有 dev（常见 `http://127.0.0.1:5176`），prompt 写死 URL；**禁止** Codex 自启 vite。
  2. 实现 Track 完成标准写「CSS/build 绿即可」；**浏览器截图验收由 Cursor**（IDE browser MCP / Computer Use）接力。
  3. 仅当用户明确要求 Codex 自己起服并截图 → 改 `-s danger-full-access`，且仍优先复用已有端口。
- 派发前 Cursor 可在 prompt 加一行：`DEV_URL=http://127.0.0.1:<port>/…`；若无现成服，Cursor 自己起服再派，或自己验收。

**飞轮（曾错 2 次：Codex session 将 `.agents/` 标为只读 → Spec / QA 空转）**：

- 即使 `-s workspace-write` + Cursor Shell `all`，部分 Codex session 仍可能拒写 `.agents/**`（报 `writing outside of the project` / `operation not permitted`），而 `glass-frontend/` 可写。
- **规范轨**（改 `AGENTS.md` / `.agents/rules` / `.agents/skills`）：属 Cursor 白名单，**优先 Cursor 直接落盘**（见 `cursor-planner`），勿默认派 Codex 改规范真相源。
- **`.agents/tmp-*` QA / brief**：派发前若已知 Codex 会拦，改由 Cursor 写；或让 Codex 先写 `output/qa/` / 仓库根临时稿，再由 Cursor 挪入 `.agents/`。
- 禁止为绕权限把规约正文复制到 `.cursor/skills` / `.codex/skills` 第二份。

另常带：`--skip-git-repo-check`（本仓库/非标准 git 场景避免无头卡在 repo 检查）。

## Cursor Agent Shell：必须无沙箱

凡经 Cursor `Shell` / 自动化拉起 `codex` / `codex exec`（含纯文本与 **`-i` Vision**），**必须**：

```text
required_permissions: ["all"]
```

与旧 mimo 纪律同理：Cursor 默认沙箱会挡本机配置、nvm、keychain / 家目录写入等。  
**Cursor 关沙箱（`all`）≠ 放宽 Codex 自身 `-s workspace-write` / `read-only`**——两件事，勿混。

**飞轮（曾错：缺 `all` → app-server EPERM；`tee` 仍 exit 0）**：

- 缺 `all` 时常见信号（run.log 头几行即见）：
  - `Error: failed to initialize in-process app-server client: Operation not permitted (os error 1)`
  - `could not create PATH aliases: Operation not permitted`
- **`-i` Vision 附图更易踩**（视觉 QA / prototype-qa V 轨）；普通 `codex exec` 无 `-i` 也可能 EPERM——重派一律带 `all`。
- **假成功门禁**：Shell/`tee` 可能 `exit_code: 0`，但 log 只有上述 Error、**没有** QA 结论 md / 真正 agent 产出 → **禁止**勾「Vision QA / 派发完成」。判定 **FAIL**，立即用 `required_permissions: ["all"]` 重派。
- 派发后扫 run.log **头/尾**：出现 `Operation not permitted` / `failed to initialize in-process app-server` → 同上 FAIL 重派，勿读半截当验收。
## 标准命令模板

### Headless（推荐：Cursor 派发）

```bash
export DEEPSEEK_API_KEY="${DEEPSEEK_API_KEY:?missing}"
# 若非交互 shell 无 nvm：先 source nvm 或把 npm 全局 bin 加入 PATH

# <MODEL>：按「模型选择」表填写，例如 deepseek-flash 或 deepseek-v4-pro
codex exec \
  -m <MODEL> \
  -s workspace-write \
  --skip-git-repo-check \
  "$(cat .agents/tmp-codex-<task>-prompt.txt)" \
  2>&1 | tee .agents/tmp-codex-<task>-run.log
```

仅当完成标准**确实无落盘**时，才把 `-s workspace-write` 换成 `-s read-only`。  
在 Cursor Agent 里执行上式时：**同步请求 `required_permissions: ["all"]`**（缺则易 EPERM / 假成功，见上节飞轮）。

### Headless + Vision 附图（`-i`）

带 `-i` 时 **prompt 走 stdin**（positional + `-i` 易空跑「No prompt provided via stdin」）。  
Cursor Shell：**尤其必须** `required_permissions: ["all"]`（Vision 附图对沙箱更敏感）。

```bash
# Cursor Shell: required_permissions: ["all"]  ← 硬性；勿省略
codex exec \
  -m deepseek-flash \
  -s workspace-write \
  --skip-git-repo-check \
  -i .agents/refs/<ref-a>.png \
  -i .agents/refs/<ref-b>.png \
  - < .agents/tmp-codex-<task>-prompt.txt \
  2>&1 | tee .agents/tmp-codex-<task>-run.log
```

Vision QA 若要求写出 `.agents/tmp-*-qa.md` / 截图 → Codex sandbox **必须** `workspace-write`（见上节铁律）。  
派发后扫 log：若只有 app-server / PATH aliases `Operation not permitted` → **FAIL 重派**，禁止凭 exit 0 勾完成。
### Interactive（本机 TUI）

```bash
codex -m deepseek-flash
# 例外（无图硬推理 / 用户点名）：codex -m deepseek-v4-pro（pro 无 Vision，不能 -i）
```

无 `-m` 时会落回 config 默认（当前多为 `deepseek-flash`）；**自动化派发仍禁止省略 `-m`**。

### 短 dry-run / 验收

```bash
codex --version
codex doctor   # 若 CLI 提供；无则跳过
codex exec -m deepseek-flash -s read-only --skip-git-repo-check "Reply PONG and stop. No tools."
```

期望：打印版本、短回复含 PONG、无 ChatGPT.app 捆绑路径误用、无因缺 key / 登录冲突而秒退；日志可看出实际 `-m`。

## 派发前检查

1. Cursor：读 `cursor-planner`（编排）+ **本 skill**（通道）。业务 skill / rules **写入 prompt 必读列表**，由 Codex Read——Cursor 不为实现全文预载。
2. Brief / prompt 落在 `.agents/tmp-codex-*`；实现边界、红线、验收写进 prompt；**在 brief 或派发记录里写明选用的 `-m` 与理由**（Vision / 默认 flash / pro 例外原因），以及 **`-s` 与「是否落盘」一致**。视觉目标写清 V / I 双轨或单轨 flash。
3. 确认 `export DEEPSEEK_API_KEY`；确认 `which codex` 为 npm 版。
4. 确认命令含 **`-m <slug>`**（按上表；默认 flash）。
5. 若选 `deepseek-v4-pro` → 确认无 `-i`，且 brief 有例外理由。
6. 若 prompt/计划要求写出 `.agents/tmp-*` 或 refs 截图 → 确认 **`-s workspace-write`**（禁止误用 `read-only`）。
7. 若带 `-i` → 确认 `-m deepseek-flash` 且 prompt 经 stdin（`- < prompt.txt`），非空 positional。
8. Cursor Shell：**必须** `required_permissions: ["all"]`（含无 `-i` 的 `codex exec`；`-i` Vision 更易踩）。
9. 可选 dry-run：上节短 `exec`。
10. 派发后扫 run.log 头/尾：`Operation not permitted` / `failed to initialize in-process app-server` → **FAIL，立刻带 `all` 重派**；禁止仅凭 exit 0 勾完成。无 EPERM 时再只吸收 log / QA **摘要**，禁止整份 run.log 回灌对话上下文。
## 禁止

- 默认再派 `mimo run`（除非用户点名 mimo）
- 把 ChatGPT.app 捆绑 `codex` 当默认 PATH
- 把 `DEEPSEEK_API_KEY` 写入仓库任何文件
- 在 Cursor sandbox 内派 `codex exec`（缺 `required_permissions: ["all"]`）；含 `-i` Vision
- 把「tee exit 0 + 仅有 app-server EPERM」当 Vision QA / 派发完成（假成功）- **headless 派发省略 `-m`**（禁止指望 Codex 按任务内容自选模型）
- **给 `deepseek-v4-pro` 传 `-i` / 附图**（无 Vision）
- **无例外理由默认派 pro**（贵且多数 agentic 不优于 flash）
- **有落盘产出却用 `-s read-only`**（含 Vision QA / prototype-qa 写 `.agents/tmp-*`）
- 自动 `git commit`（仍须用户点名）
- 用本 skill 替代业务 skill（只派通道，不写业务步骤）

## 与其它 skill 的关系

| Skill | 职责 |
|---|---|
| `cursor-planner` | Cursor 总规划：何时派、何时自做、控噪音、brief / Track |
| **codex-dispatch**（本文件） | 怎么派 Codex CLI（`-m` / sandbox / Shell `all`） |
| `glass-scaffold` / `docs-shell` / `glass-ui` / `prototype-qa` | Codex 执行时 Read：做什么、验收什么 |
| `mimo-dispatch` | **DEPRECATED**；仅用户点名 mimo 时 |

硬纪律摘要见 `.agents/rules/codex-dispatch.mdc`；角色白名单见 `.agents/rules/cursor-planner.mdc`。
