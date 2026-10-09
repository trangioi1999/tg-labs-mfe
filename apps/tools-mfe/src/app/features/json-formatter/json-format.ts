/** Pure JSON formatting logic, independent of Angular. */

export type JsonIndent = 2 | 4 | 'tab';

export interface JsonErrorLocation {
  line: number;
  column: number;
}

export type JsonResult =
  | { ok: true; output: string; value: unknown }
  | { ok: false; message: string; location?: JsonErrorLocation };

/** Converts a zero-based character offset into a 1-based line/column. */
export function locate(input: string, position: number): JsonErrorLocation {
  const before = input.slice(0, Math.max(0, position));
  const lines = before.split('\n');
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

/**
 * Extracts an error location from engine-specific `JSON.parse` messages:
 * V8 ("... at position 12 (line 2 column 5)") and SpiderMonkey
 * ("... at line 2 column 5 of the JSON data").
 */
export function errorLocation(input: string, message: string): JsonErrorLocation | undefined {
  const lineColumn = /line (\d+) column (\d+)/i.exec(message);
  if (lineColumn) {
    return { line: Number(lineColumn[1]), column: Number(lineColumn[2]) };
  }
  const position = /position (\d+)/i.exec(message);
  if (position) {
    return locate(input, Number(position[1]));
  }
  if (/unexpected end/i.test(message)) {
    return locate(input, input.length);
  }
  return undefined;
}

class SyntaxFailure {
  constructor(readonly offset: number) {}
}

const NUMBER = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;

/**
 * Returns the offset of the first JSON syntax error, or `undefined` when the
 * input is valid. `JSON.parse` error messages differ between engines and do
 * not always include a position, so we locate errors ourselves.
 */
export function findSyntaxErrorOffset(text: string): number | undefined {
  let i = 0;
  const fail = (): never => {
    throw new SyntaxFailure(i);
  };
  const whitespace = () => {
    while (i < text.length && ' \t\n\r'.includes(text[i])) i++;
  };
  const string = () => {
    i++; // opening quote
    while (i < text.length) {
      const char = text[i];
      if (char === '"') {
        i++;
        return;
      }
      if (char === '\\') {
        const escape = text[i + 1];
        if (escape === 'u') {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) {
            i++;
            fail();
          }
          i += 6;
          continue;
        }
        if (escape === undefined || !'"\\/bfnrt'.includes(escape)) {
          i++;
          fail();
        }
        i += 2;
        continue;
      }
      if (char < ' ') fail();
      i++;
    }
    fail();
  };
  const value = (): void => {
    whitespace();
    const char = text[i];
    if (char === '{') {
      i++;
      whitespace();
      if (text[i] === '}') {
        i++;
        return;
      }
      for (;;) {
        whitespace();
        if (text[i] !== '"') fail();
        string();
        whitespace();
        if (text[i] !== ':') fail();
        i++;
        value();
        whitespace();
        if (text[i] === ',') {
          i++;
          continue;
        }
        if (text[i] === '}') {
          i++;
          return;
        }
        fail();
      }
    }
    if (char === '[') {
      i++;
      whitespace();
      if (text[i] === ']') {
        i++;
        return;
      }
      for (;;) {
        value();
        whitespace();
        if (text[i] === ',') {
          i++;
          continue;
        }
        if (text[i] === ']') {
          i++;
          return;
        }
        fail();
      }
    }
    if (char === '"') {
      string();
      return;
    }
    if (char === '-' || (char >= '0' && char <= '9')) {
      NUMBER.lastIndex = i;
      const match = NUMBER.exec(text);
      if (!match) fail();
      i += match ? match[0].length : 0;
      return;
    }
    for (const literal of ['true', 'false', 'null']) {
      if (text.startsWith(literal, i)) {
        i += literal.length;
        return;
      }
    }
    fail();
  };

  try {
    value();
    whitespace();
    if (i < text.length) fail();
    return undefined;
  } catch (error: unknown) {
    if (error instanceof SyntaxFailure) {
      return error.offset;
    }
    // e.g. RangeError for pathologically deep nesting: no location available.
    return undefined;
  }
}

function parse(input: string): { ok: true; value: unknown } | Extract<JsonResult, { ok: false }> {
  if (!input.trim()) {
    return { ok: false, message: 'Input is empty. Paste some JSON to get started.' };
  }
  try {
    return { ok: true, value: JSON.parse(input) as unknown };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const offset = findSyntaxErrorOffset(input);
    return {
      ok: false,
      message,
      location: offset === undefined ? errorLocation(input, message) : locate(input, offset),
    };
  }
}

/** Validates and pretty-prints JSON with the given indentation. */
export function formatJson(input: string, indent: JsonIndent = 2): JsonResult {
  const parsed = parse(input);
  if (!parsed.ok) {
    return parsed;
  }
  const space = indent === 'tab' ? '\t' : indent;
  return { ok: true, value: parsed.value, output: JSON.stringify(parsed.value, null, space) };
}

/** Validates and minifies JSON. */
export function minifyJson(input: string): JsonResult {
  const parsed = parse(input);
  if (!parsed.ok) {
    return parsed;
  }
  return { ok: true, value: parsed.value, output: JSON.stringify(parsed.value) };
}

/** Short structural description, e.g. "object · 3 keys" or "array · 10 items". */
export function describeJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `array · ${value.length} ${value.length === 1 ? 'item' : 'items'}`;
  }
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value).length;
    return `object · ${keys} ${keys === 1 ? 'key' : 'keys'}`;
  }
  return typeof value;
}
