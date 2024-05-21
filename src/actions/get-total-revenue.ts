import db from '@/lib/prismadb';

export async function getTotalRevenue(storeId: string) {
  const orders = await db.order.findMany({
    where: {
      storeId: storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              price: true,
            },
          },
        },
      },
    },
  });

  const totalRevenue = orders.reduce((total, order) => {
    return (
      total +
      order.orderItems.reduce((total, orderItem) => {
        return total + orderItem.product.price.toNumber();
      }, 0)
    );
  }, 0);
  return totalRevenue;
}
