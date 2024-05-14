import db from '@/lib/prismadb';
import BillboardClient from './components/BillboardClient';

async function BillboardsPage({ params }: { params: { storeId: string } }) {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-8 pt-6 space-y-4 flex-1">
      <BillboardClient billboards={billboards} />
    </div>
  );
}

export default BillboardsPage;
