import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { sizeId: string } }) {
  try {
    if (!params.sizeId) {
      return new NextResponse('Size id is required', { status: 400 });
    }

    const size = await db.size.findFirst({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log(`SIZE_GET[id]`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string; sizeId: string } }) {
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

    if (!params.sizeId) {
      return new NextResponse('size id is required', { status: 400 });
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

    const size = await db.size.update({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });
    if (!size) {
      return new NextResponse('size  is required', { status: 400 });
    }

    return NextResponse.json('');
  } catch (error) {
    console.log(`SIZE_PATCH`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string; sizeId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse('size id is required', { status: 400 });
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
    const size = await db.size.delete({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json('');
  } catch (error) {
    console.log(`SIZE_DELETE`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
