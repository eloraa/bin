'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { commands } from '@uiw/react-md-editor';
import { ImageIcon, Bold, Italic, Strikethrough, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface EditorState {
  selection: {
    start: number;
    end: number;
  };
}

interface EditorApi {
  replaceSelection: (text: string) => EditorState;
  setSelectionRange: (range: { start: number; end: number }) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, className }) => {
  const handleChange = (value?: string) => {
    onChange(value || '');
  };

  const customCommands = {
    bold: {
      ...commands.bold,
      buttonProps: { 'aria-label': 'Bold', className: 'h-8 w-8 flex items-center justify-center hover:bg-accent/10 rounded-md' },
      icon: <Bold className="size-4" />,
    },
    italic: {
      ...commands.italic,
      buttonProps: { 'aria-label': 'Italic', className: 'h-8 w-8 flex items-center justify-center hover:bg-accent/10 rounded-md' },
      icon: <Italic className="size-4" />,
    },
    strikethrough: {
      ...commands.strikethrough,
      buttonProps: { 'aria-label': 'Strikethrough', className: 'h-8 w-8 flex items-center justify-center hover:bg-accent/10 rounded-md' },
      icon: <Strikethrough className="size-4" />,
    },
    hr: {
      ...commands.hr,
      buttonProps: { 'aria-label': 'Horizontal Rule', className: 'h-8 w-8 flex items-center justify-center hover:bg-accent/10 rounded-md' },
      icon: <Minus className="size-4" />,
    },
    embed: {
      name: 'embed',
      keyCommand: 'embed',
      buttonProps: {
        'aria-label': 'Add embed iframe',
        className: cn(buttonVariants({ variant: 'secondary', size: 'icon' })),
      },
      icon: <ImageIcon className="size-4" />,
      execute: (_state: EditorState, api: EditorApi) => {
        const url = window.prompt('Enter iframe URL:');
        if (!url) return;

        const modifiers = window.prompt('Enter modifiers (optional, e.g., "w800 h600 a16/9"):');
        const embedText = modifiers ? `![Embed ${modifiers}](${url})` : `![Embed](${url})`;

        const newState = api.replaceSelection(embedText);
        api.setSelectionRange({
          start: newState.selection.end,
          end: newState.selection.end,
        });
      },
    },
  };

  return (
    <div className={className} data-color-mode="dark">
      <MDEditor
        value={value}
        onChange={handleChange}
        preview="edit"
        height={500}
        visibleDragbar={false}
        commands={[customCommands.bold, customCommands.italic, customCommands.strikethrough, customCommands.hr, customCommands.embed]}
        extraCommands={[]}
        style={{ backgroundColor: 'transparent', color: 'var(--foreground)' }}
        previewOptions={{
          components: {
            img: ({ src, alt }) => {
              if (!src) return null;

              if (alt === 'Embed') {
                return (
                  <figure className="relative w-full overflow-hidden rounded-2xl my-4">
                    <iframe src={src instanceof Blob ? URL.createObjectURL(src) : src} width="100%" height="400" className="rounded-lg max-w-full" allowFullScreen />
                  </figure>
                );
              }

              // Check for basic embed syntax: ![Embed w800 h600 a16/9](url)
              const embedMatch = alt?.match(/^Embed(?:\s+w(\d+))?(?:\s+h(\d+))?(?:\s+a(\d+\/\d+))?$/);
              if (embedMatch) {
                const [, width, height, aspectRatio] = embedMatch;
                return (
                  <figure className="relative w-full overflow-hidden rounded-2xl my-4" style={{ aspectRatio: aspectRatio }}>
                    <iframe src={src instanceof Blob ? URL.createObjectURL(src) : src} width={width || '100%'} height={height || '100%'} className="rounded-lg max-w-full" allowFullScreen />
                  </figure>
                );
              }

              // Check for embed syntax with multiple breakpoints and aspect ratio: ![Embed (x768>h400)(h200) a16/9](url)
              if (alt?.startsWith('Embed') && (alt.includes('(x') || alt.includes('(h'))) {
                const aspectRatioMatch = alt.match(/a(\d+\/\d+)/);
                const caption = alt.split(')').slice(-1)[0].trim();

                return (
                  <figure className="relative w-full overflow-hidden rounded-2xl my-4" style={{ aspectRatio: aspectRatioMatch?.[1] }}>
                    <iframe src={src instanceof Blob ? URL.createObjectURL(src) : src} width="100%" height="400" className="rounded-lg max-w-full" allowFullScreen />
                    {caption && <figcaption className="text-center text-sm text-foreground/60 mt-2">{caption}</figcaption>}
                  </figure>
                );
              }

              return (
                <figure className="relative w-full overflow-hidden rounded-2xl my-4">
                  <Image src={src instanceof Blob ? URL.createObjectURL(src) : src} alt={alt || ''} width={800} height={600} className="rounded-lg max-w-full h-auto" />
                  {alt && <figcaption className="text-center text-sm text-foreground/60 mt-2">{alt}</figcaption>}
                </figure>
              );
            },
          },
        }}
      />
    </div>
  );
};
