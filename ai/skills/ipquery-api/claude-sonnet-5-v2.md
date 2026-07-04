---
name: ipquery-api
description: Reference for consuming the ipquery.io IP intelligence API via curl — lookup IP geolocation, ISP, and risk/VPN/proxy/Tor data for a single IP, the caller's own IP, or a bulk batch of IPs. Use when the user asks to look up, geolocate, check risk on, or get intel about an IP address (or list of IP addresses), or asks to integrate/test the ipquery API.
---
<!-- v3 — max-condensed from v2, same functional coverage -->

# ipquery.io API

No-auth IP intel API. Base URL `https://api.ipquery.io`. Format: JSON by default (`/` defaults to plain text) — override with `?format=xml|yaml|text`.

## Endpoints

```bash
curl https://api.ipquery.io                    # own IP → "203.0.113.42" (?format=json → {"ip":"..."})
curl https://api.ipquery.io/1.1.1.1             # one IP → object (see shape below)
curl https://api.ipquery.io/1.1.1.1,8.8.8.8     # bulk (≤10,000 IPs, comma-sep) → array of same objects, in order
```

Response shape (`/{ip}` and each item in bulk array):
```json
{"ip":"1.1.1.1","isp":{"asn":"AS13335","org":"Cloudflare, Inc.","isp":"Cloudflare, Inc."},"location":{"country":"Australia","country_code":"AU","city":"Sydney","state":"New South Wales","zipcode":"1001","timezone":"Australia/Sydney","latitude":-33.8688,"longitude":151.2093},"risk":{"is_mobile":false,"is_vpn":false,"is_tor":false,"is_proxy":false,"risk_score":0}}
```
`country_code` = ISO 3166-1 alpha-2. `risk_score` = 0–100 int, higher = more likely malicious.

## Errors & usage

400 bad IP/params · 429 rate-limited (back off, don't silently retry — tell the user) · 500 server error (retry, then report).

```bash
curl -s -o r.json -w "%{http_code}" https://api.ipquery.io/1.1.1.1   # check status before parsing
curl -s https://api.ipquery.io/1.1.1.1 | jq '.location, .risk'       # readable summary
```
