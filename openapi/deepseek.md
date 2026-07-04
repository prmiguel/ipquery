# OpenAPI 3.1 YAML Specification for ipquery.io API

```yaml
openapi: 3.1.0
info:
  title: ipquery.io IP Geolocation & Intelligence API
  description: |
    Consume the ipquery.io IP geolocation and intelligence API. Use this API to get your own public IP, retrieve full intelligence (ISP, location, risk) for a single IPv4 address, or perform bulk lookups of up to 10,000 IPs in one request.
    No API key required, HTTPS only, CORS enabled.
  version: 1.0.0
servers:
  - url: https://api.ipquery.io/
    description: Production server
paths:
  /:
    get:
      summary: Get own public IP
      description: Returns the public IPv4 address of the caller. Default response is plain text; use the `format` parameter to get JSON (which returns the same full object as a single IP lookup).
      parameters:
        - name: format
          in: query
          description: Response format. For `json`, returns a full IpInfo object; `text` returns only the IP address string. `xml` and `yaml` are supported but may vary; check official docs.
          required: false
          schema:
            type: string
            enum:
              - json
              - xml
              - yaml
              - text
            default: text
      responses:
        '200':
          description: Successful response
          content:
            text/plain:
              schema:
                type: string
                example: "94.74.110.38"
            application/json:
              schema:
                $ref: '#/components/schemas/IpInfo'
            application/xml:
              schema:
                type: string
                description: XML representation of the IpInfo object (not formally defined)
            application/yaml:
              schema:
                type: string
                description: YAML representation of the IpInfo object (not formally defined)
        '400':
          description: Bad request (e.g., invalid format value)
        '429':
          description: Rate limit exceeded – implement exponential backoff (1s, 2s, 4s...)
        '5xx':
          description: Server error – retry with backoff
  /{ip}:
    get:
      summary: Get full intelligence for a single IP
      description: Fetch geolocation, ISP, and risk intelligence for a single IPv4 address. Default response is JSON.
      parameters:
        - name: ip
          in: path
          required: true
          description: IPv4 address to query (e.g., 8.8.8.8)
          schema:
            type: string
            format: ipv4
        - name: format
          in: query
          description: Force response format; JSON is default. `text` returns plain text (if supported for this endpoint).
          required: false
          schema:
            type: string
            enum:
              - json
              - xml
              - yaml
              - text
            default: json
      responses:
        '200':
          description: Full intelligence for the requested IP
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/IpInfo'
            application/xml:
              schema:
                type: string
                description: XML representation (not formally defined)
            application/yaml:
              schema:
                type: string
                description: YAML representation (not formally defined)
            text/plain:
              schema:
                type: string
                description: Plain text representation (if supported)
        '400':
          description: Bad request – invalid IP format
        '429':
          description: Rate limit exceeded – back off
        '5xx':
          description: Server error – retry
  /{ips}:
    get:
      summary: Bulk IP lookup
      description: |
        Look up up to 10,000 IPv4 addresses in a single request. Separate IPs with commas in the path.
        Response is a JSON array of IpInfo objects in the same order as requested.
      parameters:
        - name: ips
          in: path
          required: true
          description: Comma‑separated list of IPv4 addresses (e.g., 8.8.8.8,1.1.1.1). Maximum 10,000 IPs.
          schema:
            type: string
            # pattern could be added but omitted for simplicity
        - name: format
          in: query
          description: Response format; JSON is default.
          required: false
          schema:
            type: string
            enum:
              - json
              - xml
              - yaml
              - text
            default: json
      responses:
        '200':
          description: Array of intelligence objects for each requested IP
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/IpInfo'
            application/xml:
              schema:
                type: string
                description: XML array (not formally defined)
            application/yaml:
              schema:
                type: string
                description: YAML array (not formally defined)
            text/plain:
              schema:
                type: string
                description: Text representation (may be a line‑per‑IP format; not specified)
        '400':
          description: Bad request – invalid IP format or too many IPs (>10,000)
        '429':
          description: Rate limit exceeded – back off
        '5xx':
          description: Server error – retry
components:
  schemas:
    IpInfo:
      type: object
      required:
        - ip
        - isp
        - location
        - risk
      properties:
        ip:
          type: string
          format: ipv4
          description: The queried IPv4 address
        isp:
          type: object
          properties:
            asn:
              type: string
              description: Autonomous System Number (e.g., "AS15169")
            org:
              type: string
              description: Organization name
            isp:
              type: string
              description: Internet Service Provider name
        location:
          type: object
          properties:
            country:
              type: string
              description: Full country name
            country_code:
              type: string
              description: Two‑letter ISO 3166‑1 alpha‑2 country code
            city:
              type: string
              description: City name
            state:
              type: string
              description: Region or state name
            zipcode:
              type: string
              description: Postal / ZIP code
            latitude:
              type: number
              format: float
              description: Approximate latitude
            longitude:
              type: number
              format: float
              description: Approximate longitude
            timezone:
              type: string
              description: IANA timezone identifier (e.g., "America/Los_Angeles")
            localtime:
              type: string
              format: date-time
              description: Local time in ISO 8601 format (e.g., "2026-07-04T00:11:11")
        risk:
          type: object
          properties:
            is_mobile:
              type: boolean
              description: True if the IP is associated with a mobile network
            is_vpn:
              type: boolean
              description: True if the IP is identified as a VPN
            is_tor:
              type: boolean
              description: True if the IP is identified as a Tor exit node
            is_proxy:
              type: boolean
              description: True if the IP is identified as a proxy
            is_datacenter:
              type: boolean
              description: True if the IP belongs to a datacenter / hosting provider
            risk_score:
              type: integer
              minimum: 0
              maximum: 100
              description: Risk score (0–100, higher = more suspicious)
```

---

## Gap Report & Assumptions

### Gaps in Source SKILL.md (v1)

| Missing Element | Impact |
|-----------------|--------|
| **Explicit schema for XML/YAML responses** – the skill only gives JSON examples and mentions XML/YAML as supported formats but does not define their structure. | In the spec, I added generic `string` schemas with descriptions that they are not formally defined. |
| **Plain‑text response for `/`** – the skill says default is plain text, but doesn't specify the exact format (just returns the IP). | I modelled it as a `string` with an example. |
| **Plain‑text response for single IP** – the skill mentions `?format=text` but doesn't show the output shape. | I added a `text/plain` response with a generic `string` schema, noting it's "if supported". |
| **Max length or constraints on fields** – no max length for strings like `zipcode`, `country`, etc. | I did not add any constraints; only included the documented formats (e.g., `ipv4`, `date-time` where applicable). |
| **Specific error messages** – the skill only lists status codes without error body details. | I only described the codes; no error schemas are included. |
| **Bulk endpoint limit validation** – the skill says max 10,000, but there is no way to enforce that in the path parameter via pattern. | I added a note in the description but did not impose a `maxItems` or pattern validation. |

### Assumptions Made (flagged with comments in YAML)

1. **`format` parameter values** – The skill lists `json`, `xml`, `yaml`, `text`. I included them all, assuming they are valid even though XML/YAML support is mentioned as "check official docs". I added comments in the description to indicate potential variability.
2. **Default format for `/` with JSON** – The skill shows a full `IpInfo` object when `?format=json`, so I reused the same schema for that path.
3. **Text responses** – For text, I used `text/plain` content type and a simple `string` schema; the actual format is unspecified for single IP and bulk, so I noted that.
4. **Bulk path parameter name** – I used `{ips}` because the skill uses the path directly; I left it as a simple string, assuming comma‑separated IPs.
5. **Error response bodies** – Not described; I omitted them, only listing status code descriptions.
6. **5xx – I used `'5xx'` to cover all server errors, as per the skill.

### Recommendations to Patch the Source SKILL.md

- **Document XML/YAML response structures** – if they are different from JSON, provide schemas or at least example outputs.
- **Clarify the plain‑text output for single and bulk requests** – e.g., single IP returns just the IP? Or a line with fields? Specify.
- **Add a `requestBody`** – the API only uses GET, so no body needed.
- **Specify whether the own‑IP endpoint with `?format=json` returns the full object or only `{ip}`** – the skill's example shows full, so it's consistent.
- **Provide error response examples** – even if just a generic `{"error": "..."}` to help clients parse errors.

This spec is fully derived from the v1 SKILL.md; all paths, parameters, response codes, and field names are exactly as documented.