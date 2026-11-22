import { ScenarioTreeSchema, type ScenarioTree } from '@/types/scenario';

const HASH_PREFIX = '#scenario=';

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(encoded: string): Uint8Array {
  const padded =
    encoded.replace(/-/g, '+').replace(/_/g, '/') +
    '==='.slice((encoded.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Serializes a ScenarioTree into a compact URL hash fragment (`#scenario=...`).
 */
export function encodeScenarioToHash(tree: ScenarioTree): string {
  const json = JSON.stringify(tree);
  const bytes = new TextEncoder().encode(json);
  return `${HASH_PREFIX}${toBase64Url(bytes)}`;
}

/**
 * Decodes and strictly validates a ScenarioTree from a URL hash fragment.
 * Returns null if the hash is absent, corrupted, or fails schema validation.
 */
export function decodeScenarioFromHash(hash: string): ScenarioTree | null {
  if (!hash || !hash.startsWith(HASH_PREFIX)) {
    return null;
  }
  try {
    const payload = hash.slice(HASH_PREFIX.length);
    if (!payload) return null;
    const bytes = fromBase64Url(payload);
    const json = new TextDecoder().decode(bytes);
    const parsed: unknown = JSON.parse(json);
    const validated = ScenarioTreeSchema.safeParse(parsed);
    if (!validated.success) {
      return null;
    }
    return validated.data;
  } catch {
    return null;
  }
}
