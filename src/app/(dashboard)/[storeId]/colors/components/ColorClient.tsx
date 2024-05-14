'use client';
import { columns } from './columns';
import Heading from '@/components/Heading';
import ApiList from '@/components/ui/ApiList';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { Color } from '@prisma/client';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type Props = {
  colors: Color[];
};

function SizeClient({ colors }: Props) {
  const router = useRouter();
  const params = useParams();

  const formattedColors = colors.map((color) => {
    return {
      id: color.id,
      name: color.name,
      value: color.value,
      createdAt: color.createdAt.toDateString(),
    };
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Colors (${formattedColors.length})`} description={'manage your Colors'} />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={formattedColors} filterKey={'name'} />
      <Heading title="Api" description="Api calls for Colors" />
      <ApiList entityName={'colors'} entityIdName={'colorId'} />
    </>
  );
}

export default SizeClient;
