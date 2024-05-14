import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    const body = await req.json();
    const { name, price, isArchived, isFeatured, categoryId, colorId, sizeId, images } = body;
    if (!name) {
      return new NextResponse('name is required', { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse('images are required', { status: 400 });
    }
    if (!price) {
      return new NextResponse('price is required', { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse('size id is required', { status: 400 });
    }
    if (!colorId) {
      return new NextResponse('color id is required', { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse('category id is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 });
    }

    const store = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!store) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const product = await db.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isArchived,
        isFeatured,
        images: {
          createMany: {
            data: images,
          },
        },
        storeId: params.storeId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(`PRODUCT_POST`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 });
    }

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        category: true,
        color: true,
        images: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log(`PRODUCT_GET`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
