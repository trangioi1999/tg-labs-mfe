import { decodeBase64 } from '../base64/base64-codec';

/**
 * Decodes (but does NOT verify) a JSON Web Token. Signature verification
 * requires the issuer's key and must happen on a trusted server.
 */
export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  /** Raw, still-encoded signature segment (never verified here). */
  signature: string;
}

export type JwtResult =
  | { ok: true; token: DecodedJwt }
  | { ok: false; message: string };

function decodeSegment(segment: string, name: string): Record<string, unknown> {
  const decoded = decodeBase64(segment);
  if (!decoded.ok) {
    throw new Error(`The ${name} is not valid Base64URL.`);
  }
  let value: unknown;
  try {
    value = JSON.parse(decoded.output);
  } catch {
    throw new Error(`The ${name} is not valid JSON.`);
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`The ${name} must be a JSON object.`);
  }
  return value as Record<string, unknown>;
}

export function decodeJwt(input: string): JwtResult {
  const token = input.trim().replace(/^Bearer\s+/i, '');
  if (!token) {
    return { ok: false, message: 'Paste a token to decode it.' };
  }
  const parts = token.split('.');
  if (parts.length !== 3) {
    return {
      ok: false,
      message: `A JWT has 3 dot-separated parts (header.payload.signature); this input has ${parts.length}.`,
    };
  }
  try {
    return {
      ok: true,
      token: {
        header: decodeSegment(parts[0], 'header'),
        payload: decodeSegment(parts[1], 'payload'),
        signature: parts[2],
      },
    };
  } catch (error: unknown) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export type ExpiryState = 'expired' | 'valid' | 'not-yet-valid' | 'unknown';

/**
 * Describes the time-based claims (`exp`, `nbf`) relative to `now`.
 * This is informational only and says nothing about authenticity.
 */
export function expiryState(
  payload: Record<string, unknown>,
  now = Date.now(),
): ExpiryState {
  const seconds = now / 1000;
  const { exp, nbf } = payload;
  if (typeof nbf === 'number' && seconds < nbf) {
    return 'not-yet-valid';
  }
  if (typeof exp === 'number') {
    return seconds >= exp ? 'expired' : 'valid';
  }
  return 'unknown';
}

/** Formats a NumericDate claim (seconds since epoch) as an ISO timestamp. */
export function claimDate(value: unknown): string | undefined {
  return typeof value === 'number' && Number.isFinite(value)
    ? new Date(value * 1000).toISOString()
    : undefined;
}
