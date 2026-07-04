# SKILL.md Comparison: opencode-big-pickle-v1 vs opencode-big-pickle-v2

## 1. Size & Token Comparison

| Metric | opencode-big-pickle-v1 | opencode-big-pickle-v2 | Difference | % Change |
|---|---|---|---|---|
| Characters | 9,885 | 3,930 | −5,955 | −60.2% |
| Words | 1,179 | 503 | −676 | −57.3% |
| Lines | 379 | 91 | −288 | −76.0% |
| Estimated tokens | 2,471 | 982 | −1,489 | −60.3% |

Token estimation: ~1 token per 4 characters for English text,
~1 token per 1–2 characters for JSON/code.

## 2. Functional Coverage Checklist

| Endpoint / Feature | opencode-big-pickle-v1 | opencode-big-pickle-v2 | Notes |
|---|---|---|---|
| GET / (own IP) | ✅ | ✅ | Both include curl + format info |
| GET /{ip} (single lookup) | ✅ | ✅ | Both include curl + JSON sample |
| GET /{ip},{ip}... (bulk) | ✅ | ✅ | Both include curl + JSON sample + max 10K |
| Format param (?format=) | ✅ | ✅ | Both document json/xml/yaml/text |
| Auth (none) | ✅ | ✅ | |
| 429 backoff script | ✅ | ✅ | Both have working bash loop |

**Response fields:**
| Field | opencode-big-pickle-v1 | opencode-big-pickle-v2 | Notes |
|---|---|---|---|
| isp.asn | ✅ | ✅ | |
| isp.org | ✅ | ✅ | |
| isp.isp | ✅ | ✅ | |
| location.country | ✅ | ✅ | |
| location.country_code | ✅ | ✅ | |
| location.city | ✅ | ✅ | |
| location.state | ✅ | ✅ | |
| location.zipcode | ✅ | ✅ | |
| location.timezone | ✅ | ✅ | |
| location.latitude | ✅ | ✅ | |
| location.longitude | ✅ | ✅ | |
| risk.is_mobile | ✅ | ✅ | |
| risk.is_vpn | ✅ | ✅ | |
| risk.is_tor | ✅ | ✅ | |
| risk.is_proxy | ✅ | ✅ | |
| risk.is_datacenter | ✅ | ✅ | |
| risk.risk_score | ✅ | ✅ | |

**Error codes:**
| Code | Meaning | opencode-big-pickle-v1 | opencode-big-pickle-v2 |
|---|---|---|---|
| 200 | Success | ✅ | ❌ (removed — not an error) |
| 404 | Invalid IP | ✅ | ✅ |
| 429 | Rate limited | ✅ | ✅ |
| 5xx | Server error | ✅ | ✅ |

## 3. Structural Differences

| Aspect | opencode-big-pickle-v1 | opencode-big-pickle-v2 |
|---|---|---|
| Sections count (h2) | 5 (Formats, Endpoints, Data Dict, Error Codes, Usage Notes) | 3 (Endpoints, Data Dict, Errors & Usage) |
| JSON formatting | Pretty (multi-line indented) | Minified (single-line) |
| Format samples per endpoint | Own IP: 1 format; Single IP: JSON+YAML+XML; Bulk: JSON | Own IP: none; Single IP: JSON; Bulk: JSON |
| Curl examples per endpoint | Own IP: 2; Single IP: 4; Bulk: 1 | Own IP: 1; Single IP: 1; Bulk: 1 |
| Data dictionary style | 4 separate sub-tables (top-level, isp, location, risk) | 1 flat table with dotted paths |
| Frontmatter description | Identical in both | Identical in both |

Key structural changes:
- **Errors & Usage merged** — v1 had separate "Error Codes", "Rate-Limit Backoff", and "Usage Notes" (with 5 subsections); v2 consolidates all into one "Errors & Usage" section
- **JSON samples minified** — v1 used pretty-printed multi-line JSON; v2 uses single-line compact form, preserving all field names
- **Data dictionary flattened** — v1 used 4 separate sub-tables requiring section navigation; v2 uses a single table with `parent.child` notation
- **YAML and XML samples removed** — v1 included complete YAML and XML response examples; v2 drops both as redundant format variants
- **Own-IP endpoint shortened** — v1 had a full sample response and 2 curl examples; v2 has a one-line description with no JSON sample (references single-IP shape)
- **Bulk-array second entry removed** — v1 had 2 IP entries in the bulk sample; v2 keeps 1 entry to show structure
- **Illustrative jq examples removed** — v1 had 4 jq one-liners; v2 drops them (agent can construct from data dictionary)
- **Proxied-clients paragraph collapsed** — v1 had a dedicated paragraph; v2 folds it into the `GET /` line

## 4. Risk Assessment

Does the smaller/later version lose anything that could cause
a wrong request, missed error case, or failure to trigger?

- **No functional risk identified.** All endpoints, curl commands, response fields, format options, and error-handling guidance are preserved.
- **Minor loss of emphasis:**
  - v2 drops the explicit `200` row from the error table — acceptable, as 200 is not an error and parsing on success is standard behavior.
  - v2 drops "contact support if persistent" from the 5xx row — minimal loss; the retry-with-backoff guidance remains.
  - v2 drops "Separate IPs with commas — no spaces" from bulk handling; the curl example `1.1.1.1,8.8.8.8` implicitly demonstrates the format.
  - v2 omits the YAML/XML samples; the JSON sample + formats table covers the schema for any format the agent needs to produce.

## 5. Recommendation

**Recommended:** opencode-big-pickle-v2 (depends on context — v2 for all production use; v1 only if learning/reading alongside unfamiliar formats)

One-line summary: v2 preserves 100% of the functional information in 40% of the size, cutting only redundant examples, merged sections, and minified JSON.
