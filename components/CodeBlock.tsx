'use client';

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import '@/app/styles/hybrid.css';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      delete (codeRef.current.dataset as Record<string, unknown>).highlighted;
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const lines = code.split('\n');

  return (
    <div className="h-full overflow-auto bg-black relative text-[13px] leading-normal">
      <div className="flex min-h-full font-mono">
        <div className="flex flex-col text-right pr-4 select-none bg-black py-3.5 z-10">
          {lines.map((_, i) => (
            <div key={i} className="px-2 hover:text-[#e52a57] cursor-pointer">
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex-1 bg-black min-w-0">
          <pre className="m-0 p-4 font-inherit">
            <code ref={codeRef} className={`${language === 'auto' ? '' : `language-${language}`} bg-black p-0! block outline-none font-inherit tab-[4]`}>
              {code}
            </code>
          </pre>
        </div>
      </div>
      <style jsx global>
        {`
          .hljs {
            background: #000 !important;
          }
        `}
      </style>
    </div>
  );
}
