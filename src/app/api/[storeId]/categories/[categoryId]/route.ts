import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { categoryId: string } }) {
  try {
    if (!params.categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    const category = await db.category.findFirst({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(`CATEGORY_GET[id]`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string; categoryId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    const body = await req.json();
    const { name, billboardId } = body;
    if (!name) {
      return new NextResponse('name is required', { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse('billboard id is required', { status: 400 });
    }

    if (!params.categoryId) {
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

    const category = await db.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    if (!category) {
      return new NextResponse('category id is required', { status: 400 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.log(`CATEGORY_PATCH`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string; categoryId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.categoryId) {
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
    await db.category.delete({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json('');
  } catch (error) {
    console.log(`CATEGORY_DELETE`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
