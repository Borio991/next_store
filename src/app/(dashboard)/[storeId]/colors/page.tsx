import db from '@/lib/prismadb';
import ColorClient from './components/ColorClient';

async function ColorsPage({ params }: { params: { storeId: string } }) {
  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-8 pt-6 space-y-4 flex-1">
      <ColorClient colors={colors} />
    </div>
  );
}

export default ColorsPage;
