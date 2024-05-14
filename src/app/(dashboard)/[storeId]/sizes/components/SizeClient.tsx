'use client';
import { columns } from './columns';
import Heading from '@/components/Heading';
import ApiList from '@/components/ui/ApiList';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { Size } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type Props = {
  sizes: Size[];
};

function SizeClient({ sizes }: Props) {
  const router = useRouter();
  const params = useParams();

  const formattedSizes = sizes.map((size) => {
    return {
      id: size.id,
      name: size.name,
      value: size.value,
      createdAt: size.createdAt.toDateString(),
    };
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Sizes (${formattedSizes.length})`} description={'manage your Sizes'} />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedSizes} filterKey={'name'} />
      <Heading title="Api" description="Api calls for Sizes" />
      <ApiList entityName={'sizes'} entityIdName={'sizeId'} />
    </>
  );
}

export default SizeClient;
