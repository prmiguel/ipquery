# opencode Integration

This repo contains skills, agents, plugins, and other opencode-compatible definitions under the `ai/` directory.

## How opencode discovers skills

opcode loads skills from `**/SKILL.md` files inside registered skill directories. There are two ways to make a skill available:

### Option 1 — Register via `opencode.json` (current setup)

`opencode.json` at the project root registers custom paths:

```json
{
  "skills": {
    "paths": ["ai/skills"]
  }
}
```

Add new skill directories to the `paths` array as needed. This approach keeps your files in whatever location you prefer.

### Option 2 — Use the default `.opencode/` directory

Place skills inside `.opencode/skills/`, which opencode scans automatically:

```
.opencode/skills/<skill-name>/SKILL.md
```

No config file needed. This is the standard opencode convention.

## Adding a new skill

1. Create a folder under a registered skill directory (e.g. `ai/skills/my-skill/`)
2. Add a `SKILL.md` file with frontmatter:

```markdown
---
name: my-skill
description: One sentence describing what the skill does and when to trigger it.
---

# My Skill

Instructions, examples, and references.
```

3. **Quit and restart opencode** — skills are loaded at startup and are not hot-reloaded.

## Verifying a skill is loaded

After restarting, ask opencode something that should match the skill's description. If the skill description is well-written, opencode will surface it automatically when relevant.

## MCP Server — ipquery.io

An MCP server at `ai/mcp/ipquery-server/` exposes the ipquery.io API as callable tools.

**Tools:**
- `get_my_ip` — returns your public IP with ISP, location, and risk data
- `lookup_ip` — takes `ips` (one or more comma-separated IPs) and returns full intelligence

### opencode configuration

Wired in `opencode.json` under `mcpServers`:

```json
"mcpServers": {
  "ipquery": {
    "command": "node",
    "args": ["ai/mcp/ipquery-server/server.js"]
  }
}
```

### Claude Desktop configuration

Edit `claude_desktop_config.json` (Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "ipquery": {
      "command": "node",
      "args": ["/absolute/path/to/ai/mcp/ipquery-server/server.js"]
    }
  }
}
```

Config location by OS:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

### Claude Code configuration

```bash
claude mcp add ipquery -- node /absolute/path/to/ai/mcp/ipquery-server/server.js
```

Or create `.mcp.json` at project root (committable, team-shared):

```json
{
  "mcpServers": {
    "ipquery": {
      "command": "node",
      "args": ["ai/mcp/ipquery-server/server.js"]
    }
  }
}
```

Scopes: `--scope local` (default, per-project), `--scope project` (`.mcp.json`, team-shared), `--scope user` (global).

### Running the server standalone

```bash
node ai/mcp/ipquery-server/server.js
```

The server uses stdio transport (JSON-RPC), so it waits for MCP client messages on stdin.

### Claude Desktop Extension (.mcpb)

To package as a one-click installable extension, create a `manifest.json`:

```json
{
  "name": "ipquery",
  "version": "1.0.0",
  "description": "IP geolocation, ISP, and risk intelligence via ipquery.io",
  "server": {
    "type": "node",
    "entry_point": "server/index.js",
    "mcp_config": {
      "command": "node",
      "args": ["${__dirname}/server/index.js"]
    }
  }
}
```

Bundle as `.mcpb` and drag into Claude Desktop Settings → Extensions.
