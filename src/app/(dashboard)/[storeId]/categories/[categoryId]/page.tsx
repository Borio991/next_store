import CategoryForm from './components/CategoryForm';
import db from '@/lib/prismadb';
import React from 'react';

async function CaegoryId({ params }: { params: { categoryId: string; storeId: string } }) {
  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <div className="p-8 pt-6 space-y-4 flex-1">
      <div>
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
}

export default CaegoryId;
