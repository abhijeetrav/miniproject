// app/api/verify/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
    return NextResponse.json({ ok: false, error: 'missing params' }, { status: 400 });
  }

  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');

  if (expected === razorpay_signature) {
    await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: { status: 'paid', razorpayPaymentId: razorpay_payment_id }
    });
    return NextResponse.json({ ok: true });
  } else {
    await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: { status: 'failed' }
    });
    return NextResponse.json({ ok: false, error: 'signature mismatch' }, { status: 400 });
  }
}
