import db from '@/lib/prismadb';
import SizeClient from './components/SizeClient';

async function SizesPage({ params }: { params: { storeId: string } }) {
  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-8 pt-6 space-y-4 flex-1">
      <SizeClient sizes={sizes} />
    </div>
  );
}

export default SizesPage;
