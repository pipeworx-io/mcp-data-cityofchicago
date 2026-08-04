# @pipeworx/data-cityofchicago

[data.cityofchicago.org](https://data.cityofchicago.org) MCP — City of Chicago Socrata open-data portal. Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `datasets(query?, limit?, offset?)` — search dataset catalogue
- `query(resource_id, where?, select?, group?, order?, limit?, offset?)` — SoQL query
- `metadata(resource_id)` — resource metadata

## Data source

`https://data.cityofchicago.org/resource/<id>.json`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "data-cityofchicago": {
      "url": "https://gateway.pipeworx.io/data-cityofchicago/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Data Cityofchicago data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
