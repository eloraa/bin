import { db } from '@/lib/server/db/db';
import { bins } from '@/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { BinForm } from '@/components/BinForm';
import { isAuthenticated } from '@/lib/server/auth-utils';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBinPage({ params }: PageProps) {
    const { id } = await params;

    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/secure-login');
    }

    const bin = await db.query.bins.findFirst({
        where: eq(bins.id, id),
    });

    if (!bin) {
        notFound();
    }

    return (
        <BinForm
            initialContent={bin.content}
            initialLanguage={bin.language}
            initialIsPrivate={bin.isPrivate}
            isEditing={true}
            binId={bin.id}
            isAuthenticated={authenticated}
        />
    );
}
