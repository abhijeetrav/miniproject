// app/api/update-status/route.ts
import { NextRequest } from "next/server";
import { dbAdmin } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status, progress, eta } = body;
    if (!orderId || typeof status !== "string") {
      return new Response(JSON.stringify({ error: "invalid payload" }), { status: 400 });
    }

    await dbAdmin.ref(`orders/${orderId}/status`).set({
      status,
      progress: typeof progress === "number" ? progress : 0,
      eta: typeof eta === "number" ? eta : null,
      updatedAt: Date.now(),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error("update-status error:", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
