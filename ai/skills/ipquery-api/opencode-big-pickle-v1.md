---
name: ipquery-io-api
description: >
  Skill for querying the ipquery.io API (https://api.ipquery.io) to retrieve
  IP geolocation, ISP, and risk intelligence. Use when the user says things
  like "get my ip", "lookup ip", "ip info", "where is this ip",
  "what is my ip address", "check ip", "ip geolocation", "ip risk score",
  "bulk ip lookup", or asks to find details about one or more IP addresses.
---

# ipquery.io API Skill

Base URL: `https://api.ipquery.io`
Authentication: `none`

## Supported Formats

| Format | Query Parameter       | Default For        |
|--------|-----------------------|--------------------|
| JSON   | `?format=json`        | Single & bulk IP   |
| XML    | `?format=xml`         | —                  |
| YAML   | `?format=yaml`        | —                  |
| Text   | `?format=text`        | Own IP (`GET /`)   |

When no `?format=` is supplied, `GET /` returns **plain text** (your IP
address only) and all other endpoints return **JSON**.

## Endpoints

### 1. Your Own IP

Returns the public IP of the requesting client.

```
GET /
```

```bash
# Plain text (default)
curl https://api.ipquery.io

# JSON
curl https://api.ipquery.io/?format=json
```

**Sample response** (with `?format=json`):

```json
{
  "ip": "190.129.101.214",
  "isp": {
    "asn": "AS6568",
    "org": "Entel S.A. - EntelNet",
    "isp": "Entel S.A. - EntelNet"
  },
  "location": {
    "country": "Bolivia",
    "country_code": "BO",
    "city": "La Paz",
    "state": "La Paz Department",
    "zipcode": "",
    "latitude": -16.508099319459284,
    "longitude": -68.13726937145857,
    "timezone": "America/La_Paz",
    "localtime": "2026-07-04T00:50:48"
  },
  "risk": {
    "is_mobile": false,
    "is_vpn": false,
    "is_tor": false,
    "is_proxy": false,
    "is_datacenter": false,
    "risk_score": 0
  }
}
```

---

### 2. Single IP Lookup

Returns full intelligence for one IP address.

```
GET /{ip}
```

```bash
# JSON (default)
curl https://api.ipquery.io/1.1.1.1

# XML
curl https://api.ipquery.io/1.1.1.1?format=xml

# YAML
curl https://api.ipquery.io/1.1.1.1?format=yaml

# Plain text (returns only the IP)
curl https://api.ipquery.io/1.1.1.1?format=text
```

**Sample response** (JSON):

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
    "latitude": -33.85444619823676,
    "longitude": 151.22490932413513,
    "timezone": "Australia/Sydney",
    "localtime": "2026-07-04T00:07:03"
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

**Sample response** (YAML):

```yaml
ip: 1.1.1.1
isp:
  asn: AS13335
  org: Cloudflare, Inc.
  isp: Cloudflare, Inc.
location:
  country: Australia
  country_code: AU
  city: Sydney
  state: New South Wales
  zipcode: "1001"
  latitude: -33.87098199554399
  longitude: 151.18350351019848
  timezone: Australia/Sydney
  localtime: 2026-07-04T00:50:51
risk:
  is_datacenter: true
```

**Sample response** (XML):

```xml
<IPInfo>
  <ip>1.1.1.1</ip>
  <isp>
    <asn>AS13335</asn>
    <org>Cloudflare, Inc.</org>
    <isp>Cloudflare, Inc.</isp>
  </isp>
  <location>
    <country>Australia</country>
    <country_code>AU</country_code>
    <city>Sydney</city>
    <state>New South Wales</state>
    <zipcode>1001</zipcode>
    <latitude>-33.8880976978354</latitude>
    <longitude>151.2068339169613</longitude>
    <timezone>Australia/Sydney</timezone>
    <localtime>2026-07-04T00:50:51</localtime>
  </location>
  <risk>
    <is_datacenter>true</is_datacenter>
  </risk>
</IPInfo>
```

---

### 3. Bulk IP Lookup

Query up to **10,000 IPs** in a single request by comma-separating them.

```
GET /{ip},{ip},{ip},...
```

```bash
curl "https://api.ipquery.io/1.1.1.1,8.8.8.8"
```

**Sample response** (JSON array):

```json
[
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
      "latitude": -33.865591362028255,
      "longitude": 151.23197451120816,
      "timezone": "Australia/Sydney",
      "localtime": "2026-07-04T00:50:51"
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
      "latitude": 37.427455261722585,
      "longitude": -122.10600345589998,
      "timezone": "America/Los_Angeles",
      "localtime": "2026-07-04T00:50:51"
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

## Data Dictionary

### Top-level

| Field | Type   | Description                        |
|-------|--------|------------------------------------|
| ip    | string | The queried IP address             |
| isp   | object | ISP / ASN information (see below)  |
| location | object | Geographic location (see below) |
| risk  | object | Risk assessment flags (see below)  |

### `isp` object

| Field | Type   | Description                                  |
|-------|--------|----------------------------------------------|
| asn   | string | Autonomous System Number (e.g. `AS13335`)    |
| org   | string | Organization name (can be empty)             |
| isp   | string | Internet Service Provider name               |

### `location` object

| Field        | Type   | Description                                    |
|--------------|--------|------------------------------------------------|
| country      | string | Country name (e.g. `Australia`)                |
| country_code | string | ISO 3166-1 alpha-2 country code (e.g. `AU`)   |
| city         | string | City name (e.g. `Sydney`)                      |
| state        | string | State / region / province name                 |
| zipcode      | string | Postal / ZIP code (may be empty)              |
| latitude     | number | Decimal latitude                                |
| longitude    | number | Decimal longitude                               |
| timezone     | string | IANA timezone identifier (e.g. `Australia/Sydney`) |
| localtime    | string | Local date-time in ISO 8601 format             |

### `risk` object

| Field         | Type    | Description                                      |
|---------------|---------|--------------------------------------------------|
| is_mobile     | boolean | Whether the IP belongs to a mobile carrier       |
| is_vpn        | boolean | Whether the IP is a known VPN endpoint           |
| is_tor        | boolean | Whether the IP is a known Tor exit node          |
| is_proxy      | boolean | Whether the IP is a known public proxy           |
| is_datacenter | boolean | Whether the IP belongs to a datacenter / hosting |
| risk_score    | number  | Overall risk score (0 = benign, higher = risky)  |

> **Note:** When requesting XML format, the `<risk>` section only includes
> `is_datacenter`; other risk fields are omitted.

---

## Error Codes

| HTTP Status | Meaning                     | Handling                                       |
|-------------|-----------------------------|------------------------------------------------|
| 200         | Success                    | Parse response per requested format             |
| 404         | Invalid / unresolvable IP  | Validate input; the IP may be reserved, bogon, or malformed |
| 429         | Rate-limit exceeded        | Implement exponential backoff (see below)      |
| 5xx         | Server error               | Retry with backoff; contact support if persistent |

### Rate-Limit Backoff

Although ipquery.io advertises unlimited rate limits, always handle 429
gracefully in scripts:

```bash
# Minimal retry loop with exponential backoff
for attempt in 1 2 4 8; do
  response=$(curl -s -o /tmp/ipq.json -w "%{http_code}" "https://api.ipquery.io/1.1.1.1")
  if [ "$response" = "429" ]; then
    sleep "$attempt"
  else
    break
  fi
done
```

---

## Usage Notes

### Piping through `jq`

```bash
# Extract ISP name
curl -s https://api.ipquery.io/1.1.1.1 | jq '.isp.isp'

# Extract coordinates
curl -s https://api.ipquery.io/1.1.1.1 | jq '{lat: .location.latitude, lon: .location.longitude}'

# Check if an IP is a VPN
curl -s https://api.ipquery.io/1.1.1.1 | jq '.risk.is_vpn'

# Pretty-print with color
curl -s https://api.ipquery.io/1.1.1.1 | jq .
```

### Checking status codes

```bash
curl -s -o /dev/null -w "%{http_code}" https://api.ipquery.io/1.1.1.1
```

### Handling bulk lookups

- Separate IPs with commas — no spaces.
- Max: **10,000 IPs** per request.
- The response is a JSON array. Use `jq -c '.[]'` to iterate:
  ```bash
  curl -s "https://api.ipquery.io/1.1.1.1,8.8.8.8" | jq -c '.[]'
  ```

### Format overrides

- Append `?format=xml`, `?format=yaml`, or `?format=text` to any endpoint.
- The `text` format returns only the IP address as a plain string.
- The `xml` format omits some risk fields (only `is_datacenter` is present).

### Proxied / containerised clients

`GET /` returns the IP of the requesting client as seen by the server.
If you are behind a reverse proxy, VPN, or container, this will be the
egress IP — not necessarily your local machine IP.
