---
name: ipquery-api
description: Reference for consuming the ipquery.io IP intelligence API via curl — lookup IP geolocation, ISP, and risk/VPN/proxy/Tor data for a single IP, the caller's own IP, or a bulk batch of IPs. Use when the user asks to look up, geolocate, check risk on, or get intel about an IP address (or list of IP addresses), or asks to integrate/test the ipquery API.
---

# ipquery.io API

Free, no-auth IP intelligence API. Returns geolocation, ISP, and risk/fraud
signals (VPN, proxy, Tor, mobile, risk score) for one IP, many IPs, or the
caller's own IP.

- **Base URL:** `https://api.ipquery.io`
- **Auth:** none — no API key required
- **Rate limits:** unlimited free tier, but see [Errors](#errors) for 429 handling
- **Formats:** `json` (default for `/{ip}` and bulk), `xml`, `yaml`, `text`
  - Force a format with `?format=json|xml|yaml|text`, e.g. `/1.1.1.1?format=xml`

When to use this skill: any task involving looking up where an IP is located,
which ISP owns it, or whether it looks like a VPN/proxy/Tor/bot — for a single
address, a batch of addresses, or the caller's own public IP.

## Endpoints

### 1. `GET /` — get your own IP

Returns the caller's current public IP. Defaults to **plain text** if no
format is specified.

```bash
curl https://api.ipquery.io
```

Sample response (plain text default):
```
203.0.113.42
```

Request JSON instead:
```bash
curl "https://api.ipquery.io?format=json"
```
```json
{ "ip": "203.0.113.42" }
```

### 2. `GET /{ip}` — full intel on one IP

Returns location, ISP, and risk scoring for a specific IP address.

```bash
curl https://api.ipquery.io/1.1.1.1
```

Sample response:
```json
{
  "ip": "1.1.1.1",
  "isp": {
    "asn": "AS13335",
    "org": "Cloudflare, Inc.",
    "isp": "Cloudflare, Inc."
  },
  "location": {
    "country": "Australia",
    "country_code": "AU",
    "city": "Sydney",
    "state": "New South Wales",
    "zipcode": "1001",
    "timezone": "Australia/Sydney",
    "latitude": -33.8688,
    "longitude": 151.2093
  },
  "risk": {
    "is_mobile": false,
    "is_vpn": false,
    "is_tor": false,
    "is_proxy": false,
    "risk_score": 0
  }
}
```

Other formats:
```bash
curl "https://api.ipquery.io/1.1.1.1?format=xml"
curl "https://api.ipquery.io/1.1.1.1?format=yaml"
```

### 3. `GET /{ip},{ip},...` — bulk lookup

Comma-separate IPs to query many at once. Results are returned as a list, in
the same order as requested. **Batch limit: 10,000 IPs per request.**

```bash
curl https://api.ipquery.io/1.1.1.1,8.8.8.8
```

Sample response:
```json
[
  {
    "ip": "1.1.1.1",
    "isp": { "asn": "AS13335", "org": "Cloudflare, Inc.", "isp": "Cloudflare, Inc." },
    "location": { "country": "Australia", "country_code": "AU", "city": "Sydney", "state": "New South Wales", "zipcode": "1001", "timezone": "Australia/Sydney" },
    "risk": { "is_mobile": false, "is_vpn": false, "is_tor": false, "is_proxy": false, "risk_score": 0 }
  },
  {
    "ip": "8.8.8.8",
    "isp": { "asn": "AS15169", "org": "Google LLC", "isp": "Google LLC" },
    "location": { "country": "United States", "country_code": "US", "city": "Mountain View", "state": "California", "zipcode": "94043", "timezone": "America/Los_Angeles" },
    "risk": { "is_mobile": false, "is_vpn": false, "is_tor": false, "is_proxy": false, "risk_score": 0 }
  }
]
```

## Data Dictionary

**Location object**

| Field          | Type   | Description                                  |
|----------------|--------|-----------------------------------------------|
| `country`      | String | Full name of the country                      |
| `country_code` | String | Two-letter ISO 3166-1 alpha-2 country code    |
| `city`         | String | City name                                     |
| `state`        | String | Region or state name                          |
| `zipcode`      | String | Postal code                                   |
| `timezone`     | String | Timezone identifier                           |

**Risk object**

| Field         | Type    | Description                                            |
|---------------|---------|----------------------------------------------------------|
| `is_mobile`   | Boolean | True if associated with a cellular network                |
| `is_vpn`      | Boolean | True if belongs to a known VPN provider                   |
| `is_tor`      | Boolean | True if a known Tor exit node                              |
| `is_proxy`    | Boolean | True if a known public proxy                               |
| `risk_score`  | Integer | 0–100 score indicating likelihood of malicious activity    |

## Errors

| Code | Meaning              | Notes                                              |
|------|----------------------|-----------------------------------------------------|
| 400  | Bad Request          | Invalid IP format or query parameters                |
| 429  | Too Many Requests    | Rate limit exceeded — back off and retry later        |
| 500  | Internal Server Error| Problem on ipquery's side — retry, then report if persistent |

Always check the HTTP status code before parsing the body:

```bash
curl -s -o response.json -w "%{http_code}" https://api.ipquery.io/999.999.999.999
```

## Usage notes for Claude

- No API key or header setup needed — plain `curl <url>` works.
- Default output format differs by endpoint: `/` defaults to plain text,
  `/{ip}` and bulk default to JSON. Add `?format=` explicitly if the user
  wants a specific format or you need predictable parsing.
- For bulk lookups, batch IPs into groups of ≤10,000 per request.
- Pipe through `jq` for readable output when the user wants a summary, e.g.:
  ```bash
  curl -s https://api.ipquery.io/1.1.1.1 | jq '.location, .risk'
  ```
- If a request returns 429, mention the rate limit to the user rather than
  silently retrying in a loop.