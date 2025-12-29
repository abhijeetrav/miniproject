// app/api/update-location/route.ts
import { NextRequest } from "next/server";
import { dbAdmin } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, lat, lng } = body;
    if (!orderId || typeof lat !== "number" || typeof lng !== "number") {
      return new Response(JSON.stringify({ error: "invalid payload" }), { status: 400 });
    }

    await dbAdmin.ref(`orders/${orderId}/location`).set({ lat, lng, updatedAt: Date.now() });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error("update-location error:", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
