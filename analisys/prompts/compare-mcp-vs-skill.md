# Reusable Prompt: Compare MCP vs Skill (ipquery.io)

Provide the **agent name** and **model name** you used. The output must be named:  
`{agent_name}-{model}-compare-mcp-vs-skill.md`

Example: `opencode-claude-sonnet-4-5-compare-mcp-vs-skill.md`

```
I used [agent name, e.g. opencode / claude-code] with [model, e.g. claude-sonnet-4-5].

You have access to an IP intelligence API via two paths:

**Path A — MCP (Model Context Protocol)**
- There is an MCP server configured that provides tools like `get_my_ip`
  (or `ipquery_get_my_ip`) and `lookup_ip` (or `ipquery_lookup_ip`).
- These tools are directly callable as functions.

**Path B — Skill / Documentation**
- There is a skill file (SKILL.md) with documentation for the ipquery.io API.
- The skill describes how to use `curl https://api.ipquery.io` and related endpoints.
- To use the skill, you must first load it with `use the skill` or equivalent,
  then manually execute a curl command.

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

5. **Generate a report file** named `{agent_name}-{model}-compare-mcp-vs-skill.md`

### Expected Output Structure

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
