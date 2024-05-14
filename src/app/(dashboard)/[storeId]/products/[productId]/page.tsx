import ProductForm from './components/ProductForm';
import db from '@/lib/prismadb';
import { Image } from '@prisma/client';
import React from 'react';

export type FORMATTEDPRODUCTTYPE = {
  id: string;
  name: string;
  price: number;
  isArchived: boolean;
  isFeatured: boolean;
  colorId: string;
  sizeId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  images: Image[];
};

async function ProductId({ params }: { params: { productId: string; storeId: string } }) {
  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  let formattedProduct: FORMATTEDPRODUCTTYPE | null = null;
  if (product) {
    formattedProduct = {
      id: product?.id as string,
      name: product?.name as string,
      price: parseFloat(product?.price.toString() as string) ?? 0,
      isArchived: product?.isArchived as boolean,
      isFeatured: product?.isFeatured as boolean,
      colorId: product?.colorId ?? '',
      sizeId: product?.sizeId ?? '',
      categoryId: product?.categoryId ?? '',
      createdAt: product?.createdAt?.toISOString() ?? '',
      updatedAt: product?.updatedAt?.toISOString() ?? '',
      images: [...product.images],
    };
  }
  return (
    <div className="p-8 pt-6 space-y-4 flex-1">
      <div>
        <ProductForm initialData={formattedProduct} categories={categories} colors={colors} sizes={sizes} />
      </div>
    </div>
  );
}

export default ProductId;
