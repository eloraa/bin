import { db } from '@/lib/server/db/db';
import { bins } from '@/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { CodeBlock } from '@/components/CodeBlock';
import { MarkdownPreview } from '@/components/markdown/markdown';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/server/auth-utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewBinPage({ params }: PageProps) {
  const { id } = await params;
  const bin = await db.query.bins.findFirst({
    where: eq(bins.id, id),
  });

  if (!bin) {
    notFound();
  }

  const authenticated = await isAuthenticated();

  if (bin.isPrivate && !authenticated) {
    return notFound()
  }

  return (
    <div className="h-full flex flex-col bg-black text-[#EEE]">
      <div className="flex-1 relative pb-8 min-h-0">
        {bin.isMarkdown ? (
          <div className="absolute inset-0 w-full h-full overflow-auto p-4">
            <MarkdownPreview content={bin.content} />
          </div>
        ) : (
          <CodeBlock code={bin.content} language={bin.language} />
        )}
      </div>

      <footer className="h-8 flex items-center px-4 justify-between fixed bottom-0 w-full bg-[#e52a5706] backdrop-blur-[5px] text-xs z-50">
        <div className="flex gap-4 items-center">
          {authenticated && (
            <>
              <Link href="/new" className="text-[#EEE] hover:text-[#e52a57] transition-colors">
                New
              </Link>
              <span className="text-gray-500">|</span>
              <Link href={`/${bin.id}/edit`} className="text-[#EEE] hover:text-[#e52a57] transition-colors">
                Edit
              </Link>
              <span className="text-gray-500">|</span>
            </>
          )}
          <Link href={`/bin/${bin.id}`} className="text-[#EEE] hover:text-[#e52a57] transition-colors">
            Raw
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#e52a57] font-bold hover:underline">
            bin
          </Link>
          <span className="text-gray-500">|</span>
          <span className="text-[#AAA]">{new Date(bin.createdAt).toLocaleString()}</span>
        </div>
      </footer>
    </div>
  );
}
