import db from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const dynamic = 'force-dynamic'; // defaults to auto

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: corsHeaders,
    }
  );
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  const { productsIds } = await req.json();
  if (!productsIds || productsIds.length === 0) {
    return NextResponse.json({ error: 'No productsIds provided' }, { status: 400, headers: corsHeaders });
  }

  const products = await db.product.findMany({
    where: {
      id: {
        in: productsIds,
      },
    },
  });

  if (products.length !== productsIds.length) {
    return NextResponse.json({ error: 'Some products not found' }, { status: 400, headers: corsHeaders });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const product of products) {
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
      quantity: 1,
    });
  }

  const order = await db.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productsIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
