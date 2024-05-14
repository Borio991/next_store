import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { storeId: string; billboardId: string } }) {
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
      return new NextResponse('billboard label is required', { status: 400 });
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

    const category = await db.category.create({
      data: {
        name,
        billboardId: billboardId,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log(`CATEGORY_POST`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 });
    }

    const categories = await db.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.log(`CATEGORY_GET`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
