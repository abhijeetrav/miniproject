


////////////////////////////////////
// BookingModal.tsx (only the component with updated handleSubmit)
// Install types if desired: npm i -D @types/razorpay (optional)

import React, { FormEvent, useState } from "react";

type BookingForm = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  service_type?: string;
  pricing_plan?: string;
  pickup_date?: string;   // yyyy-mm-dd
  pickup_time?: string;   // HH:MM
  instructions?: string;
};

type BookResponse = {
  ok: boolean;
  bookingId?: number;
  amount?: number;     // paise
  orderId?: string;
  key?: string;
  error?: string;
};

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function BookingModal({ onClose }: { onClose?: () => void }) {
  const [form, setForm] = useState<BookingForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    service_type: "",
    pricing_plan: "",
    pickup_date: "",
    pickup_time: "",
    instructions: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  }

  async function loadRazorpayScript(): Promise<boolean> {
    if (window.Razorpay) return true;
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => reject(false);
      document.body.appendChild(s);
    });
  }

  // helper: get price from server (optional). Server returns price in rupees.
  async function fetchPrice(service?: string, plan?: string): Promise<number | null> {
    try {
      const q = new URLSearchParams();
      if (service) q.set("service", service);
      if (plan) q.set("plan", plan);
      const res = await fetch("/api/pricing?" + q.toString());
      if (!res.ok) return null;
      const j = await res.json();
      // expecting { ok:true, price_in_rupees: 199 } or similar
      if (j.ok && typeof j.price_in_rupees === "number") return j.price_in_rupees;
      return null;
    } catch (err) {
      console.warn("pricing fetch failed", err);
      return null;
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    // basic client validation
    if (!form.name?.trim()) {
      alert("Please enter full name");
      setLoading(false);
      return;
    }
    if (!form.phone?.trim()) {
      alert("Please enter phone number");
      setLoading(false);
      return;
    }
    if (!form.address?.trim()) {
      alert("Please enter pickup address");
      setLoading(false);
      return;
    }
    // optional: validate pickup_date/time format if needed

    try {
      // 0) try to get price from server by selected plan or service
      let amountInPaise: number | null = null;
      const serverPrice = await fetchPrice(form.service_type, form.pricing_plan);
      if (serverPrice !== null) {
        amountInPaise = Math.round(serverPrice * 100);
      } else {
        // fallback default (server should override ideally)
        amountInPaise = 19900; // ₹199 default
      }

      // 1) create booking on server (server can also compute amount itself)
      // Pass amount_in_rupees optionally, but best practice: server should calculate price
      const payload = {
        ...form,
        amount_in_rupees: Math.round((amountInPaise || 0) / 100),
      };

      const resp = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: BookResponse = await resp.json();
      if (!data.ok) throw new Error(data.error || "Could not create booking");

      // 2) If server returned a Razorpay order, create checkout
      if (data.orderId && window.Razorpay) {
        await loadRazorpayScript();

        const options = {
          key: data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount ?? amountInPaise,
          currency: "INR",
          order_id: data.orderId,
          name: "Your Laundry Service",
          description: `Booking #${data.bookingId}`,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          handler: async (paymentResult: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; }) => {
            try {
              // 3) verify payment on server
              const verifyResp = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: paymentResult.razorpay_order_id,
                  razorpay_payment_id: paymentResult.razorpay_payment_id,
                  razorpay_signature: paymentResult.razorpay_signature,
                  bookingId: data.bookingId,
                }),
              });
              const verifyJson = await verifyResp.json();
              if (verifyJson.ok) {
                alert("Payment successful & booking confirmed!");
                setLoading(false);
                onClose?.();
              } else {
                alert("Payment verification failed: " + (verifyJson.error || ""));
                setLoading(false);
              }
            } catch (err) {
              console.error("verify error:", err);
              alert("Payment verification error. Contact support.");
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              // user closed the checkout
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp: any) {
          console.error("payment.failed", resp);
          alert("Payment failed. Please try again or contact support.");
          setLoading(false);
        });
        rzp.open();
      } else {
        // No payment step (cash on delivery / free / server handled payment)
        alert("Booking saved successfully! Booking ID: " + data.bookingId);
        setLoading(false);
        onClose?.();
      }
    } catch (err: any) {
      console.error("booking error:", err);
      alert(err.message || "Failed to create booking. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="booking-modal">
      <form onSubmit={handleSubmit}>
        {/* Replace the following inputs with your modal markup and classes */}
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        <textarea name="address" value={form.address} onChange={handleChange} placeholder="Pickup address" required />
        <select name="service_type" value={form.service_type} onChange={handleChange}>
          <option value="">Select service</option>
          <option value="wash">Wash</option>
          <option value="dryclean">Dry Clean</option>
          <option value="iron">Iron</option>
        </select>
        <select name="pricing_plan" value={form.pricing_plan} onChange={handleChange}>
          <option value="">Select plan</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
        </select>
        <input name="pickup_date" type="date" value={form.pickup_date} onChange={handleChange} />
        <input name="pickup_time" type="time" value={form.pickup_time} onChange={handleChange} />
        <textarea name="instructions" value={form.instructions} onChange={handleChange} placeholder="Special instructions (optional)" />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
}
