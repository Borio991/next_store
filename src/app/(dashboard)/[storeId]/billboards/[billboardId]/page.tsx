import BillBoardForm from './components/BillboardForm';
import db from '@/lib/prismadb';
import React from 'react';

async function BillBoardId({ params }: { params: { billboardId: string } }) {
  const billboard = await db.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <div className="p-8 pt-6 space-y-4 flex-1">
      <div>
        <BillBoardForm initialData={billboard} />
      </div>
    </div>
  );
}

export default BillBoardId;
