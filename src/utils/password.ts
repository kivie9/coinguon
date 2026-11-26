/**
 * Tiện ích băm & đối chiếu mật khẩu dùng chuẩn Web Crypto API (PBKDF2-SHA256).
 * Tương thích 100% với cả Node.js lẫn Cloudflare Workers / Edge Runtime (không cần native bcrypt).
 */

const ITERATIONS = 100_000;
const KEY_LENGTH_BITS = 256;
const SALT_LENGTH_BYTES = 16;

function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToBytes(hex: string): Uint8Array {
    const clean = hex.trim();
    const out = new Uint8Array(clean.length / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a[i] ^ b[i];
    }
    return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
    const salt = new Uint8Array(SALT_LENGTH_BYTES);
    globalThis.crypto.getRandomValues(salt);

    const enc = new TextEncoder();
    const keyMaterial = await globalThis.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const derivedBits = await globalThis.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt as BufferSource,
            iterations: ITERATIONS,
            hash: 'SHA-256',
        },
        keyMaterial,
        KEY_LENGTH_BITS
    );

    const hashBytes = new Uint8Array(derivedBits);
    return `pbkdf2_sha256$${ITERATIONS}$${bytesToHex(salt)}$${bytesToHex(hashBytes)}`;
}

export async function verifyPassword(password: string, storedHash: string | null | undefined): Promise<boolean> {
    if (!storedHash) return false;
    const parts = storedHash.split('$');
    if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') {
        return false;
    }

    const iterations = parseInt(parts[1], 10);
    if (!Number.isFinite(iterations) || iterations < 10_000) {
        return false;
    }

    const salt = hexToBytes(parts[2]);
    const expectedHash = hexToBytes(parts[3]);

    const enc = new TextEncoder();
    const keyMaterial = await globalThis.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    const derivedBits = await globalThis.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt as BufferSource,
            iterations,
            hash: 'SHA-256',
        },
        keyMaterial,
        expectedHash.length * 8
    );

    const actualHash = new Uint8Array(derivedBits);
    return timingSafeEqual(actualHash, expectedHash);
}
