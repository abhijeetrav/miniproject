"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Check } from "lucide-react"
import { useState } from "react"
import { PaymentModal } from "./payment-modal"

interface PricingModalProps {
  onClose: () => void
}

export function PricingModal({ onClose }: PricingModalProps) {
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  const handleChoosePlan = (plan: any) => {
    setSelectedPlan(plan)
    setShowPayment(true)
  }

  const plans = [
    {
      name: "Basic",
      price: "₹199",
      amount: 199,
      period: "per load",
      description: "Perfect for individuals and small families",
      features: ["Wash & Fold service", "Standard detergent", "48-hour turnaround", "Basic stain removal"],
    },
    {
      name: "Premium",
      price: "₹299",
      amount: 299,
      period: "per load",
      description: "Enhanced service with premium care",
      features: [
        "Wash & Fold + Dry Cleaning",
        "Premium detergent & softener",
        "24-hour turnaround",
        "Advanced stain removal",
        "Fabric protection",
        "Free pickup & delivery",
      ],
      popular: true,
    },
    {
      name: "Deluxe",
      price: "₹499",
      amount: 499,
      period: "per load",
      description: "Complete laundry solution with luxury care",
      features: [
        "All Premium features",
        "Express 12-hour service",
        "Luxury fabric care",
        "Professional pressing",
        "Garment repairs",
        "Priority scheduling",
      ],
    },
  ]

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-foreground">Pricing Plans</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <Card key={index} className={`border-border relative ${plan.popular ? "ring-2 ring-primary" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-foreground">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-primary">
                      {plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleChoosePlan(plan)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Choose Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPayment && selectedPlan && (
        <PaymentModal
          onClose={() => {
            setShowPayment(false)
            onClose()
          }}
          orderDetails={{
            service: "Laundry Service",
            plan: selectedPlan.name,
            amount: selectedPlan.amount,
          }}
        />
      )}
    </>
  )
}
