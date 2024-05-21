import db from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;
  console.log('signature', signature);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.log(err);
    return new Response('Webhook Error', { status: 400 });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;
  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((x) => x !== null).join(', ');
  if (event.type === 'checkout.session.completed') {
    const order = await db.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session.customer_details?.phone || '',
      },
      include: {
        orderItems: true,
      },
    });
    const productIds = order.orderItems.map((orderItem) => orderItem.productId);
    await db.product.updateMany({
      where: {
        id: {
          in: productIds,
        },
      },
      data: {
        isArchived: true,
      },
    });
  }
  return new NextResponse(null, { status: 200 });
}
