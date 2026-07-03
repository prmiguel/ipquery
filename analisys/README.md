# ipquery.io — Analysis Directory

This directory contains analysis and comparison documents related to the ipquery.io API integration in OpenCode.

## Content

| File | Description |
|---|---|
| `opencode-compare-skill-vs-mcp.md` | Full comparison of Skill vs MCP approaches for IP lookup in OpenCode |
| `README.md` | This file — contains the reusable prompt template for benchmarking |

---

## Skill vs MCP — Token Consumption Comparison

Use the prompt below with any AI coding agent (OpenCode, Claude Code, Cursor, etc.) to reproduce the same comparison. The agent will execute both approaches, collect metrics, and generate a report file.

### Reusable Prompt Template

Copy and paste the following prompt into your AI coding agent:

<pre>
You have access to an IP intelligence API via two paths:

**Path A — MCP (Model Context Protocol)**
- There is an MCP server configured that provides tools like `get_my_ip` (or `ipquery_get_my_ip`) and `lookup_ip` (or `ipquery_lookup_ip`).
- These tools are directly callable as functions.

**Path B — Skill / Documentation**
- There is a skill file (SKILL.md) with documentation for the ipquery.io API.
- The skill describes how to use `curl https://api.ipquery.io` and related endpoints.
- To use the skill, you must first load it with `use the skill` or equivalent, then manually execute a curl command.

### Your Task

1. **Call `get_my_ip` via the MCP tool.**  
   Note: tool name, input parameters, output JSON.

2. **Call `get_my_ip` via the skill.**  
   Load the skill first, read the docs, then run `curl` manually.

3. **For each approach, document:**
   - Number of tool/function calls made
   - Approximate input tokens (prompt/context)
   - Approximate output tokens (response)
   - Any context injected (e.g. skill file content)
   - Latency / number of round-trips
   - How error handling works
   - How reusable the approach is across conversation turns

4. **Explain which consumes more tokens and why.**

5. **Generate a report file** named `{agent-name}-compare-skill-vs-mcp.md`  
   (e.g. `opencode-compare-skill-vs-mcp.md`, `claude-code-compare-skill-vs-mcp.md`)  
   The report should contain:
   - Full process for each path
   - Token breakdown table
   - Priority of execution explanation
   - Comparison table
   - Verdict

### Expected Structure of the Report

```markdown
# {Agent Name}: Skill vs MCP — Token Consumption Comparison

## 1. Get My IP via MCP

### Process
...

### Token Breakdown (estimated)
| Step | Tokens (in) | Tokens (out) | Notes |
|---|---|---|---|

## 2. Get My IP via Skill

### Process
...

### Token Breakdown (estimated)
| Step | Tokens (in) | Tokens (out) | Notes |
|---|---|---|---|

## 3. Priority of Execution

...

## 4. Comparison Table

| Aspect | MCP | Skill |
|---|---|---|

## Verdict

...
```
</pre>

### Usage Example

```bash
# After running the prompt in OpenCode:
ls analisys/
# → opencode-compare-skill-vs-mcp.md

# After running the same prompt in Claude Code:
ls analisys/
# → claude-code-compare-skill-vs-mcp.md
```

This lets you compare token efficiency across different AI coding agents.
