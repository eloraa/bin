'use client';

import { login } from '@/app/actions/auth';
import { useActionState } from 'react';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="sr-only">
          <h2 className="text-3xl font-bold tracking-tight">Secure Login</h2>
          <p className="mt-2 text-sm text-gray-400">Enter your public key and passphrase to access bins.</p>
        </div>
        <form action={action} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="publicKey" className="sr-only">
                Public Key
              </label>
              <textarea
                id="publicKey"
                name="publicKey"
                required
                className="relative block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 p-3 h-32 font-mono"
                placeholder="ssh-ed25519 AAA..."
              />
            </div>
            <div>
              <label htmlFor="passphrase" className="sr-only">
                Passphrase
              </label>
              <input
                id="passphrase"
                name="passphrase"
                type="password"
                required
                className="relative block w-full rounded-md border-0 bg-gray-900 py-1.5 text-white ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 p-3"
                placeholder="Passphrase"
              />
            </div>
          </div>

          {state?.error && <div className="text-red-500 text-sm text-center">{state.error}</div>}

          <div>
            <button
              type="submit"
              disabled={pending}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            >
              {pending ? 'Verifying...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
