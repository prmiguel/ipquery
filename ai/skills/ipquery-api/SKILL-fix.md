---
name: ipquery-api
description: Free, no-auth IP intelligence API — geolocation, ISP, risk/VPN/proxy/Tor for one IP, own IP, or bulk batch (curl).
---

# ipquery.io API

- **Base URL:** `https://api.ipquery.io` — no API key needed
- **Rate limits:** unlimited; see Errors for 429 handling
- **Formats:** `json` (default for `/{ip}` and bulk), `xml`, `yaml`, `text` — add `?format=` to force

## Endpoints

### `GET /` — your own IP (defaults to plain text)
```bash
curl https://api.ipquery.io
curl "https://api.ipquery.io?format=json"   # → { "ip": "203.0.113.42" }
```

### `GET /{ip}` — full intel on one IP (defaults to JSON)
```bash
curl https://api.ipquery.io/1.1.1.1
```
→ `{"ip":"1.1.1.1","isp":{"asn":"AS13335",...},"location":{"country":"Australia",...,"latitude":-33.8688,"longitude":151.2093},"risk":{"is_vpn":false,"is_tor":false,"is_proxy":false,"is_mobile":false,"risk_score":0}}`

### `GET /{ip},{ip},...` — bulk lookup (max 10,000 IPs)
```bash
curl https://api.ipquery.io/1.1.1.1,8.8.8.8
```
→ JSON array of per-IP objects (same fields as single lookup).

## Data Dictionary

| Field | Type | Description |
|---|---|---|
| `isp.asn`, `.org`, `.isp` | String | ASN, org name, ISP name |
| `location.country`, `.country_code`, `.city`, `.state`, `.zipcode`, `.timezone`, `.latitude`, `.longitude` | Various | Full location data |
| `risk.is_mobile`, `.is_vpn`, `.is_tor`, `.is_proxy` | Boolean | True if associated with that category |
| `risk.risk_score` | Integer | 0–100 malicious-activity likelihood |

## Errors

| Code | Meaning |
|---|---|
| 400 | Bad request (invalid IP/params) |
| 429 | Rate limited — back off and retry |
| 500 | Server error — retry, report if persistent |

Always check the HTTP status code: `curl -s -o resp.json -w "%{http_code}" https://api.ipquery.io/999.999.999.999`
