# Reusable Prompt: Compare two SKILL.md versions (ipquery.io)

Provide the **two file paths** to compare. They can be different versions from the same agent/model (e.g. v1 vs v2) or from different agents/models entirely (e.g. opencode v2 vs claude-code v2).  

The output must be named:  
`{fileA-label}_vs_{fileB-label}.md`  

Example: `opencode-claude-sonnet-4-5-v1_vs_opencode-claude-sonnet-4-5-v2.md`  
or `opencode-claude-sonnet-4-5-v2_vs_claude-code-claude-sonnet-4-5-v2.md`

```
I used [agent name] with [model] for file A, and [agent name] with [model] for file B.

Take these two SKILL.md files and produce a detailed comparison:

- File A: [path to first SKILL.md]
- File B: [path to second SKILL.md]

Generate a markdown report using the template below exactly
and save it as {fileA-label}_vs_{fileB-label}.md.

---

## Comparison Template

```markdown
# SKILL.md Comparison: {label A} vs {label B}

## 1. Size & Token Comparison

| Metric | {label A} | {label B} | Difference | % Change |
|---|---|---|---|---|
| Characters | | | | |
| Words | | | | |
| Lines | | | | |
| Estimated tokens | | | | |

Token estimation: ~1 token per 4 characters for English text,
~1 token per 1–2 characters for JSON/code.

## 2. Functional Coverage Checklist

| Endpoint / Field / Error Code | {label A} | {label B} | Notes |
|---|---|---|---|
| GET / (own IP) | ✅ / ❌ | ✅ / ❌ | |
| GET /{ip} (single lookup) | ✅ / ❌ | ✅ / ❌ | |
| GET /{ip},{ip}... (bulk) | ✅ / ❌ | ✅ / ❌ | |
| Format param (?format=) | ✅ / ❌ | ✅ / ❌ | |
| ... | ✅ / ❌ | ✅ / ❌ | |

**Response fields:**
| Field | {label A} | {label B} | Notes |
|---|---|---|---|
| isp.asn | ✅ / ❌ | ✅ / ❌ | |
| isp.org | ✅ / ❌ | ✅ / ❌ | |
| isp.isp | ✅ / ❌ | ✅ / ❌ | |
| location.country | ✅ / ❌ | ✅ / ❌ | |
| location.country_code | ✅ / ❌ | ✅ / ❌ | |
| location.city | ✅ / ❌ | ✅ / ❌ | |
| location.state | ✅ / ❌ | ✅ / ❌ | |
| location.zipcode | ✅ / ❌ | ✅ / ❌ | |
| location.timezone | ✅ / ❌ | ✅ / ❌ | |
| location.latitude | ✅ / ❌ | ✅ / ❌ | |
| location.longitude | ✅ / ❌ | ✅ / ❌ | |
| risk.is_mobile | ✅ / ❌ | ✅ / ❌ | |
| risk.is_vpn | ✅ / ❌ | ✅ / ❌ | |
| risk.is_tor | ✅ / ❌ | ✅ / ❌ | |
| risk.is_proxy | ✅ / ❌ | ✅ / ❌ | |
| risk.is_datacenter | ✅ / ❌ | ✅ / ❌ | |
| risk.risk_score | ✅ / ❌ | ✅ / ❌ | |

**Error codes:**
| Code | Meaning | {label A} | {label B} |
|---|---|---|---|
| 400 | Bad request | ✅ / ❌ | ✅ / ❌ |
| 429 | Rate limited | ✅ / ❌ | ✅ / ❌ |
| 500 | Server error | ✅ / ❌ | ✅ / ❌ |

## 3. Structural Differences

| Aspect | {label A} | {label B} |
|---|---|---|
| Sections count | | |
| JSON formatting | Pretty / Minified | Pretty / Minified |
| Examples per endpoint | | |
| Data dictionary style | Table / Prose / Both | Table / Prose / Both |
| Frontmatter description | | |

Key structural changes (if any):
- [e.g. "Errors and Usage notes were merged into one section"]
- [e.g. "JSON samples were minified"]
- [e.g. "Data dictionary was converted from prose to table"]

## 4. Risk Assessment

Does the smaller/later version lose anything that could cause
a wrong request, missed error case, or failure to trigger?

- [No risk identified / Risk: ...]
- [e.g. "v2 removes the 429 retry guidance — agent may not back off"]

## 5. Recommendation

**Recommended:** {label A} / {label B} / depends on context

One-line summary: ...
```

---

Generate the report and save it as described.

---

## Real-World Example: v1 → v2 Optimization (opencode/big-pickle)

### Size & Reduction

| Metric | v1 | v2 | Reduction |
|--------|----|----|-----------|
| Characters | 9,885 | 3,930 | **60.2%** |
| Estimated tokens (~4 chars/token) | 2,471 | 982 | **60.3%** |
| Lines | 379 | 91 | **76.0%** |

### What Was Cut, Merged, or Reformatted

- **Endpoints section restructured** — collapsed `### 1.`, `### 2.`, `### 3.` into flat `###` entries with inline descriptions.
- **Own-IP JSON sample removed** — same shape as single IP; a one-liner note points to `?format=json`.
- **YAML and XML samples removed** — non-essential format variants; JSON sample shows all fields.
- **Extra curl examples cut** — only one curl per endpoint kept; `?format=` documented in formats table.
- **JSON samples minified** — collapsed to single-line, preserving every field name and value.
- **Second bulk-array entry removed** — one entry shows structure; `[ ]` shows it's an array.
- **Data dictionary merged** — four sub-tables consolidated into one flat table with dotted paths (`isp.asn`).
- **Format-table prose removed** — "Default" column in the table captures it.
- **Errors & Usage merged** — error codes, backoff loop, status check, XML/text notes in one section.
- **Illustrative `jq` examples cut** — data dictionary + agent's `jq` knowledge is sufficient.
- **Proxied-clients paragraph collapsed** — to one sentence appended to `GET /`.
- **Bulk-handling bullet list merged** — inline in the bulk endpoint section.
- **Format-overrides list cut** — redundant with formats table.

### What Was Deliberately NOT Reduced Further

- **Frontmatter `description`** — untouched to preserve triggering behavior.
- **All response field names in JSON** — every key (`is_mobile`, `is_vpn`, `is_tor`, etc.) present for schema learning.
- **429 backoff shell loop** — prevents silent retry without backoff.
- **Full data dictionary** — every field from `isp`, `location`, `risk`, and top-level `ip` listed with type and description.
```
