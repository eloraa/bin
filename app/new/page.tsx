import { BinForm } from '@/components/BinForm';
import { notFound } from 'next/navigation';
import { isAuthenticated } from '@/lib/server/auth-utils';

export default async function NewBinPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) return notFound();

  return <BinForm isAuthenticated={authenticated} />;
}
