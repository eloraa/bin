'use client';

import { createBin, updateBin } from '@/app/actions/bin';
import { useActionState } from 'react';
import Link from 'next/link';
import { ClientShortcut } from './ClientShortcut';

interface BinFormProps {
  initialContent?: string;
  initialLanguage?: string;
  initialIsPrivate?: boolean;
  isEditing?: boolean;
  binId?: string;
  isAuthenticated: boolean;
}

export function BinForm({ initialContent = '', initialLanguage = 'plaintext', initialIsPrivate = false, isEditing = false, binId, isAuthenticated }: BinFormProps) {
  const actionFn = isEditing && binId ? updateBin.bind(null, binId) : createBin;

  const [state, action, pending] = useActionState(actionFn, undefined);

  if (!isAuthenticated && !isEditing) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-black text-[#EEE]">
      <ClientShortcut />
      <form action={action} className="flex-1 flex flex-col">
        <div className="flex-1 relative min-h-0">
          <textarea
            name="content"
            required
            defaultValue={initialContent}
            className="absolute inset-0 w-full h-full bin-editor font-mono text-base"
            placeholder="// Paste your code here..."
            spellCheck={false}
          />
        </div>

        <footer className="h-8 flex items-center px-4 justify-between fixed bottom-0 w-full bg-[#e52a5706] backdrop-blur-[5px] text-xs z-50">
          <div className="flex items-center gap-4">
            <Link href="/new" className="text-[#EEE] hover:text-[#e52a57] transition-colors">
              New
            </Link>
            <span className="text-gray-500">|</span>
            <button type="submit" disabled={pending} className="text-[#EEE] hover:text-[#e52a57] transition-colors font-mono disabled:opacity-50 bg-transparent border-none cursor-pointer">
              {pending ? 'Saving...' : 'Save'}
            </button>
            {state?.error && <span className="text-red-500 ml-2">{state.error}</span>}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-[#e52a57] font-bold hover:underline">
              bin
            </Link>
            <span className="text-gray-500">|</span>
            <select name="language" className="bg-transparent text-[#AAA] border-none outline-none cursor-pointer hover:text-[#EEE]" defaultValue={initialLanguage}>
              <option value="auto">Auto Detect</option>
              <option value="plaintext">Plain Text</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="php">PHP</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="json">JSON</option>
              <option value="sql">SQL</option>
              <option value="markdown">Markdown</option>
            </select>

            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">|</span>
                <input type="checkbox" id="isPrivate" name="isPrivate" defaultChecked={initialIsPrivate} className="accent-[#e52a57]" />
                <label htmlFor="isPrivate" className="text-[#AAA] cursor-pointer hover:text-[#EEE]">
                  Private
                </label>
              </div>
            )}
          </div>
        </footer>
      </form>
    </div>
  );
}
