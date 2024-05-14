import db from '@/lib/prismadb';
import { cookies } from 'next/headers';
import React from 'react';

interface Props {
  params: { storeId: string };
}

async function page({ params }: Props) {
  cookies();
  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return <div>Active Store : {store?.name}</div>;
}

export default page;
