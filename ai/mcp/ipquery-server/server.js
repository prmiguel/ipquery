import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = "https://api.ipquery.io";

const server = new Server(
  { name: "ipquery-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_my_ip",
      description: "Get the public IP address of the current machine",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    {
      name: "lookup_ip",
      description: "Get full geolocation, ISP, and risk intelligence for one or more IP addresses",
      inputSchema: {
        type: "object",
        properties: {
          ips: {
            type: "string",
            description: "One or more comma-separated IPv4 addresses (e.g., '1.1.1.1' or '1.1.1.1,8.8.8.8')",
          },
        },
        required: ["ips"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_my_ip": {
      const res = await fetch(`${API_BASE}?format=json`);
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    case "lookup_ip": {
      const ips = String(args?.ips ?? "");
      if (!ips) {
        return {
          isError: true,
          content: [{ type: "text", text: "Error: 'ips' parameter is required" }],
        };
      }
      const res = await fetch(`${API_BASE}/${encodeURIComponent(ips)}`);
      if (!res.ok) {
        return {
          isError: true,
          content: [{ type: "text", text: `API error (${res.status}): ${res.statusText}` }],
        };
      }
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }

    default:
      return {
        isError: true,
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
      };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
