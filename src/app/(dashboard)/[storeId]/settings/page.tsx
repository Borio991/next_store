import SettingForm from '@/app/(dashboard)/[storeId]/settings/components/SettingForm';
import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  params: {
    storeId: string;
  };
}

async function SettingsPage({ params }: Props) {
  const { userId } = auth();
  if (!userId) {
    redirect('/sign-in');
  }
  const store = await db.store.findFirst({
    where: {
      userId,
      id: params.storeId,
    },
  });
  if (!store) {
    redirect('/');
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingForm initialData={store} />
      </div>
    </div>
  );
}

export default SettingsPage;
