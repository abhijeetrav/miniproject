// // app/api/book/route.ts
// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { insert } from "@/lib/db";

// import Razorpay from 'razorpay';

// const rzp = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     // server-side price calc (never trust client)
//     const amountInPaise = 19900; // example



//     // save the database in the  backend 
//        const bookingId = await insert(
//       `INSERT INTO bookings 
//       (name, phone, email, address, service_type, pricing_plan, pickup_date, pickup_time, instructions, amount_in_paise)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         body.name,
//         body.phone,
//         body.email,
//         body.address,
//         body.service_type,
//         body.pricing_plan,
//         body.pickup_date,
//         body.pickup_time,
//         body.instructions,
//         amountInPaise,
//       ]
//     );

//     const booking = await prisma.booking.create({
//       data: {
//         name: body.name,
//         phone: body.phone,
//         email: body.email,
//         address: body.address,
//         service_type: body.service_type,
//         pricing_plan: body.pricing_plan,
//         pickup_date: body.pickup_date ? new Date(body.pickup_date) : null,
//         pickup_time: body.pickup_time || null,
//         instructions: body.instructions || null,
//         amountInPaise
//       }
//     });

//     const order = await rzp.orders.create({
//       amount: amountInPaise,
//       currency: 'INR',
//       receipt: `booking_rcpt_${booking.id}`,
//       payment_capture: true, //// replaced by 1
//     });

//     // save razorpay order id
//     await prisma.booking.update({
//       where: { id: booking.id },
//       data: { razorpayOrderId: order.id }
//     });

//     return NextResponse.json({
//       ok: true,
//       bookingId: booking.id,
//       orderId: order.id,
//       amount: amountInPaise,
//       currency: 'INR',
//       razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 });
//   }
// }



//////////new source code
// app/api/book/route.ts

import { NextResponse } from "next/server";
import { insert, execute } from "@/lib/db";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Calculate amount
    const amountInPaise = 19900; // Replace with real logic

    // 1) Save booking into database
    const bookingId = await insert(
      `INSERT INTO bookings 
      (name, phone, email, address, service_type, pricing_plan, pickup_date, pickup_time, instructions, amount_in_paise)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.name,
        body.phone,
        body.email,
        body.address,
        body.service_type,
        body.pricing_plan,
        body.pickup_date,
        body.pickup_time,
        body.instructions,
        amountInPaise,
      ]
    );

    // 2) Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `booking_rcpt_${bookingId}`,
      payment_capture: true,
    });

    // 3) Save razorpay order id in db
    await execute(
      "UPDATE bookings SET razorpay_order_id=? WHERE id=?",
      [order.id, bookingId]
    );

    // 4) Return order + booking id to frontend
    return NextResponse.json({
      ok: true,
      bookingId,
      orderId: order.id,
      amount: amountInPaise,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
