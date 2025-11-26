import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';

const firaCode = localFont({
  src: './FiraCode-Regular.ttf',
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'bin',
  description: 'A tiny, sensible pastebin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }} className={`${firaCode.variable} antialiased bg-black text-[#EEE] font-mono`}>
      <body>
        <div style={{ display: 'contents', height: '100%' }}>{children}</div>
      </body>
    </html>
  );
}
