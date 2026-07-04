# Reusable Prompt: Generate an OpenAPI YAML from a SKILL.md

Use this when you already have a SKILL.md (curl-based API reference) and
want a formal OpenAPI 3.x spec generated from it — e.g. for import into
Postman/Swagger UI, contract testing, or client SDK generation.

**Source-file guidance:** prefer a SKILL.md version that states field
**types** and **descriptions** explicitly (tables, not just a bare JSON
sample) — that's what OpenAPI's `schema.properties` needs. A heavily
token-optimized SKILL.md that relies on inference from a minified JSON
blob will produce a thinner, less accurate spec.

---

```
Generate an OpenAPI 3.1 YAML spec from this SKILL.md: [path to SKILL.md]

Requirements:

- `info`: title, description, and version — derive from the skill's
  frontmatter `description` and any version marker in the file
- `servers`: use the documented base URL
- `paths`: one entry per endpoint documented in the skill (method, path
  with `{param}` placeholders, summary, description)
- For each path:
  - `parameters`: path/query params (e.g. `ip`, `format`), with type,
    required/optional, and an enum list if the doc specifies fixed
    values (e.g. format = json|xml|yaml|text)
  - `responses`: one entry per documented status/error code (e.g. 200,
    400, 429, 500), each with a description
  - For 200 responses, a full `schema` under `content.application/json`
    reflecting every field shown in the skill's sample response —
    correct type per field (string/boolean/integer/number), and a
    `description` wherever the skill documents one
- `components.schemas`: factor out the repeated response object (e.g.
  the per-IP object used by both the single-lookup and bulk endpoints)
  into a shared schema referenced via `$ref`, rather than duplicating it
- Do not invent fields, endpoints, or constraints that aren't in the
  source SKILL.md — if something is ambiguous or missing (e.g. no stated
  max length on a field), leave it out rather than guessing
- Validate the YAML is well-formed before returning it

After generating the spec, report:
- Any gaps in the source SKILL.md that forced you to omit a type,
  description, or constraint (so they can be patched at the source)
- Any assumptions you made and flagged as such in the YAML via comments
```