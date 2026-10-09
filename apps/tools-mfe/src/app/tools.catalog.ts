export interface ToolDefinition {
  slug: string;
  name: string;
  summary: string;
}

/** Tools available in this remote, in navigation order. */
export const TOOLS: readonly ToolDefinition[] = [
  { slug: 'json-formatter', name: 'JSON Formatter', summary: 'Validate, pretty-print and minify JSON.' },
  { slug: 'base64', name: 'Base64', summary: 'Encode and decode UTF-8 text (standard or URL-safe).' },
  { slug: 'jwt-decoder', name: 'JWT Decoder', summary: 'Inspect header and claims. Decoding only — signatures are not verified.' },
];
