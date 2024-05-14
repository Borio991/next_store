import ColorForm from './components/ColorForm';
import db from '@/lib/prismadb';
import React from 'react';

async function ColorId({ params }: { params: { colorId: string } }) {
  const color = await db.color.findUnique({
    where: {
      id: params.colorId,
    },
  });
  return (
    <div className="p-8 pt-6 space-y-4 flex-1">
      <div>
        <ColorForm initialData={color} />
      </div>
    </div>
  );
}

export default ColorId;
