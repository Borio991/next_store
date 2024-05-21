import db from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
  try {
    if (!params.billboardId) {
      return new NextResponse('billboard id is required', { status: 400 });
    }

    const billboard = await db.billboard.findFirst({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`BLLBOARD_GET[id]`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string; billboardId: string } }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }
    const body = await req.json();
    const { label, imageUrl } = body;
    if (!label) {
      return new NextResponse('label is required', { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse('imageUrl is required', { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse('billboard id is required', { status: 400 });
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

    const billboard = await db.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label: label,
        imageUrl: imageUrl,
      },
    });
    if (!billboard) {
      return new NextResponse('billboard id is required', { status: 400 });
    }

    return NextResponse.json('');
  } catch (error) {
    console.log(`BILLBOARD_PATCH`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { storeId: string; billboardId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse('billboard id is required', { status: 400 });
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
    const billboard = await db.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log(`BLLBOARD_DELETE`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
