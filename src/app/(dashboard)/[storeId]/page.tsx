import { getSales } from '@/actions/get-sales';
import { getStockCount } from '@/actions/get-stock-count';
import { getTotalRevenue } from '@/actions/get-total-revenue';
import Heading from '@/components/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import db from '@/lib/prismadb';
import { formatter } from '@/lib/utils';
import { CreditCardIcon, DollarSignIcon, Package } from 'lucide-react';
import React from 'react';

interface Props {
  params: { storeId: string };
}

async function page({ params }: Props) {
  const totalRevenute = await getTotalRevenue(params.storeId);
  const sales = await getSales(params.storeId);
  const stock = await getStockCount(params.storeId);
  return (
    <div className="flex-col px-4">
      <div className="flex-1 space-y-4 pt-8">
        <Heading title="Dashboard" description="overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatter.format(totalRevenute)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{sales}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prodcts in Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stock}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default page;
