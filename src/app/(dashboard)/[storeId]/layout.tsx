import Navbar from '@/components/Navbar';
import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  children: React.ReactNode;
  params: { storeId: string };
}

async function layout({ children, params }: Props) {
  cookies();
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });
  if (!store) {
    redirect('/');
  }
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default layout;
