import db from '@/lib/prismadb';
import ProductClient from './components/ProductClient';
import { formatter } from '@/lib/utils';
import { ProductColumn } from '@/app/(dashboard)/[storeId]/products/components/columns';

async function ProductPage({ params }: { params: { storeId: string } }) {
  const products = await db.product.findMany({
    where: {
      storeId: params.storeId,
      isArchived: false,
    },
    include: {
      category: true,
      color: true,
      size: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedProducts: ProductColumn[] = products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      price: formatter.format(product.price.toNumber()),
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
      category: product.category.name,
      size: product.size.name,
      color: product.color.value,
      createdAt: product.createdAt.toDateString(),
    };
  });

  return (
    <div className="p-8 pt-6 space-y-4 flex-1">
      <ProductClient products={formattedProducts} />
    </div>
  );
}

export default ProductPage;
