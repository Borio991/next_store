'use client';
import { CategoryColumn, columns } from './columns';
import Heading from '@/components/Heading';
import ApiList from '@/components/ui/ApiList';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type Props = {
  categories: CategoryColumn[];
};

function CategoryClient({ categories }: Props) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Categories (${categories.length})`} description={'manage your Categories'} />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={categories} filterKey={'name'} />
      <Heading title="Api" description="Api calls for Categories" />
      <ApiList entityName={'categories'} entityIdName={'categoryId'} />
    </>
  );
}

export default CategoryClient;
