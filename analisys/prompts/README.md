# Prompts — SKILL.md Generation, Optimization & Comparison

Reusable prompt templates for creating, optimizing, comparing `SKILL.md` files, and benchmarking MCP vs Skill approaches.

## Available Prompts

| # | File | Purpose |
|---|---|---|
| 1 | `generate-skill.md` | First-pass SKILL.md generation from API docs — complete, not optimized. Output: `{agent}-{model}-v1.md` |
| 2 | `optimize-skill.md` | Reduce existing SKILL.md token count without losing functionality. Output: `{agent}-{model}-v2.md` |
| 3 | `compare-skills.md` | Compare two SKILL.md versions side-by-side on size, coverage, and risk. Output: `{labelA}_vs_{labelB}.md` |
| 4 | `compare-mcp-vs-skill.md` | Benchmark MCP vs Skill token consumption for the same operation. Output: `{agent}-{model}-compare-mcp-vs-skill.md` |

## Usage

Copy the contents of the relevant `.md` file and paste it as a prompt into any AI coding agent (OpenCode, Claude Code, Cursor, etc.).
