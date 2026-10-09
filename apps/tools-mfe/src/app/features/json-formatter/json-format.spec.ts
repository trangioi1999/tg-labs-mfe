import {
  describeJson,
  errorLocation,
  findSyntaxErrorOffset,
  formatJson,
  locate,
  minifyJson,
} from './json-format';

describe('formatJson', () => {
  it('pretty-prints valid JSON with 2 spaces by default', () => {
    const result = formatJson('{"a":1,"b":[true,null]}');
    expect(result).toEqual({
      ok: true,
      value: { a: 1, b: [true, null] },
      output: '{\n  "a": 1,\n  "b": [\n    true,\n    null\n  ]\n}',
    });
  });

  it('supports 4 spaces and tabs', () => {
    expect(formatJson('{"a":1}', 4)).toMatchObject({ ok: true, output: '{\n    "a": 1\n}' });
    expect(formatJson('{"a":1}', 'tab')).toMatchObject({ ok: true, output: '{\n\t"a": 1\n}' });
  });

  it('rejects empty input with a helpful message', () => {
    expect(formatJson('   ')).toEqual({
      ok: false,
      message: 'Input is empty. Paste some JSON to get started.',
    });
  });

  it('reports a location for invalid JSON', () => {
    const result = formatJson('{\n  "a": 1,\n  b: 2\n}');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.location).toEqual({ line: 3, column: 3 });
    }
  });
});

describe('minifyJson', () => {
  it('removes insignificant whitespace', () => {
    expect(minifyJson('{\n  "a": [1, 2]\n}')).toMatchObject({ ok: true, output: '{"a":[1,2]}' });
  });
});

describe('errorLocation', () => {
  it('parses V8 and SpiderMonkey style messages', () => {
    expect(errorLocation('', 'Unexpected token at position 3 (line 2 column 1)')).toEqual({ line: 2, column: 1 });
    expect(errorLocation('ab\ncd', 'JSON.parse: bad character at position 4')).toEqual({ line: 2, column: 2 });
    expect(errorLocation('', 'something else')).toBeUndefined();
  });

  it('points at the end of input for truncated JSON', () => {
    expect(errorLocation('{"a":', 'Unexpected end of JSON input')).toEqual(locate('{"a":', 5));
  });
});

describe('describeJson', () => {
  it('summarises values', () => {
    expect(describeJson({ a: 1, b: 2 })).toBe('object · 2 keys');
    expect(describeJson([1])).toBe('array · 1 item');
    expect(describeJson(null)).toBe('null');
    expect(describeJson('x')).toBe('string');
  });
});

describe('findSyntaxErrorOffset', () => {
  it('returns undefined for valid JSON', () => {
    for (const valid of ['{}', '[]', '"a\\u00e9"', '-1.5e3', ' {"a":[true,false,null]} ']) {
      expect(findSyntaxErrorOffset(valid)).toBeUndefined();
      expect(() => JSON.parse(valid)).not.toThrow();
    }
  });

  it('points at the first invalid character', () => {
    expect(findSyntaxErrorOffset('{"a": }')).toBe(6);
    expect(findSyntaxErrorOffset('[1, 2,]')).toBe(6);
    expect(findSyntaxErrorOffset('{"a": 1} x')).toBe(9);
    expect(findSyntaxErrorOffset("{'a': 1}")).toBe(1);
    expect(findSyntaxErrorOffset('{"a":')).toBe(5);
    expect(findSyntaxErrorOffset('"bad \\x"')).toBe(6);
  });
});
