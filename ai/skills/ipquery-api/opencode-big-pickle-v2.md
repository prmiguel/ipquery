---
name: ipquery-io-api
description: >
  Skill for querying the ipquery.io API (https://api.ipquery.io) to retrieve
  IP geolocation, ISP, and risk intelligence. Use when the user says things
  like "get my ip", "lookup ip", "ip info", "where is this ip",
  "what is my ip address", "check ip", "ip geolocation", "ip risk score",
  "bulk ip lookup", or asks to find details about one or more IP addresses.
---

# ipquery.io API

Base URL: `https://api.ipquery.io` · Auth: `none`

| Format | Param            | Default |
|--------|------------------|---------|
| JSON   | `?format=json`   | single & bulk IP |
| XML    | `?format=xml`    | —      |
| YAML   | `?format=yaml`   | —      |
| Text   | `?format=text`   | `GET /` |

## Endpoints

### Your IP — `GET /`
```bash
curl https://api.ipquery.io
```
Returns your public IP as plain text. Append `?format=json` for the full object (same shape as single IP below). Behind a proxy/VPN, this is the egress IP.

### Single IP — `GET /{ip}`
```bash
curl https://api.ipquery.io/1.1.1.1
```
```json
{"ip":"1.1.1.1","isp":{"asn":"AS13335","org":"Cloudflare, Inc.","isp":"Cloudflare, Inc."},"location":{"country":"Australia","country_code":"AU","city":"Sydney","state":"New South Wales","zipcode":"1001","latitude":-33.85444619823676,"longitude":151.22490932413513,"timezone":"Australia/Sydney","localtime":"2026-07-04T00:07:03"},"risk":{"is_mobile":false,"is_vpn":false,"is_tor":false,"is_proxy":false,"is_datacenter":true,"risk_score":0}}
```

### Bulk — `GET /{ip},{ip},...`
```bash
curl "https://api.ipquery.io/1.1.1.1,8.8.8.8"
```
Max 10,000 IPs. Response is a JSON array — iterate with `jq -c '.[]'`.
```json
[{"ip":"1.1.1.1","isp":{"asn":"AS13335","org":"Cloudflare, Inc.","isp":"Cloudflare, Inc."},"location":{"country":"Australia","country_code":"AU","city":"Sydney","state":"New South Wales","zipcode":"1001","latitude":-33.865591362028255,"longitude":151.23197451120816,"timezone":"Australia/Sydney","localtime":"2026-07-04T00:50:51"},"risk":{"is_mobile":false,"is_vpn":false,"is_tor":false,"is_proxy":false,"is_datacenter":true,"risk_score":0}}]
```

## Data Dictionary

| Field | Type | Description |
|-------|------|-------------|
| `ip` | string | Queried IP address |
| `isp.asn` | string | AS number (e.g. `AS13335`) |
| `isp.org` | string | Organization name (may be empty) |
| `isp.isp` | string | ISP name |
| `location.country` | string | Country name |
| `location.country_code` | string | ISO 3166-1 alpha-2 code |
| `location.city` | string | City |
| `location.state` | string | State/region/province |
| `location.zipcode` | string | Postal code (may be empty) |
| `location.latitude` | number | Decimal latitude |
| `location.longitude` | number | Decimal longitude |
| `location.timezone` | string | IANA timezone ID |
| `location.localtime` | string | Local ISO 8601 datetime |
| `risk.is_mobile` | boolean | Belongs to mobile carrier |
| `risk.is_vpn` | boolean | Known VPN endpoint |
| `risk.is_tor` | boolean | Known Tor exit node |
| `risk.is_proxy` | boolean | Known public proxy |
| `risk.is_datacenter` | boolean | Hosting/datacenter IP |
| `risk.risk_score` | number | 0 (benign) – higher (risky) |

## Errors & Usage

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Parse per requested format |
| 404 | Invalid IP | Validate input (reserved/bogon/malformed) |
| 429 | Rate limit | Exponential backoff (see below) |
| 5xx | Server error | Retry with backoff |

**429 backoff** (handle even if limits seem unlimited):
```bash
for s in 1 2 4 8; do
  r=$(curl -s -o /tmp/ipq.json -w "%{http_code}" "https://api.ipquery.io/1.1.1.1")
  [ "$r" = "429" ] && sleep "$s" || break
done
```

**Status check:** `curl -s -o /dev/null -w "%{http_code}" https://api.ipquery.io/1.1.1.1`

**XML note:** The `<risk>` block only includes `is_datacenter`.

**Text format:** Returns the IP as a bare string with no other fields.
