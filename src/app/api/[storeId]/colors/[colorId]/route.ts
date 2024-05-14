import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { colorId: string } }) {
  try {
    if (!params.colorId) {
      return new NextResponse('Color id is required', { status: 400 });
    }

    const color = await db.color.findFirst({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log(`Color_GET[id]`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string; colorId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    const body = await req.json();
    const { name, value } = body;
    if (!name) {
      return new NextResponse('Color name is required', { status: 400 });
    }
    if (!value) {
      return new NextResponse('Color value is required', { status: 400 });
    }

    if (!params.colorId) {
      return new NextResponse('Color id is required', { status: 400 });
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

    const color = await db.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });
    if (!color) {
      return new NextResponse('Color  is required', { status: 400 });
    }

    return NextResponse.json('');
  } catch (error) {
    console.log(`COLOR_PATCH`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string; colorId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse('Color id is required', { status: 400 });
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
    const color = await db.color.delete({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json('');
  } catch (error) {
    console.log(`COLOR_DELETE`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
