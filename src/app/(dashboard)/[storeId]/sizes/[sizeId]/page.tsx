import SizeForm from './components/SizeForm';
import db from '@/lib/prismadb';
import React from 'react';

async function SizeId({ params }: { params: { sizeId: string } }) {
  const size = await db.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });
  return (
    <div className="p-8 pt-6 space-y-4 flex-1">
      <div>
        <SizeForm initialData={size} />
      </div>
    </div>
  );
}

export default SizeId;
