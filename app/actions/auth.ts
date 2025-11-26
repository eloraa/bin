'use server';

import { verifyCredentials } from '@/lib/auth';
import { createJWT } from '@/lib/jwt';
import { encrypt } from '@/lib/encryption';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE_NAME = 'bin_session';

export async function login(_: unknown, formData: FormData) {
    const publicKey = formData.get('publicKey') as string;
    const passphrase = formData.get('passphrase') as string;

    if (!publicKey || !passphrase) {
        return { error: 'Missing credentials' };
    }

    const result = await verifyCredentials(publicKey, passphrase);

    if (result.isValid && result.publicKeyFingerprint) {
        // Encrypt the passphrase with AES-256-GCM
        const encryptedData = encrypt(passphrase);

        const token = await createJWT({
            publicKeyFingerprint: result.publicKeyFingerprint,
            encryptedPassphrase: encryptedData.encrypted,
            iv: encryptedData.iv,
            authTag: encryptedData.authTag,
            loginTime: Date.now()
        });

        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });
        redirect('/');
    } else {
        return { error: 'Invalid credentials' };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect('/');
}
