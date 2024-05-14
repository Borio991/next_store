import { StoreFormSchema } from '@/components/modals/store-modal';
import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Not Authorized', { status: 401 });
    }

    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse('name field is required', { status: 400 });
    }

    const store = await db.store.create({
      data: {
        name,
        userId,
      },
    });
    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error('[STORES_POST] :', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse('Not Authorized', { status: 401 });
  }

  try {
    const stores = await db.store.findMany({
      where: {
        userId,
      },
    });
    return NextResponse.json(stores);
  } catch (error) {
    console.log('[STORE_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
