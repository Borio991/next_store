'use client';
import { columns } from './columns';
import Heading from '@/components/Heading';
import ApiList from '@/components/ui/ApiList';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { Billboard } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type Props = {
  billboards: Billboard[];
};

function BillboardClient({ billboards }: Props) {
  const router = useRouter();
  const params = useParams();

  const formattedBilboards = billboards.map((billboard) => {
    return {
      id: billboard.id,
      label: billboard.label,
      createdAt: billboard.createdAt.toDateString(),
    };
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Billboards (${billboards.length})`} description={'manage your billboard'} />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedBilboards} filterKey={'label'} />
      <Heading title="Api" description="Api calls for Bilboards" />
      <ApiList entityName={'billboards'} entityIdName={'billboardId'} />
    </>
  );
}

export default BillboardClient;
