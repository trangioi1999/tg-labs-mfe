import { encodeBase64 } from '../base64/base64-codec';
import { claimDate, decodeJwt, expiryState } from './jwt-decode';

const segment = (value: unknown) => encodeBase64(JSON.stringify(value), true);
const token = (
  payload: unknown,
  header: unknown = { alg: 'HS256', typ: 'JWT' },
) => `${segment(header)}.${segment(payload)}.c2lnbmF0dXJl`;

describe('decodeJwt', () => {
  it('decodes header and payload without verifying the signature', () => {
    const result = decodeJwt(token({ sub: '42', name: 'Ada' }));
    expect(result).toEqual({
      ok: true,
      token: {
        header: { alg: 'HS256', typ: 'JWT' },
        payload: { sub: '42', name: 'Ada' },
        signature: 'c2lnbmF0dXJl',
      },
    });
  });

  it('accepts a "Bearer " prefix', () => {
    expect(decodeJwt(`Bearer ${token({ sub: '1' })}`).ok).toBe(true);
  });

  it('explains structural problems', () => {
    expect(decodeJwt('abc.def')).toEqual({
      ok: false,
      message:
        'A JWT has 3 dot-separated parts (header.payload.signature); this input has 2.',
    });
    expect(decodeJwt('%%%.e30.x')).toEqual({
      ok: false,
      message: 'The header is not valid Base64URL.',
    });
    expect(decodeJwt(`${segment([1])}.e30.x`)).toEqual({
      ok: false,
      message: 'The header must be a JSON object.',
    });
  });
});

describe('expiryState', () => {
  const now = Date.UTC(2026, 0, 1);
  const nowSeconds = now / 1000;

  it('classifies time-based claims', () => {
    expect(expiryState({ exp: nowSeconds - 1 }, now)).toBe('expired');
    expect(expiryState({ exp: nowSeconds + 60 }, now)).toBe('valid');
    expect(expiryState({ nbf: nowSeconds + 60 }, now)).toBe('not-yet-valid');
    expect(expiryState({}, now)).toBe('unknown');
  });

  it('formats NumericDate claims', () => {
    expect(claimDate(0)).toBe('1970-01-01T00:00:00.000Z');
    expect(claimDate('soon')).toBeUndefined();
  });
});
