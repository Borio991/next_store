import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse('name is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 });
    }

    const store = await db.store.update({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log(`STORE_PATCH`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse('store id is required', { status: 400 });
    }

    const store = await db.store.delete({
      where: {
        id: params.storeId,
        userId,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log(`STORE_DELETE`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
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
    return NextResponse.json(store);
  } catch (error) {
    console.log(`STORE_GET`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
