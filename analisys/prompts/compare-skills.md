# Reusable Prompt: Compare two SKILL.md versions

```
Compare [SKILL.md version A] and [SKILL.md version B]. Produce:

1. A size/token comparison table: characters, words, lines, and
   estimated token count for each version, plus % difference
2. A checklist confirming both versions cover the same functional
   surface — list every endpoint, field, and error code and confirm
   presence in both (flag anything present in one but not the other)
3. A short list of the structural differences (sections merged, JSON
   minified, examples trimmed, etc.) — not just the size delta, but
   *how* the size was achieved
4. Any risk assessment: does the smaller version lose anything that
   could cause Claude to construct a wrong request, miss an error case,
   or fail to trigger the skill when it should
5. A one-line recommendation on which version to actually use going
   forward
```
