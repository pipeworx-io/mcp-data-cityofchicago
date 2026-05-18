interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * data.cityofchicago.org Socrata MCP.
 */


const BASE = 'https://data.cityofchicago.org';
const UA = 'pipeworx-mcp-data-cityofchicago/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'datasets', description: 'Search dataset catalogue.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, limit: { type: 'number' }, offset: { type: 'number' } } } },
  { name: 'query', description: 'SoQL query.', inputSchema: { type: 'object', properties: { resource_id: { type: 'string' }, where: { type: 'string' }, select: { type: 'string' }, group: { type: 'string' }, order: { type: 'string' }, limit: { type: 'number' }, offset: { type: 'number' } }, required: ['resource_id'] } },
  { name: 'metadata', description: 'Resource metadata.', inputSchema: { type: 'object', properties: { resource_id: { type: 'string' } }, required: ['resource_id'] } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'datasets': {
      const p = new URLSearchParams({
        limit: String(Math.min(100, Math.max(1, (args.limit as number) ?? 20))),
        offset: String(Math.max(0, (args.offset as number) ?? 0)),
        domains: 'data.cityofchicago.org',
      });
      if (args.query) p.set('q', String(args.query));
      const res = await fetch(`http://api.us.socrata.com/api/catalog/v1?${p}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
      if (!res.ok) throw new Error(`Socrata catalog: ${res.status}`);
      return res.json();
    }
    case 'query': {
      const id = reqStr(args, 'resource_id', '"6zsd-86xi"');
      const p = new URLSearchParams();
      for (const k of ['where', 'select', 'group', 'order'] as const) {
        if (args[k]) p.set(`$${k}`, String(args[k]));
      }
      if (args.limit != null) p.set('$limit', String(args.limit));
      if (args.offset != null) p.set('$offset', String(args.offset));
      return socrataGet(`/resource/${id}.json?${p}`);
    }
    case 'metadata':
      return socrataGet(`/api/views/${reqStr(args, 'resource_id', '"6zsd-86xi"')}.json`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function socrataGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`data.cityofchicago.org: ${res.status}`);
  return res.json();
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
