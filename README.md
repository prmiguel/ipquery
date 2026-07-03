# ipquery

## AI Directory Structure

| Directory | Purpose |
|---|---|
| `providers/` | AI provider integrations (OpenAI, Anthropic, etc.) |
| `agents/` | Agent definitions, configurations, and orchestration |
| `skills/` | Reusable capabilities that agents can be given |
| `plugins/` | Extendable modules that hook into the system |
| `rules/` | Constraints, guidelines, and safety policies for AI behavior |
| `tools/` | Tools/functions the AI can invoke (e.g. web search, calculator) |
| `memory/` | Persistence and conversation history storage |
| `config/` | System-wide and per-agent configuration |
| `core/` | Abstract base classes and interfaces (Provider, Agent, Tool, etc.) |
| `examples/` | Example implementations and usage patterns |
| `templates/` | Scaffolding templates for new agents/skills/plugins |