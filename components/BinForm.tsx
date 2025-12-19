'use client';

import { createBin, updateBin } from '@/app/actions/bin';
import { useActionState, useState, useTransition } from 'react';
import Link from 'next/link';
import { ClientShortcut } from './ClientShortcut';
import { CustomMarkdownEditor } from './markdown/custom-markdown-editor';

interface BinFormProps {
  initialContent?: string;
  initialLanguage?: string;
  initialIsPrivate?: boolean;
  initialIsMarkdown?: boolean;
  isEditing?: boolean;
  binId?: string;
  isAuthenticated: boolean;
}

export function BinForm({ initialContent = '', initialLanguage = 'plaintext', initialIsPrivate = false, initialIsMarkdown = false, isEditing = false, binId, isAuthenticated }: BinFormProps) {
  const actionFn = isEditing && binId ? updateBin.bind(null, binId) : createBin;

  const [state, action, pending] = useActionState(actionFn, undefined);
  const [isMarkdown, setIsMarkdown] = useState(initialIsMarkdown);
  const [content, setContent] = useState(initialContent);
  const [validationError, setValidationError] = useState('');
  const [isPending, startTransition] = useTransition();

  const MIN_CONTENT_LENGTH = 1;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content || content.trim().length < MIN_CONTENT_LENGTH) {
      setValidationError('Content cannot be empty');
      return;
    }

    setValidationError('');
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      action(formData);
    });
  };

  if (!isAuthenticated && !isEditing) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-black text-[#EEE]">
      <ClientShortcut />
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 relative min-h-0">
          {isMarkdown ? (
            <>
              <input type="hidden" name="content" value={content} />
              <div className="absolute inset-0 w-full h-full overflow-auto p-4 pb-6">
                <CustomMarkdownEditor value={content} onChange={setContent} className="h-full" />
              </div>
            </>
          ) : (
            <textarea
              name="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="absolute inset-0 w-full h-full bin-editor font-mono text-base"
              placeholder="// Paste your code here..."
              spellCheck={false}
            />
          )}
        </div>

        <footer className="h-8 flex items-center px-4 justify-between fixed bottom-0 w-full bg-[#e52a5706] backdrop-blur-[5px] text-xs z-50">
          <div className="flex items-center gap-4">
            <Link href="/new" className="text-[#EEE] hover:text-[#e52a57] transition-colors">
              New
            </Link>
            <span className="text-gray-500">|</span>
            <button type="submit" disabled={pending || isPending} className="text-[#EEE] hover:text-[#e52a57] transition-colors font-mono disabled:opacity-50 bg-transparent border-none cursor-pointer">
              {(pending || isPending) ? 'Saving...' : 'Save'}
            </button>
            {validationError && <span className="text-red-500 ml-2">{validationError}</span>}
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

            <span className="text-gray-500">|</span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isMarkdown"
                name="isMarkdown"
                checked={isMarkdown}
                onChange={(e) => setIsMarkdown(e.target.checked)}
                className="accent-[#e52a57]"
              />
              <label htmlFor="isMarkdown" className="text-[#AAA] cursor-pointer hover:text-[#EEE]">
                Markdown
              </label>
            </div>

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
