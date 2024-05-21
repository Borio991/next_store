import db from '@/lib/prismadb';

export async function getSales(storeId: string) {
  return db.order.count({
    where: {
      storeId: storeId,
      isPaid: true,
    },
  });
}
