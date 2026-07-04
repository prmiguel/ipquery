# Reusable Prompt: Reduce / optimize an existing SKILL.md

```
Take this SKILL.md and reduce its size/token count as much as possible
without changing what it can accomplish — same curl commands, same
response fields, same error handling, same triggering behavior.

Specifically:
- Do not touch the frontmatter `description` — that's what makes the
  skill trigger correctly and must stay intact
- Remove restated/duplicate information (e.g. a field explained in prose
  AND in a table; a fact mentioned in the intro AND repeated later)
- Merge sections that serve the same purpose (e.g. separate "Errors" and
  "Usage notes" into one) if it doesn't reduce clarity
- Minify sample JSON (strip whitespace/indentation) rather than deleting
  fields — every field name must remain present and correct, since
  that's what lets Claude construct correct filters/queries later
- Cut illustrative-but-non-essential examples (e.g. redundant format
  variants, a second sample of an already-demonstrated response shape)
- Keep anything that prevents bad behavior (e.g. "don't silently retry
  on 429") — don't sacrifice correctness/safety guidance for size

After producing the reduced version, report:
- Before/after size in characters and estimated tokens, with % reduction
- A bullet list of exactly what was cut, merged, or reformatted, and why
  each cut doesn't lose functional information
- What you deliberately did NOT reduce further, and why
```
