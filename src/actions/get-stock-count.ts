import db from '@/lib/prismadb';

export async function getStockCount(storeId: string) {
  return db.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });
}
