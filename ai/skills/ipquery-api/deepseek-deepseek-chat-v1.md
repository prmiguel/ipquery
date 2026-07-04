# SKILL.md: ipquery.io API Integration

## YAML Frontmatter

```yaml
---
name: ipquery-api
description: |
  Consume the ipquery.io IP geolocation and intelligence API. Use this skill when the user asks to:
  - "get my ip" / "what's my ip" / "my public ip"
  - "lookup ip" / "ip info" / "ip geolocation"
  - "where is this ip" / "ip location"
  - "check ip risk" / "is this ip a VPN/proxy"
  - "bulk ip lookup" / "lookup multiple ips"
  Triggers on any IP address mention with intent to query its location, ISP, or risk data.
---
```

---

## Overview

**Base URL:** `https://api.ipquery.io`

**Authentication:** None — no API key required.

**Protocol:** HTTPS only.

**Rate Limits:** Unlimited for most use cases. If a `429 Too Many Requests` response is received, implement exponential backoff (see [Error Handling](#error-handling)).

**CORS:** Enabled — can be called directly from browser JavaScript.

---

## Endpoints

### 1. Get Your Own Public IP

Retrieve the public IPv4 address of the caller.

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Path** | `/` |
| **Default Response Format** | Plain text |

**Examples:**

```bash
# Plain text (default)
curl https://api.ipquery.io/
# → 94.74.110.38

# JSON format
curl https://api.ipquery.io/?format=json
```

**Sample JSON Response:**

```json
{
  "ip": "159.138.146.221",
  "isp": {
    "asn": "AS136907",
    "org": "HUAWEI INTERNATIONAL PTE. LTD.",
    "isp": "Huawei International Pte. Ltd."
  },
  "location": {
    "country": "Hong Kong",
    "country_code": "HK",
    "city": "Hong Kong",
    "state": "Kowloon",
    "zipcode": "999077",
    "latitude": 22.331718928065982,
    "longitude": 114.1435911763317,
    "timezone": "Asia/Hong_Kong",
    "localtime": "2026-07-04T01:07:43"
  },
  "risk": {
    "is_mobile": false,
    "is_vpn": false,
    "is_tor": false,
    "is_proxy": false,
    "is_datacenter": true,
    "risk_score": 0
  }
}
```


---

### 2. Get Full Intelligence for a Specific IP

Fetch geolocation, ISP, and risk intelligence for a single IPv4 address.

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Path** | `/{ip}` |
| **Default Response Format** | JSON |

**Examples:**

```bash
# JSON (default)
curl https://api.ipquery.io/8.8.8.8

# Force plain text (if supported)
curl https://api.ipquery.io/8.8.8.8?format=text
```

**Sample JSON Response:**

```json
{
  "ip": "8.8.8.8",
  "isp": {
    "asn": "AS15169",
    "org": "Google LLC",
    "isp": "Google LLC"
  },
  "location": {
    "country": "United States",
    "country_code": "US",
    "city": "Mountain View",
    "state": "California",
    "zipcode": "94043",
    "latitude": 37.43813510612699,
    "longitude": -122.07495961176456,
    "timezone": "America/Los_Angeles",
    "localtime": "2026-07-04T00:11:11"
  },
  "risk": {
    "is_mobile": false,
    "is_vpn": false,
    "is_tor": false,
    "is_proxy": false,
    "is_datacenter": true,
    "risk_score": 0
  }
}
```


---

### 3. Bulk IP Lookup

Query up to **10,000** IP addresses in a single request. Separate IPs with commas in the path.

| Property | Value |
|----------|-------|
| **Method** | `GET` |
| **Path** | `/{ip1},{ip2},{ip3},...` |
| **Max IPs** | 10,000 |
| **Default Response Format** | JSON (array) |

**Example:**

```bash
curl https://api.ipquery.io/8.8.8.8,1.1.1.1
```

**Sample JSON Response:**

```json
[
  {
    "ip": "8.8.8.8",
    "isp": {
      "asn": "AS15169",
      "org": "Google LLC",
      "isp": "Google LLC"
    },
    "location": {
      "country": "United States",
      "country_code": "US",
      "city": "Mountain View",
      "state": "California",
      "zipcode": "94043",
      "latitude": 37.43701025449052,
      "longitude": -122.09074664020189,
      "timezone": "America/Los_Angeles",
      "localtime": "2026-07-04T00:08:50"
    },
    "risk": {
      "is_mobile": false,
      "is_vpn": false,
      "is_tor": false,
      "is_proxy": false,
      "is_datacenter": true,
      "risk_score": 0
    }
  },
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
      "latitude": -33.87872671242968,
      "longitude": 151.23211970799844,
      "timezone": "Australia/Sydney",
      "localtime": "2026-07-04T00:08:50"
    },
    "risk": {
      "is_mobile": false,
      "is_vpn": false,
      "is_tor": false,
      "is_proxy": false,
      "is_datacenter": true,
      "risk_score": 0
    }
  }
]
```


---

## Response Format Options

Use the `?format=` query parameter to control the response format. Supported values:

| Format | Parameter | Notes |
|--------|-----------|-------|
| JSON | `?format=json` | Default for IP info endpoints |
| Plain text | `?format=text` | Default for `/` (own IP) |
| XML | `?format=xml` | Check official docs for support |
| YAML | `?format=yaml` | Check official docs for support |

**Example:**

```bash
# Force JSON for own IP
curl https://api.ipquery.io/?format=json

# Force text for specific IP
curl https://api.ipquery.io/8.8.8.8?format=text
```

---

## Data Dictionary

### Root Object

| Field | Type | Description |
|-------|------|-------------|
| `ip` | `string` | The queried IPv4 address |

### `isp` Object

| Field | Type | Description |
|-------|------|-------------|
| `asn` | `string` | Autonomous System Number (e.g., "AS15169") |
| `org` | `string` | Organization name |
| `isp` | `string` | Internet Service Provider name |

### `location` Object

| Field | Type | Description |
|-------|------|-------------|
| `country` | `string` | Full country name |
| `country_code` | `string` | Two-letter ISO 3166-1 alpha-2 country code |
| `city` | `string` | City name |
| `state` | `string` | Region or state name |
| `zipcode` | `string` | Postal / ZIP code |
| `latitude` | `float` | Approximate latitude |
| `longitude` | `float` | Approximate longitude |
| `timezone` | `string` | IANA timezone identifier (e.g., "America/Los_Angeles") |
| `localtime` | `string` | Local time in ISO 8601 format |

### `risk` Object

| Field | Type | Description |
|-------|------|-------------|
| `is_mobile` | `boolean` | `true` if the IP is associated with a mobile network |
| `is_vpn` | `boolean` | `true` if the IP is identified as a VPN |
| `is_tor` | `boolean` | `true` if the IP is identified as a Tor exit node |
| `is_proxy` | `boolean` | `true` if the IP is identified as a proxy |
| `is_datacenter` | `boolean` | `true` if the IP belongs to a datacenter / hosting provider |
| `risk_score` | `integer` | 0–100 risk score (higher = more suspicious) |



---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Handling |
|------|---------|----------|
| `200` | Success | Parse response as usual |
| `400` | Bad Request | Invalid IP format or malformed request — validate input |
| `429` | Too Many Requests | Rate limit exceeded — implement exponential backoff |
| `5xx` | Server Error | Retry with exponential backoff |

### Rate Limit Backoff Strategy

If you receive a `429` response:

1. Wait **1 second**
2. Retry the request
3. If `429` repeats, double the wait time (2s, 4s, 8s...)
4. Continue until success or max retries exceeded

```bash
# Example retry loop in bash
for i in {1..5}; do
  response=$(curl -s -w "%{http_code}" https://api.ipquery.io/8.8.8.8)
  http_code=${response: -3}
  if [ "$http_code" -eq 429 ]; then
    sleep $((2 ** i))
  else
    echo "${response%???}"
    break
  fi
done
```

---

## Usage Notes

### 1. Parsing JSON with `jq`

```bash
# Get only the country
curl -s https://api.ipquery.io/8.8.8.8 | jq '.location.country'
# → "United States"

# Check if IP is a VPN
curl -s https://api.ipquery.io/8.8.8.8 | jq '.risk.is_vpn'
# → false

# Extract ASN and ISP
curl -s https://api.ipquery.io/8.8.8.8 | jq '{asn: .isp.asn, isp: .isp.isp}'
```

### 2. Checking Status Codes

Always check the HTTP status code before parsing:

```bash
response=$(curl -s -w "\n%{http_code}" https://api.ipquery.io/8.8.8.8)
body=$(echo "$response" | head -n -1)
status=$(echo "$response" | tail -n 1)

if [ "$status" -eq 200 ]; then
  echo "$body" | jq .
else
  echo "Error: HTTP $status" >&2
fi
```

### 3. Bulk Lookup Performance

- Maximum **10,000 IPs** per request — split larger lists into multiple requests
- Response time scales with number of IPs — consider parallel requests for very large lists
- All IPs in a bulk request return in the same order they were requested

### 4. Format Support

- JSON is the most reliable and feature-complete format
- Plain text is useful for quick scripts (e.g., `myip=$(curl -s https://api.ipquery.io/)`)
- XML and YAML support may vary — test before relying on them in production

### 5. Privacy & Security

- No authentication means requests are anonymous
- All traffic is over HTTPS — no plaintext transmission
- Risk scores are estimates — use as one signal among many for security decisions

---

## File Naming Convention

This file follows the required naming convention:

```
deepseek-deepseek-chat-v1.md
```

**Agent:** deepseek  
**Model:** deepseek-chat  
**Version:** 1