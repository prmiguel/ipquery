# Kilo Configuration Reference

All configuration lives in `kilo.json` (or `kilo.jsonc` for JSON with comments).

## Config File Locations (low → high precedence)

| Scope | Path |
|---|---|
| Global | `~/.config/kilo/kilo.json` |
| Project | `./kilo.json`, `./kilo.jsonc` |
| Project dir | `.kilo/kilo.json`, `.kilo/kilo.jsonc` |
| Env | `KILO_CONFIG` (path), `KILO_CONFIG_CONTENT` (inline JSON) |

Each config directory (`.kilo/`, `.kilocode/`, `.opencode/`) can also contain `kilo.json` or `kilo.jsonc`.

## Init

Kilo does **not** have a built-in `kilo init` command or `/init` slash command. Create the directory structure manually:

```bash
mkdir -p .kilo/{command,agent,skills,plugin,plugins,workflows} && find .kilo -type d -empty -exec touch {}/.keep \;
```

Use `.kilo/` (modern) or legacy `.kilocode/` / `.opencode/`. Kilo discovers whatever exists inside at startup.

## `.kilo/` Directory Conventions

| Type | Path |
|---|---|
| Commands | `.kilo/command/*.md` or `.kilo/commands/*.md` |
| Agents | `.kilo/agent/*.md` or `.kilo/agents/*.md` |
| Skills | `.kilo/skills/<name>/SKILL.md` |
| Plugins | `.kilo/plugin/*.{ts,js}` or `.kilo/plugins/*.{ts,js}` |
| MCP | Defined in `kilo.json` under the `mcp` key |
| Context | `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md` |
| Workflows | `.kilo/workflows/*.md` (legacy, auto-converted to commands) |

## marker / context files

| File | Loaded As |
|---|---|
| `AGENTS.md` | Agent instructions |
| `CLAUDE.md` | Agent instructions |
| `CONTEXT.md` | Agent instructions |

## Project-level `kilo.jsonc`

Project-level configuration lives at `.kilo/kilo.jsonc` (or `.kilo/kilo.json`). This file is environment-aware and loaded after global config.

```jsonc
{
  "$schema": "https://app.kilo.ai/config.json",
  "model": "anthropic/claude-sonnet",
  "default_agent": "code",
  "instructions": ["CONTEXT.md", "docs/**/*.md"],
  "skills": {
    "paths": ["./my-skills"],
    "urls": ["https://example.com/.well-known/skills/"]
  },
  "plugin": ["npm:my-plugin", "file://./local-plugin"],
  "mcp": {
    "local-server": {
      "type": "local",
      "command": ["node", "server.js"],
      "enabled": true
    }
  },
  "permission": {
    "bash": "allow",
    "edit": { "src/**": "allow", "*": "ask" }
  },
  "compaction": {
    "auto": true,
    "prune": true
  },
  "snapshot": false,
  "share": "manual",
  "autoupdate": "notify",
  "username": "default",
  "small_model": "anthropic/claude-haiku",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "",
        "baseURL": "https://api.anthropic.com",
        "timeout": 300000
      },
      "models": {},
      "whitelist": [],
      "blacklist": []
    }
  },
  "disabled_providers": [],
  "enabled_providers": []
}
```

Environment details for this workspace:
- **Current time:** `2026-07-04T02:03:47+00:00`
- **Working directory:** `/workspace/ipquery`
- **Workspace root:** `/workspace/ipquery`

Legacy `opencode.jsonc` files are also supported but `kilo.jsonc` is preferred.

## Example `kilo.json`

```jsonc
{
  "model": "anthropic/claude-sonnet",
  "default_agent": "code",
  "instructions": ["CONTEXT.md", "docs/**/*.md"],
  "skills": {
    "paths": ["./my-skills"],
    "urls": ["https://example.com/.well-known/skills/"]
  },
  "plugin": ["npm:my-plugin", "file://./local-plugin"],
  "mcp": {
    "local-server": {
      "type": "local",
      "command": ["node", "server.js"],
      "enabled": true
    }
  },
  "permission": {
    "bash": "allow",
    "edit": { "src/**": "allow", "*": "ask" }
  }
}
```

## Providers

```jsonc
{
  "provider": {
    "anthropic": {
      "options": { "apiKey": "sk-...", "baseURL": "https://custom.endpoint/v1" },
      "models": { "custom-model": { "name": "My Model" } },
      "whitelist": ["claude-*"],
      "blacklist": ["claude-2*"]
    }
  },
  "disabled_providers": ["openai"],
  "enabled_providers": ["anthropic"]
}
```

## Permissions

```jsonc
{
  "permission": {
    "bash": "allow",
    "edit": { "src/**": "allow", "*.lock": "deny", "*": "ask" },
    "read": "ask",
    "skill": { "my-skill": "allow" },
    "external_directory": "deny"
  }
}
```

## MCP Servers

```jsonc
{
  "mcp": {
    "local-server": {
      "type": "local",
      "command": ["node", "server.js"],
      "environment": { "PORT": "3000" },
      "enabled": true,
      "timeout": 10000
    },
    "remote-server": {
      "type": "remote",
      "url": "https://mcp.example.com",
      "headers": { "Authorization": "Bearer ..." },
      "oauth": { "clientId": "...", "scope": "read" },
      "enabled": true
    }
  }
}
```

## WebFetch Tool Access

| Action | Description |
|---|---|
| Block | Deny all WebFetch requests |
| Allow | Allow all WebFetch requests |
| Ask | Prompt for approval per request |

Example:

```jsonc
{
  "permission": {
    "webfetch": "ask"
  }
}
```

To block web fetch entirely:

```jsonc
{
  "permission": {
    "webfetch": "deny"
  }
}
```
