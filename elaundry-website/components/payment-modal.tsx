"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X, CreditCard, Smartphone, Wallet, Shield, CheckCircle } from "lucide-react"
interface PaymentModalProps {
  onClose: () => void
  orderDetails: {
    service: string
    plan: string
    amount: number
  }
}
export function PaymentModal({ onClose, orderDetails }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentSuccess(true)

      // Auto close after success
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 2000)
  }

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-lg max-w-md w-full p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-4">Your booking has been confirmed. We'll contact you shortly.</p>
          <Button onClick={onClose} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Complete Payment</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="text-foreground">{orderDetails.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan:</span>
                <span className="text-foreground">{orderDetails.plan}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-foreground">Total Amount:</span>
                  <span className="text-primary text-xl">₹{orderDetails.amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Choose Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                {/* UPI Payment */}
                <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">UPI Payment</div>
                      <div className="text-sm text-muted-foreground">Pay using any UPI app</div>
                    </div>
                  </Label>
                </div>

                {/* Google Pay */}
                <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="googlepay" id="googlepay" />
                  <Label htmlFor="googlepay" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Google Pay</div>
                      <div className="text-sm text-muted-foreground">Quick & secure payment</div>
                    </div>
                  </Label>
                </div>

                {/* PhonePe */}
                <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="phonepe" id="phonepe" />
                  <Label htmlFor="phonepe" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">PhonePe</div>
                      <div className="text-sm text-muted-foreground">Pay with PhonePe wallet</div>
                    </div>
                  </Label>
                </div>

                {/* Paytm */}
                <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="paytm" id="paytm" />
                  <Label htmlFor="paytm" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Paytm</div>
                      <div className="text-sm text-muted-foreground">Pay using Paytm wallet</div>
                    </div>
                  </Label>
                </div>

                {/* Credit/Debit Card */}
                <div className="flex items-center space-x-2 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {/* UPI ID Input */}
              {paymentMethod === "upi" && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="upi-id">Enter UPI ID</Label>
                  <Input
                    id="upi-id"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@paytm / yourname@googlepay"
                    className="w-full"
                  />
                </div>
              )}

              {/* Card Details */}
              {paymentMethod === "card" && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input id="card-name" placeholder="Name on card" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
            <div className="text-sm text-muted-foreground">
              Your payment information is encrypted and secure. We use industry-standard security measures.
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing || (paymentMethod === "upi" && !upiId)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing Payment...
              </div>
            ) : (
              `Pay ₹${orderDetails.amount}`
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
