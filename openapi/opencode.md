# Gaps & Assumptions — `ipquery.io.openapi.yaml`

Generated from `ai/skills/ipquery-api/opencode-big-pickle-v1.md`.

---

## Gaps (source SKILL.md omissions)

| Gap | Location in SKILL.md | Impact on OpenAPI spec |
|-----|----------------------|------------------------|
| No API version marker | Nowhere in the file | `info.version` set to `0.1.0` (placeholder) |
| No error response body schemas | § Error Codes (lines 309–316) | 404, 429, and 5XX responses have `description` only — no `content` or schema |
| No constraints on the `ip` field (minLength, maxLength, pattern) | § Data Dictionary (lines 264–266) | `ip` typed as `string` with no additional validation |
| No explicit list of accepted query parameters on `GET /` | § Endpoints — "Your Own IP" (lines 30–76) | Only `format` is included, inferred from curl examples |
| No content-type negotiation documented beyond `?format=` | § Supported Formats (lines 16–26) | Only `application/json` is modelled under `content`; `text/plain` added for `GET /` |
| No description of which risk fields are omitted in XML vs JSON/YAML | § Data Dictionary — `risk` object (lines 293–305) | Note added to the `Risk` schema description; no programmatic constraint |

---

## Assumptions (flagged as YAML comments in the spec)

| Assumption | Rationale |
|------------|-----------|
| **Version `0.1.0`** | No version marker exists; `0.1.0` is a reasonable starting point. |
| **`GET /` returns two content types** | Default is `text/plain` (plain IP string), but with `?format=json` it returns the full `IPInfo` object. Both are listed under the 200 response. |
| **Bulk path mapped to `/{ips}`** | The source shows `/{ip},{ip},{ip},...` — OpenAPI doesn't support variable-length path segments in a single param name, so `/{ips}` is used with a description explaining the comma-separated convention. |
| **`format` param accepted on `GET /`** | The doc doesn't explicitly state that `GET /` accepts query parameters, but curl examples use `?format=json` with it. |
| **Error status code `5XX`** | The source says "5xx" generically; OpenAPI supports the `5XX` range key for this. |
