'use client';

import * as React from 'react';
import Editor from 'react-simple-code-editor';
import { Button, buttonVariants } from '../ui/button';
import {
  Bold,
  Italic,
  Strikethrough,
  Minus,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Quote,
  Link2,
  Code,
  FrameIcon,
  CircleHelp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';

import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-glsl';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface CustomMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ToolbarButton: React.FC<{
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
}> = ({ icon, tooltip, onClick }) => (
  <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" variant="outline" size="icon" onClick={onClick} className="h-8 w-8 flex items-center justify-center hover:bg-accent/10 rounded-md">
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const HeadingDropdown: React.FC<{
  onSelect: (level: number) => void;
}> = ({ onSelect }) => (
  <DropdownMenu>
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="icon" className="h-8 w-8 flex items-center justify-center hover:bg-accent/10 rounded-md">
              <Heading1 className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Heading</TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <DropdownMenuContent align="start">
      <DropdownMenuItem onClick={() => onSelect(1)} className="gap-2">
        <Heading1 className="size-4" /> Heading 1
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSelect(2)} className="gap-2">
        <Heading2 className="size-4" /> Heading 2
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSelect(3)} className="gap-2">
        <Heading3 className="size-4" /> Heading 3
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSelect(4)} className="gap-2">
        <Heading4 className="size-4" /> Heading 4
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSelect(5)} className="gap-2">
        <Heading5 className="size-4" /> Heading 5
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onSelect(6)} className="gap-2">
        <Heading6 className="size-4" /> Heading 6
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const CodeDropdown: React.FC<{
  onInlineCode: () => void;
  onCodeBlock: () => void;
}> = ({ onInlineCode, onCodeBlock }) => (
  <DropdownMenu>
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="icon" className="h-8 w-8 flex items-center justify-center hover:bg-accent/10 rounded-md">
              <Code className="size-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Code</TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <DropdownMenuContent align="start">
      <DropdownMenuItem onClick={onInlineCode} className="gap-2">
        <Code className="size-4" /> Inline Code
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onCodeBlock} className="gap-2">
        <Code className="size-4" /> Code Block
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

interface EmbedPopoverProps {
  onEmbed: (url: string, modifiers: string) => void;
}

const EmbedPopover: React.FC<EmbedPopoverProps> = ({ onEmbed }) => {
  const [url, setUrl] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [aspectRatio, setAspectRatio] = useState('');
  const [useBreakpoints, setUseBreakpoints] = useState(false);
  const [breakpoints, setBreakpoints] = useState<Array<{ width: string; operator: string; height: string }>>([]);

  const handleSubmit = () => {
    if (!url) return;

    let modifiers = '';
    if (useBreakpoints && breakpoints.length > 0) {
      const breakpointModifiers = breakpoints.map(bp => `(x${bp.width}${bp.operator}h${bp.height})`).join('');
      modifiers = breakpointModifiers;
    } else {
      if (width) modifiers += ` w${width}`;
      if (height) modifiers += ` h${height}`;
    }
    if (aspectRatio) modifiers += ` a${aspectRatio}`;

    onEmbed(url, modifiers.trim());
  };

  const addBreakpoint = () => {
    setBreakpoints([...breakpoints, { width: '', operator: '>', height: '' }]);
  };

  const updateBreakpoint = (index: number, field: 'width' | 'operator' | 'height', value: string) => {
    const newBreakpoints = [...breakpoints];
    newBreakpoints[index] = { ...newBreakpoints[index], [field]: value };
    setBreakpoints(newBreakpoints);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="h-8 w-8 flex items-center justify-center hover:bg-accent/10 rounded-md">
                <FrameIcon className="size-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Embed Iframe</TooltipContent>
        </Tooltip>
        <PopoverContent className="w-80 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" placeholder="Enter iframe URL" value={url} onChange={e => setUrl(e.target.value)} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="breakpoints" checked={useBreakpoints} onCheckedChange={setUseBreakpoints} />
              <Label htmlFor="breakpoints">Use Breakpoints</Label>
            </div>

            {useBreakpoints ? (
              <div className="space-y-4">
                {breakpoints.map((bp, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input placeholder="Screen Width" value={bp.width} onChange={e => updateBreakpoint(index, 'width', e.target.value)} className="w-full h-8" />
                    <Select value={bp.operator} onValueChange={value => updateBreakpoint(index, 'operator', value)}>
                      <SelectTrigger className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'ring-1 ring-inset ring-accent/5 h-8 min-w-14 w-14')}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=">">&gt;</SelectItem>
                        <SelectItem value="<">&lt;</SelectItem>
                        <SelectItem value=">=">&gt;=</SelectItem>
                        <SelectItem value="<=">&lt;=</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Iframe Height" value={bp.height} onChange={e => updateBreakpoint(index, 'height', e.target.value)} className="w-full h-8" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        const newBreakpoints = breakpoints.filter((_, i) => i !== index);
                        setBreakpoints(newBreakpoints);
                      }}
                    >
                      <Minus className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="secondary" size="sm" onClick={addBreakpoint}>
                  Add Breakpoint
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Screen Width</Label>
                  <Input id="width" placeholder="e.g. 800" value={width} onChange={e => setWidth(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Iframe Height</Label>
                  <Input id="height" placeholder="e.g. 600" value={height} onChange={e => setHeight(e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="aspect-ratio">Aspect Ratio (optional)</Label>
              <Input id="aspect-ratio" placeholder="e.g. 16/9" value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} />
            </div>

            <Button type="button" variant="secondary" onClick={handleSubmit} className="w-full rounded-full">
              Embed
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

interface ImagePopoverProps {
  onImage: (url: string, alt: string) => void;
}

const ImagePopover: React.FC<ImagePopoverProps> = ({ onImage }) => {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [maxWidth, setMaxWidth] = useState('');

  const handleSubmit = () => {
    if (!url) return;
    const altText = maxWidth ? `${alt} mw${maxWidth}` : alt;
    onImage(url, altText);
  };

  return (
    <Popover>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="h-8 w-8 flex items-center justify-center hover:bg-accent/10 rounded-md">
                <ImageIcon className="size-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Insert Image</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input id="image-url" placeholder="Enter image URL" value={url} onChange={e => setUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-alt">Alt Text</Label>
            <Input id="image-alt" placeholder="Enter alt text" value={alt} onChange={e => setAlt(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-maxwidth">Max Width (optional, in pixels)</Label>
            <Input id="image-maxwidth" placeholder="e.g. 800" value={maxWidth} onChange={e => setMaxWidth(e.target.value)} />
          </div>

          <Button type="button" variant="secondary" onClick={handleSubmit} className="w-full rounded-full">
            Insert Image
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface LinkPopoverProps {
  onLink: (text: string, url: string) => void;
}

const LinkPopover: React.FC<LinkPopoverProps> = ({ onLink }) => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (!url) return;
    onLink(text, url);
  };

  return (
    <Popover>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="h-8 w-8 flex items-center justify-center hover:bg-accent/10 rounded-md">
                <Link2 className="size-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Insert Link</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-text">Link Text</Label>
            <Input id="link-text" placeholder="Enter link text" value={text} onChange={e => setText(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input id="link-url" placeholder="Enter URL" value={url} onChange={e => setUrl(e.target.value)} />
          </div>

          <Button type="button" variant="secondary" onClick={handleSubmit} className="w-full rounded-full">
            Insert Link
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const CustomMarkdownEditor: React.FC<CustomMarkdownEditorProps> = ({ value, onChange, className }) => {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [editorStyle, setEditorStyle] = React.useState({
    backgroundColor: '#000000',
    color: '#000000',
    lineHeight: '1.5',
    fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
  });

  const [themeStyles, setThemeStyles] = React.useState({
    '.token.bold': { fontWeight: 'bold' },
    '.token.italic': { fontStyle: 'italic' },
    '.token.keyword': { color: '#d73a49' },
    '.token.punctuation': { color: '#24292e' },
    '.token.string': { color: '#032f62' },
    '.token.url': { color: '#032f62' },
    '.token.operator': { color: '#d73a49' },
    '.token.number': { color: '#005cc5' },
    '.token.heading': { color: '#d73a49', fontWeight: 'bold' },
    '.token.list': { color: '#005cc5' },
    '.token.hr': { color: '#005cc5' },
    '.token.code': { color: '#032f62' },
    '.token.title': { color: '#d73a49', fontWeight: 'bold' },
    '.token.comment': { color: '#6a737d' },
    '.token.blockquote': { color: '#6a737d' },
  });

  React.useEffect(() => {
    const newStyle = {
      backgroundColor: '#000000',
      color: '#ffffff',
      lineHeight: '1.5',
      fontFamily: "'Fira Code Variable', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    };
    setEditorStyle(newStyle);

    const newThemeStyles = {
      '.token.bold': { fontWeight: 'bold' },
      '.token.italic': { fontStyle: 'italic' },
      '.token.keyword': { color: '#ff7b72' },
      '.token.punctuation': { color: '#79c0ff' },
      '.token.string': { color: '#a5d6ff' },
      '.token.url': { color: '#a5d6ff' },
      '.token.operator': { color: '#ff7b72' },
      '.token.number': { color: '#79c0ff' },
      '.token.heading': { color: '#ff7b72', fontWeight: 'bold' },
      '.token.list': { color: '#79c0ff' },
      '.token.hr': { color: '#79c0ff' },
      '.token.code': { color: '#a5d6ff' },
      '.token.title': { color: '#ff7b72', fontWeight: 'bold' },
      '.token.comment': { color: '#8b949e' },
      '.token.blockquote': { color: '#8b949e' },
    };
    setThemeStyles(newThemeStyles);
  }, []);

  const getSelectedText = () => {
    const editor = editorRef.current;
    if (!editor) return { text: '', start: 0, end: 0 };

    const textarea = editor.querySelector('textarea');
    if (!textarea) return { text: '', start: 0, end: 0 };

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value.substring(start, end);

    return { text, start, end, textarea };
  };

  const insertText = (before: string, text: string, after: string) => {
    const { start, end, textarea } = getSelectedText();
    if (!textarea) return;

    const newText = value.substring(0, start) + before + text + after + value.substring(end);
    onChange(newText);

    const selectionStart = start + before.length;
    const selectionEnd = selectionStart + text.length;

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
    }, 0);
  };

  const handleBold = () => {
    const { text } = getSelectedText();
    insertText('**', text || 'bold text', '**');
  };

  const handleItalic = () => {
    const { text } = getSelectedText();
    insertText('*', text || 'italic text', '*');
  };

  const handleStrikethrough = () => {
    const { text } = getSelectedText();
    insertText('~~', text || 'strikethrough text', '~~');
  };

  const handleHeading = (level: number) => {
    const { text } = getSelectedText();
    insertText('#'.repeat(level) + ' ', text || 'Heading', '');
  };

  const handleQuote = () => {
    const { text } = getSelectedText();
    insertText('> ', text || 'Quote', '');
  };

  const handleInlineCode = () => {
    const { text } = getSelectedText();
    insertText('`', text || 'code', '`');
  };

  const handleCodeBlock = () => {
    const { text } = getSelectedText();
    insertText('\n```\n', text || 'code', '\n```\n');
  };

  const handleLink = (text: string, url: string) => {
    insertText('[', text || 'link', `](${url})`);
  };

  const handleImage = (url: string, alt: string) => {
    const imageText = `![${alt || 'image'}](${url})`;
    insertText('', imageText, '');
  };

  const handleList = () => {
    const { text } = getSelectedText();
    insertText('- ', text || 'List item', '');
  };

  const handleOrderedList = () => {
    const { text } = getSelectedText();
    insertText('1. ', text || 'List item', '');
  };

  const handleHorizontalRule = () => {
    insertText('\n---\n', '', '');
  };

  const handleEmbed = (url: string, modifiers: string) => {
    const embedText = `![Embed ${modifiers}](${url})`;
    insertText('', embedText, '');
  };

  const highlight = (code: string) => {
    return Prism.highlight(code, Prism.languages.markdown, 'markdown');
  };

  return (
    <div className={cn('relative', className)}>
      <style suppressHydrationWarning>
        {Object.entries(themeStyles)
          .map(
            ([selector, styles]) =>
              `${selector} { ${Object.entries(styles)
                .map(([prop, value]) => `${prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}: ${value}`)
                .join('; ')} }`
          )
          .join('\n')}
      </style>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 mb-2 flex-wrap">
          <ToolbarButton icon={<Bold className="size-4" />} tooltip="Bold" onClick={handleBold} />
          <ToolbarButton icon={<Italic className="size-4" />} tooltip="Italic" onClick={handleItalic} />
          <ToolbarButton icon={<Strikethrough className="size-4" />} tooltip="Strikethrough" onClick={handleStrikethrough} />
          <HeadingDropdown onSelect={handleHeading} />
          <ToolbarButton icon={<Quote className="size-4" />} tooltip="Quote" onClick={handleQuote} />
          <CodeDropdown onInlineCode={handleInlineCode} onCodeBlock={handleCodeBlock} />
          <LinkPopover onLink={handleLink} />
          <ImagePopover onImage={handleImage} />
          <ToolbarButton icon={<List className="size-4" />} tooltip="List" onClick={handleList} />
          <ToolbarButton icon={<ListOrdered className="size-4" />} tooltip="Ordered List" onClick={handleOrderedList} />
          <ToolbarButton icon={<Minus className="size-4" />} tooltip="Horizontal Rule" onClick={handleHorizontalRule} />
          <EmbedPopover onEmbed={handleEmbed} />
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8 min-w-8 flex items-center justify-center hover:bg-accent/10 rounded-md" asChild>
                <a href="//www.markdownguide.org/basic-syntax/" target="_blank">
                  <CircleHelp />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Markdown Guides</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div ref={editorRef} className="overflow-y-auto border border-accent/15">
        <Editor value={value} onValueChange={onChange} highlight={highlight} padding={10} style={editorStyle} className="min-h-80" textareaClassName="focus:outline-none" suppressHydrationWarning />
      </div>
    </div>
  );
};
