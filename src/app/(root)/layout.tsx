import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

async function layout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
  const store = await db.store.findFirst({
    where: {
      userId,
    },
  });
  if (store) redirect(`/${store.id}`);
  return <>{children}</>;
}

export default layout;
