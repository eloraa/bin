'use client';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { defaultSchema } from 'hast-util-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Button } from '../ui/button';
import { Check, Copy } from 'lucide-react';
import Image from 'next/image';
import type { Components } from 'react-markdown';

interface CopyTextProps {
  text: string;
  className?: string;
}

const CopyText: React.FC<CopyTextProps> = ({ text }) => {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const copy = async () => {
    await navigator.clipboard.writeText(text || window.location.href);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setCopied(true);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="icon" onClick={copy} title={copied ? 'Copied!' : 'Copy to clipboard'} className="bg-accent/5 border-0">
      <span className="sr-only">{copied ? 'Copied!' : 'Copy'}</span>
      {copied ? <Check /> : <Copy />}
    </Button>
  );
};

const lightStyle: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: '#000000',
    fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#000000',
    fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '1em',
    fontWeight: '400',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
    overflow: 'auto',
    borderRadius: '.5em',
    backgroundColor: '#f6f8fa',
  },
  comment: { color: '#6a737d' },
  prolog: { color: '#6a737d' },
  doctype: { color: '#6a737d' },
  cdata: { color: '#6a737d' },
  punctuation: { color: '#24292e' },
  namespace: { color: '#005cc5' },
  tag: { color: '#22863a' },
  boolean: { color: '#005cc5' },
  number: { color: '#005cc5' },
  deleted: { color: '#d73a49' },
  keyword: { color: '#d73a49' },
  property: { color: '#005cc5' },
  selector: { color: '#d73a49' },
  constant: { color: '#005cc5' },
  symbol: { color: '#005cc5' },
  builtin: { color: '#005cc5' },
  'attr-name': { color: '#005cc5' },
  'attr-value': { color: '#032f62' },
  string: { color: '#032f62' },
  char: { color: '#032f62' },
  operator: { color: '#d73a49' },
  entity: { color: '#005cc5', cursor: 'help' },
  url: { color: '#005cc5' },
  '.language-css .token.string': { color: '#005cc5' },
  '.style .token.string': { color: '#005cc5' },
  variable: { color: '#005cc5' },
  inserted: { color: '#22863a' },
  atrule: { color: '#d73a49' },
  regex: { color: '#032f62' },
  important: { color: '#d73a49', fontWeight: 'medium' },
  medium: { fontWeight: 'medium' },
  italic: { fontStyle: 'italic' },
  '.language-markup .token.tag': { color: '#22863a' },
  '.language-markup .token.attr-name': { color: '#005cc5' },
  '.language-markup .token.punctuation': { color: '#24292e' },
};

const darkStyle: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: '#ffffff',
    fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: '#ffffff',
    fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    fontSize: '1em',
    fontWeight: '400',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
    overflow: 'auto',
    borderRadius: '.5em',
    backgroundColor: '#1a1a1a',
  },
  comment: { color: '#6f6f6f' },
  prolog: { color: '#6f6f6f' },
  doctype: { color: '#6f6f6f' },
  cdata: { color: '#6f6f6f' },
  punctuation: { color: '#86897a' },
  namespace: { color: '#93beff' },
  tag: { color: '#dbfffa' },
  boolean: { color: '#7ad9fb' },
  number: { color: '#7ad9fb' },
  deleted: { color: '#ff6b6b' },
  keyword: { color: '#dbfffa' },
  property: { color: '#93beff' },
  selector: { color: '#ff6b6b' },
  constant: { color: '#dbfffa' },
  symbol: { color: 'hsl(53, 89%, 79%)' },
  builtin: { color: 'hsl(53, 89%, 79%)' },
  'attr-name': { color: '#dbfffa' },
  'attr-value': { color: '#cabeff' },
  string: { color: '#4be4f7' },
  char: { color: '#4be4f7' },
  operator: { color: '#7ad9fb' },
  entity: { color: '#00d4af', cursor: 'help' },
  url: { color: '#00d4af' },
  '.language-css .token.string': { color: '#00d4af' },
  '.style .token.string': { color: '#00d4af' },
  variable: { color: '#00d4af' },
  inserted: { color: '#00d4af' },
  atrule: { color: 'hsl(218, 22%, 55%)' },
  regex: { color: '#bbfe81' },
  important: { color: '#bbfe81', fontWeight: 'medium' },
  medium: { fontWeight: 'medium' },
  italic: { fontStyle: 'italic' },
  '.language-markup .token.tag': { color: 'hsl(33, 33%, 52%)' },
  '.language-markup .token.attr-name': { color: 'hsl(33, 33%, 52%)' },
  '.language-markup .token.punctuation': { color: 'hsl(33, 33%, 52%)' },
};

const DEFAULT_EMBED_SIZE = {
  width: '100%',
  height: '400',
} as const;

interface Breakpoint {
  width: number;
  operator: '>' | '<' | '>=' | '<=';
  height: number;
}

const ResponsiveIframe = ({ src, breakpoints, caption, hideCaption }: { src: string | undefined; breakpoints: Breakpoint[]; caption?: string; hideCaption?: boolean }) => {
  const [height, setHeight] = React.useState(400);

  React.useEffect(() => {
    const updateHeight = () => {
      const windowWidth = window.innerWidth;
      const sortedBreakpoints = [...breakpoints].sort((a, b) => b.width - a.width);

      for (const bp of sortedBreakpoints) {
        if (bp.width === 0) {
          setHeight(bp.height);
          return;
        }

        const matchesCondition = (() => {
          switch (bp.operator) {
            case '>':
              return windowWidth > bp.width;
            case '<':
              return windowWidth < bp.width;
            case '>=':
              return windowWidth >= bp.width;
            case '<=':
              return windowWidth <= bp.width;
            default:
              return false;
          }
        })();

        if (matchesCondition) {
          setHeight(bp.height);
          return;
        }
      }

      setHeight(400);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [breakpoints]);

  if (!src) return null;

  return (
    <figure className="relative w-full overflow-hidden rounded-2xl my-4">
      <iframe src={src} width="100%" height={height} className="rounded-lg max-w-full" allowFullScreen />
      {caption && !hideCaption && <figcaption className="text-center text-sm text-foreground/60 mt-2">{caption}</figcaption>}
    </figure>
  );
};

const CodeBlock = React.memo(({ code, language }: { code: string; language: string }) => {
  const style = darkStyle;

  return (
    <>
      <div className="absolute top-3 right-3">
        <div className="sticky top-0 flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">{language}</span>
          <CopyText text={code} className="bg-background/60 hover:bg-background/80 transition-colors" />
        </div>
      </div>
      <div className="w-full overflow-auto pr-10 p-4 bg-popover rounded-2xl my-4">
        <SyntaxHighlighter style={style} language={language} PreTag="span">
          {code}
        </SyntaxHighlighter>
      </div>
    </>
  );
});

CodeBlock.displayName = 'CodeBlock';

interface MarkdownPreviewProps {
  content: string;
  hideCaption?: boolean;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = React.memo(({ content, hideCaption }) => {
  const components = React.useMemo<Components>(
    () => ({
      p: ({ node, children }) => {
        const imgChild = node?.children?.[0];
        if (imgChild && typeof imgChild === 'object' && 'tagName' in imgChild && imgChild.tagName === 'img') {
          return <>{children}</>;
        }
        return <p>{children}</p>;
      },
      img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
        const { src: srcProp, alt } = props;
        const src = srcProp instanceof Blob ? URL.createObjectURL(srcProp) : srcProp;

        if (alt === 'Embed') {
          return (
            <figure className="relative w-full overflow-hidden rounded-2xl my-4">
              <iframe src={src} width={DEFAULT_EMBED_SIZE.width} height={DEFAULT_EMBED_SIZE.height} className="rounded-lg max-w-full" allowFullScreen />
            </figure>
          );
        }

        // Check for basic embed syntax: ![Embed w800 h600 a16/9](url)
        const embedMatch = alt?.match(/^Embed(?:\s+w(\d+))?(?:\s+h(\d+))?(?:\s+a(\d+\/\d+))?$/);
        if (embedMatch) {
          const [, width, height, aspectRatio] = embedMatch;
          return (
            <figure className="relative w-full overflow-hidden rounded-2xl my-4" style={{ aspectRatio: aspectRatio }}>
              <iframe src={src} width={width || '100%'} height={height || '100%'} className="rounded-lg max-w-full" allowFullScreen />
            </figure>
          );
        }

        // Check for embed syntax with multiple breakpoints and aspect ratio: ![Embed (x768>h400)(h200) a16/9](url)
        if (alt?.startsWith('Embed') && (alt.includes('(x') || alt.includes('(h'))) {
          const breakpointPattern = /\((x(\d+)\s*(>=|<=|>|<)\s*h(\d+))|(h(\d+))\)/g;
          const aspectRatioMatch = alt.match(/a(\d+\/\d+)/);
          const matches = [...alt.matchAll(breakpointPattern)];
          const breakpoints = matches.map(match => {
            if (match[1]) {
              return {
                width: Number(match[2]),
                operator: match[3].trim() as Breakpoint['operator'],
                height: Number(match[4]),
              };
            } else {
              return {
                width: 0,
                operator: '>' as const,
                height: Number(match[6]),
              };
            }
          });

          const caption = alt.split(')').slice(-1)[0].trim();

          return (
            <figure className="relative w-full overflow-hidden rounded-2xl my-4" style={{ aspectRatio: aspectRatioMatch?.[1] }}>
              <ResponsiveIframe src={src} breakpoints={breakpoints} caption={caption} hideCaption={hideCaption} />
            </figure>
          );
        }

        if (!hideCaption) {
          return (
            <figure className="relative w-full overflow-hidden rounded-2xl my-4">
              <Image className="rounded-lg max-w-full h-auto static!" src={src || ''} fill alt={alt || ''} />
              <figcaption className="text-center text-sm text-foreground/60 mt-2">{alt}</figcaption>
            </figure>
          );
        }
        return <Image fill src={src || ''} alt={alt || ''} className="rounded-lg max-w-full h-auto my-4 static!" loading="lazy" />;
      },
      a({ children, ...otherProps }: React.ComponentPropsWithoutRef<'a'>) {
        return (
          <a rel="noopener noreferrer" target="_blank" {...otherProps}>
            {children}
          </a>
        );
      },
      pre({ children }: React.ComponentPropsWithoutRef<'pre'>) {
        return <pre style={{ position: 'relative' }}>{children}</pre>;
      },
      code({ children, className = '' }: React.ComponentPropsWithoutRef<'code'>) {
        const code = Array.isArray(children) ? String(children[0] || '').replace(/\n$/, '') : String(children || '').replace(/\n$/, '');
        const match = /language-(\w+)/.exec(className || '');
        if (match) {
          return <CodeBlock code={code} language={match[1]} />;
        }
        return <code>{code}</code>;
      },
      table: ({ children }: React.ComponentPropsWithoutRef<'table'>) => (
        <div className="w-full my-6 overflow-x-auto">
          <table className="w-full border-collapse text-sm">{children}</table>
        </div>
      ),
      thead: ({ children }: React.ComponentPropsWithoutRef<'thead'>) => <thead className="border-b border-border">{children}</thead>,
      th: ({ children }: React.ComponentPropsWithoutRef<'th'>) => <th className="p-4 text-left font-medium text-muted-foreground bg-muted/50">{children}</th>,
      td: ({ children }: React.ComponentPropsWithoutRef<'td'>) => <td className="p-4 border-b border-border">{children}</td>,
    }),
    [hideCaption]
  );

  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={components}
        rehypePlugins={[
          rehypeRaw,
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                code: [['className', 'language-norun', 'language-js', 'language-jsx', 'language-ts', 'language-tsx', 'language-bash', 'language-css', 'language-md', 'language-glsl']],
              },
            },
          ],
        ]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownPreview.displayName = 'MarkdownPreview';
