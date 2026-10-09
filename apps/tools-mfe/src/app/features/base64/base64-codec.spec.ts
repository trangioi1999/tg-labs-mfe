import { decodeBase64, encodeBase64 } from './base64-codec';

describe('base64 codec', () => {
  it('round-trips UTF-8 text', () => {
    const text = 'Xin chào 👋 TG Labs';
    const encoded = encodeBase64(text);
    expect(decodeBase64(encoded)).toEqual({ ok: true, output: text });
  });

  it('encodes known values', () => {
    expect(encodeBase64('hello')).toBe('aGVsbG8=');
    expect(encodeBase64('??>', true)).toBe('Pz8-');
  });

  it('decodes URL-safe input without padding', () => {
    expect(decodeBase64('Pz8-')).toEqual({ ok: true, output: '??>' });
    expect(decodeBase64('aGVsbG8')).toEqual({ ok: true, output: 'hello' });
  });

  it('rejects invalid input', () => {
    expect(decodeBase64('not base64!').ok).toBe(false);
    expect(decodeBase64('/w==').ok).toBe(false);
  });
});
