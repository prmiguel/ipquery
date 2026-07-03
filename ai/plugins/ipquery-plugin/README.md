# ipquery-api plugin

Bundles a single skill that teaches Claude Code how to call the
[ipquery.io](https://ipquery.io) IP intelligence API using `curl` — no API
key required.

## What's inside

- `skills/ipquery-api/SKILL.md` — endpoints, curl examples, sample
  responses, data dictionary, and error codes for `api.ipquery.io`.

## Install (local development)

```bash
# from the parent directory of ipquery-plugin/
claude --plugin-dir ./ipquery-plugin
```

## Install (from a marketplace, once published)

```bash
/plugin marketplace add <your-org>/ipquery-plugin
/plugin install ipquery-api@ipquery-plugin
```

## Usage

Once installed, just ask naturally:

> "What's the risk score on 1.1.1.1?"
> "Geolocate 8.8.8.8 and 1.1.1.1"

Claude Code matches the request against the skill's description and loads
`SKILL.md` automatically. You can also see it listed under `/skills` after
installing.
