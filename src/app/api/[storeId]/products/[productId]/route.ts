import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (!params.productId) {
      return new NextResponse('product id is required', { status: 400 });
    }

    const product = await db.product.findFirst({
      where: {
        id: params.productId,
      },
      include: {
        category: true,
        size: true,
        color: true,
        images: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(`PRODUCT_GET[id]`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string; productId: string } }) {
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

    if (!params.productId) {
      return new NextResponse('product id is required', { status: 400 });
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

    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name: name,
        price,
        images: {
          deleteMany: {},
        },
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        isFeatured,
        isArchived,
      },
    });

    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: images,
          },
        },
      },
    });

    if (!product) {
      return new NextResponse('product id is required', { status: 400 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.log(`PRODUCT_PATCH`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string; productId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse('product id is required', { status: 400 });
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
    const product = await db.product.delete({
      where: {
        id: params.productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log(`PRODUCT_DELETE`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
