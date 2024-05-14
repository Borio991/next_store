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
    const { name, value } = body;
    if (!name) {
      return new NextResponse('size name is required', { status: 400 });
    }
    if (!value) {
      return new NextResponse('size value is required', { status: 400 });
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

    const size = await db.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log(`SIZE_POST`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 });
    }

    const sizes = await db.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(sizes);
  } catch (error) {
    console.log(`SIZE_GET`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
