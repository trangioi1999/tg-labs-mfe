/** UTF-8 safe Base64 / Base64URL helpers built on Web platform APIs. */

export type CodecResult =
  | { ok: true; output: string }
  | { ok: false; message: string };

function bytesToBinary(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return binary;
}

/** Encodes UTF-8 text as Base64 (or Base64URL without padding). */
export function encodeBase64(text: string, urlSafe = false): string {
  const encoded = btoa(bytesToBinary(new TextEncoder().encode(text)));
  return urlSafe
    ? encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    : encoded;
}

/** Decodes standard or URL-safe Base64 into UTF-8 text. */
export function decodeBase64(input: string): CodecResult {
  const compact = input.replace(/\s+/g, '');
  if (!compact) {
    return { ok: true, output: '' };
  }
  if (!/^[A-Za-z0-9+/_-]*={0,2}$/.test(compact)) {
    return {
      ok: false,
      message: 'Input contains characters that are not valid Base64.',
    };
  }
  const normalised = compact.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalised.padEnd(
    normalised.length + ((4 - (normalised.length % 4)) % 4),
    '=',
  );
  try {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return {
      ok: true,
      output: new TextDecoder('utf-8', { fatal: true }).decode(bytes),
    };
  } catch {
    return {
      ok: false,
      message: 'Input is not valid Base64-encoded UTF-8 text.',
    };
  }
}
