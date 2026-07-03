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
