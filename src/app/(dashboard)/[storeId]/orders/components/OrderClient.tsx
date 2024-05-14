'use client';
import { OrderColumn, columns } from './columns';
import Heading from '@/components/Heading';
import ApiList from '@/components/ui/ApiList';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';

type Props = {
  orders: OrderColumn[];
};

function OrderClient({ orders }: Props) {
  return (
    <>
      <Heading title={`Orders (${orders.length})`} description={'manage your Orders'} />
      <Separator />
      <DataTable columns={columns} data={orders} filterKey={'products'} />
    </>
  );
}

export default OrderClient;
