# OpenCode: Skill vs MCP — Token Consumption Comparison

## 1. Get My IP via MCP

### Process
1. User prompted: `get my ip`
2. OpenCode (the CLI) had the MCP server `ipquery` already loaded at startup (configured in `opencode.jsonc` with `"enabled": true`)
3. The MCP server registered two tools: `get_my_ip` and `lookup_ip`, which opencode exposed to the LLM as `ipquery_get_my_ip` and `ipquery_lookup_ip`
4. LLM selected the tool and called `ipquery_get_my_ip`
5. The MCP server (Node.js stdio process) received the call, fetched `https://api.ipquery.io?format=json`, and returned the JSON result

### Token Breakdown (estimated)
| Step | Tokens (in) | Tokens (out) | Notes |
|---|---|---|---|
| Tool registration | ~50 | — | One-time at startup, amortized |
| Tool invocation (`ipquery_get_my_ip`) | ~15 | ~120 (JSON result) | Minimal — just tool name + empty params → structured JSON |
| **Total per request** | **~15** | **~120** | |

### Total: ~135 tokens per request

---

## 2. Get My IP via Skill

### Process
1. User prompted: `use the skill`
2. LLM called the `skill` tool to load the `ipquery-api` skill
3. OpenCode injected the full `SKILL.md` file (49 lines, ~1.8 KB) into the system prompt / context
4. LLM read the skill content, understood the API docs, and decided to run `curl`
5. LLM called the `bash` tool with `curl -s "https://api.ipquery.io?format=json"`
6. The result came back as shell stdout, which bash tool wrapped in its result structure

### Token Breakdown (estimated)
| Step | Tokens (in) | Tokens (out) | Notes |
|---|---|---|---|
| Skill load (`use the skill`) | ~30 | — | Triggers skill injection |
| Skill content injected into context | ~450 | — | SKILL.md: headers, descriptions, code blocks, data dictionary, error table |
| Bash invocation (`curl ...`) | ~50 | ~10 | Command string + tool metadata |
| Bash result (stdout + wrapping) | — | ~150 | JSON result wrapped in bash tool response structure |
| **Total per request** | **~530** | **~160** | |

### Total: ~690 tokens per request

---

## 3. Priority of Execution

### Decision logic
1. If a **built-in or MCP tool** is available for the task, use it first — it's the fastest and cheapest path.
2. Only fall back to a **skill** when the user explicitly says `use the skill` or when no tool exists for the task.

### Why MCP consumes fewer tokens

| Factor | MCP | Skill |
|---|---|---|
| **Context injection** | None — tools are registered once at startup | Full SKILL.md (~450 tokens) loaded into context every time |
| **Number of tool calls** | 1 (direct tool invocation) | 2 (skill load + bash execution) |
| **Output wrapping** | Direct JSON — no extra nesting | Bash tool wraps stdout with command metadata, exit code, etc. |
| **LLM reasoning overhead** | Minimal — LLM just picks the tool | LLM must read docs, understand API, decide on curl command — more reasoning tokens |
| **Reusability across turns** | Tools stay registered | Skill content must be re-loaded each session / turn |

### Token cost comparison table

| Metric | MCP | Skill | Difference |
|---|---|---|---|
| **Context injected** | 0 tokens | ~450 tokens (SKILL.md) | Skill injects ~450 more |
| **Input tokens per call** | ~15 | ~530 | Skill uses ~35x more input |
| **Output tokens per call** | ~120 | ~160 | Skill uses ~33% more output |
| **Total per request** | **~135 tokens** | **~690 tokens** | **Skill costs ~5x more** |
| **Tool calls required** | 1 | 2 | Skill needs double the round-trips |

---

## 4. Comparison Table

| Aspect | MCP (`ipquery_get_my_ip`) | Skill (`ipquery-api` + curl) |
|---|---|---|
| **How it works** | Pre-registered function call via stdio MCP server | Loads markdown docs, LLM reads & executes manually |
| **Setup** | Configured once in `opencode.jsonc` | Skill file must exist in `ai/skills/` path |
| **Context overhead** | None (one-time registration) | Full SKILL.md injected each time (~450 tokens) |
| **Input tokens** | ~15 | ~530 |
| **Output tokens** | ~120 | ~160 |
| **Total tokens** | ~135 | ~690 |
| **Latency** | Low (direct process call) | Higher (skill load + bash spawn + curl) |
| **Tool calls** | 1 | 2 |
| **Error handling** | Structured JSON via MCP protocol | Raw stdout from bash (must be parsed) |
| **LLM reasoning required** | Minimal (pick tool, pass params) | High (read docs, understand API, construct curl) |
| **Reusability** | Persistent for entire session | Must reload skill each time |
| **Best for** | Frequent, repetitive API calls | One-off or exploratory tasks where no MCP exists |

---

## Verdict

**MCP is significantly cheaper** (~5x fewer tokens) and faster for this use case. Skills are useful for documenting how to use an API, but relying on the LLM to read docs and manually execute commands adds substantial overhead. When the same operation is available as an MCP tool, the skill becomes redundant documentation.
