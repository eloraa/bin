'use server';

import { db } from '@/lib/server/db/db';
import { bins } from '@/lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/server/auth-utils';

export async function createBin(_: unknown, formData: FormData) {
  const content = formData.get('content') as string;
  const language = (formData.get('language') as string) || 'plaintext';
  const isPrivate = formData.get('isPrivate') === 'on';
  const isMarkdown = formData.get('isMarkdown') === 'on';

  if (!content) {
    return { error: 'Content is required' };
  }

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return { error: 'You must be logged in to create bins' };
  }

  const id = nanoid(10);

  await db.insert(bins).values({
    id,
    content,
    language,
    isPrivate,
    isMarkdown,
  });

  redirect(`/bin/${id}`);
}

export async function updateBin(id: string, _: unknown, formData: FormData) {
  const content = formData.get('content') as string;
  const language = (formData.get('language') as string) || 'plaintext';
  const isPrivate = formData.get('isPrivate') === 'on';
  const isMarkdown = formData.get('isMarkdown') === 'on';

  if (!content) {
    return { error: 'Content is required' };
  }

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return { error: 'You must be logged in to update bins' };
  }

  await db
    .update(bins)
    .set({
      content,
      language,
      isPrivate,
      isMarkdown,
      updatedAt: new Date(),
    })
    .where(eq(bins.id, id));

  redirect(`/${id}`);
}
