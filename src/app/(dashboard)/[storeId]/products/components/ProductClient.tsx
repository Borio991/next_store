'use client';
import { ProductColumn, columns } from './columns';
import Heading from '@/components/Heading';
import ApiList from '@/components/ui/ApiList';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

type Props = {
  products: ProductColumn[];
};

function ProductClient({ products }: Props) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Products (${products.length})`} description={'manage your products'} />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={products} filterKey={'name'} />
      <Heading title="Api" description="Api calls for Producs" />
      <ApiList entityName={'products'} entityIdName={'productId'} />
    </>
  );
}

export default ProductClient;
