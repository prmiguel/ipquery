# Reusable Prompt: Generate a SKILL.md (ipquery.io)

Provide the **agent name** and **model name** you used. The generated file must follow this naming convention:  
`{agent_name}-{model}-v{version}.md`

Example: `opencode-claude-sonnet-4-5-v1.md`, `claude-code-claude-sonnet-4-5-v1.md`

```
I used [agent name, e.g. opencode / claude-code] with [model, e.g. claude-sonnet-4-5].

Create a SKILL.md file for consuming https://api.ipquery.io using curl.

The API has these endpoints:
- GET / — your own IP (defaults to plain text)
- GET /{ip} — full intel on one IP (defaults to JSON)
- GET /{ip},{ip},... — bulk lookup (max 10,000 IPs)
- Formats: json, xml, yaml, text — add ?format= to force
- No API key needed
- Rate limits: unlimited (handle 429 if hit)

Include:
- YAML frontmatter with `name` and a `description` that clearly states
  what the skill covers and when the agent should use it (trigger phrases
  like "get my ip", "lookup ip", "ip info", "where is this ip")
- Base URL, auth method ("none"), and all format/query parameters
- Each endpoint with: HTTP method, a working curl example, and a
  realistic sample response (JSON)
- A short data dictionary for response fields (isp, location, risk)
- Documented error codes and how to handle them (rate limit backoff)
- A "usage notes" section with practical tips (piping through jq,
  checking status codes, handling bulk lookups)

IMPORTANT — Before writing anything, fetch the actual API documentation
from the URL https://api.ipquery.io (or the provided base URL) to get
the up-to-date:
- Available endpoints, HTTP methods, and paths
- Request/response formats and examples
- Query parameters and format options
- Response body field names and types
- Error codes, rate limits, and restrictions
- Any limitations (max bulk size, etc.)

Do NOT rely on assumptions or stale descriptions — the source of truth
is what the API returns right now.

Don't worry about token count or brevity — prioritize completeness
and correctness.

Name the file {agent_name}-{model}-v1.md
(e.g. opencode-claude-sonnet-4-5-v1.md)
```
