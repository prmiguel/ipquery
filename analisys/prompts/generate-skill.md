# Reusable Prompt: Generate a SKILL.md (first pass, no optimization)

```
Create a SKILL.md file for consuming [API name / URL] using curl.

The API has these endpoints: [list endpoint URLs or docs sections].

Include:
- YAML frontmatter with `name` and a `description` that clearly states
  what the skill covers and when Claude should use it (trigger phrases
  the user would naturally say)
- Base URL, auth method (or "none"), and any format/query parameters
- Each endpoint with: HTTP method, a working curl example, and a
  realistic sample response (JSON/text/etc.)
- A short data dictionary for any non-obvious response fields
- Documented error codes and how to handle them (e.g. rate limits)
- A "usage notes for Claude" section with practical tips (piping through
  jq, checking status codes, fallback if a tool like curl isn't available)

Don't worry about token count or brevity yet — prioritize completeness
and correctness over size. Verify endpoint/field details by fetching the
real docs rather than guessing.
```
