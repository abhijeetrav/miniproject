async function payNow(amount) {
  const response = await fetch("http://localhost:5000/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  const order = await response.json();

  const options = {
    key: "YOUR_RAZORPAY_KEY_ID", // same as in Razorpay Dashboard
    amount: order.amount,
    currency: "INR",
    name: "Laundry Service",
    description: "Order Payment",
    order_id: order.id,
    handler: function (response) {
      alert("✅ Payment Successful!\nPayment ID: " + response.razorpay_payment_id);
    },
    theme: { color: "#3399cc" },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

document.getElementById("payButton").addEventListener("click", () => payNow(149));
