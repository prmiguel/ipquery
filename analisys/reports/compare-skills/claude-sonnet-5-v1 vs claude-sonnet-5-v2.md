# SKILL.md Comparison: claude-sonnet-5-v1 vs claude-sonnet-5-v2

## 1. Size & Token Comparison

| Metric | claude-sonnet-5-v1 | claude-sonnet-5-v2 | Difference | % Change |
|---|---|---|---|---|
| Characters | 5,848 | 1,825 | -4,023 | **-68.8%** |
| Words | 778 | 219 | -559 | **-71.9%** |
| Lines | 166 | 33 | -133 | **-80.1%** |
| Estimated tokens | ~1,581 | ~493 | -1,088 | **-68.8%** |

Token estimation: ~1 token per 3.7 characters (blended rate for mixed
prose + JSON/code); exact counts depend on the actual tokenizer.

## 2. Functional Coverage Checklist

| Endpoint / Field / Error Code | v1 | v2 | Notes |
|---|---|---|---|
| GET / (own IP) | ✅ | ✅ | Both document plain-text default + `?format=json` |
| GET /{ip} (single lookup) | ✅ | ✅ | Both include a full worked curl + sample JSON |
| GET /{ip},{ip}... (bulk) | ✅ | ✅ | v1 shows 2 sample entries in the array; v2 shows 1 + states it's an array of the same shape |
| Format param (?format=) | ✅ | ✅ | v1 lists json/xml/yaml/text explicitly with separate curl examples for xml/yaml; v2 states the same 4 formats in one line, no separate xml/yaml curl examples |

**Response fields:**
| Field | v1 | v2 | Notes |
|---|---|---|---|
| isp.asn | ✅ | ✅ | Present in sample JSON in both |
| isp.org | ✅ | ✅ | |
| isp.isp | ✅ | ✅ | |
| location.country | ✅ | ✅ | |
| location.country_code | ✅ | ✅ | v2 additionally explains it's ISO 3166-1 alpha-2; v1 explains this too, in its table |
| location.city | ✅ | ✅ | |
| location.state | ✅ | ✅ | |
| location.zipcode | ✅ | ✅ | |
| location.timezone | ✅ | ✅ | |
| location.latitude | ⚠️ | ✅ | Present in v1's sample JSON but **not listed in v1's Location data-dictionary table** (a v1 gap, not a v2 loss); explicit in v2's inline sample |
| location.longitude | ⚠️ | ✅ | Same as above |
| risk.is_mobile | ✅ | ✅ | |
| risk.is_vpn | ✅ | ✅ | |
| risk.is_tor | ✅ | ✅ | |
| risk.is_proxy | ✅ | ✅ | |
| risk.is_datacenter | ❌ | ❌ | Not part of either version — not an actual field of this API's response; carried over from the template and doesn't apply here |
| risk.risk_score | ✅ | ✅ | Both explain 0–100 = malicious likelihood |

**Error codes:**
| Code | Meaning | v1 | v2 |
|---|---|---|---|
| 400 | Bad request | ✅ | ✅ |
| 429 | Rate limited | ✅ | ✅ (both keep the "back off, don't silently retry" guidance) |
| 500 | Server error | ✅ | ✅ |

## 3. Structural Differences

| Aspect | v1 | v2 |
|---|---|---|
| Sections count | 7 (Endpoints w/ 3 subsections, Data Dictionary, Errors, Usage notes) | 3 (Endpoints, Errors & usage merged) |
| JSON formatting | Pretty-printed, multi-line | Minified, single-line |
| Examples per endpoint | 1–3 curl variants per endpoint (incl. xml/yaml) | 1 curl per endpoint |
| Data dictionary style | Two separate Markdown tables (Location, Risk) | Inline sentence next to the JSON sample, no table |
| Frontmatter description | Identical | Identical (unchanged from v1) |

Key structural changes:
- Endpoint sections collapsed from three `###` subsections with prose into one code block with inline `#` comments.
- Errors and "Usage notes for Claude" merged into a single "Errors & usage" section.
- Two-table data dictionary replaced by one explanatory sentence plus the self-documenting minified JSON sample.
- XML/YAML-specific curl examples removed; format options stated once in the intro line instead.
- Bulk endpoint's second sample array entry removed; array behavior stated in a comment instead of shown twice.

## 4. Risk Assessment

- **No functional loss identified for request construction or error handling.** Every endpoint, curl pattern, field name, and error code in v1 is still present in v2.
- **Minor documentation gap, present in v1 only:** v1's Location table omits `latitude`/`longitude` even though its own sample JSON includes them — v2 doesn't have this table at all, so it has no equivalent gap; both versions still show the fields in the JSON sample either way.
- **Low risk from dropped xml/yaml curl examples in v2:** if a user specifically asks for XML or YAML output, v2 requires the agent to generalize `?format=xml` from the pattern shown for JSON, rather than copying a worked example. This is a small inferential step, not a missing capability.
- **No risk to skill triggering:** frontmatter `description` is byte-for-byte identical between versions.

## 5. Recommendation

**Recommended:** claude-sonnet-5-v2

One-line summary: v2 cuts size by ~69% (chars/tokens) and ~80% (lines) with no loss of endpoints, fields, or error-handling guidance — the only trade-off is two removed xml/yaml curl examples that the agent can trivially reconstruct from the documented `?format=` pattern.