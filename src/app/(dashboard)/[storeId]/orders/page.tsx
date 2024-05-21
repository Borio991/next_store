import db from '@/lib/prismadb';
import { formatter } from '@/lib/utils';
import OrderClient from './components/OrderClient';

async function OrdersPage({ params }: { params: { storeId: string } }) {
  const orders = await db.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedOrders = orders.map((item) => {
    return {
      id: item.id,
      phone: item.phone,
      address: item.address,
      isPaid: item.isPaid,
      totalPrice: formatter.format(
        item.orderItems.reduce((acc, orderItem) => acc + Number(orderItem.product.price), 0)
      ),
      products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
      createdAt: item.createdAt.toDateString(),
    };
  });

  return (
    <div className="p-8 pt-6 space-y-4 flex-1">
      <OrderClient orders={formattedOrders} />
    </div>
  );
}

export default OrdersPage;
