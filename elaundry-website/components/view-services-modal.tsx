"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Zap, Shirt, Sparkles, Clock, Shield, Truck } from "lucide-react"

interface ViewServicesModalProps {
  onClose: () => void
}

export function ViewServicesModal({ onClose }: ViewServicesModalProps) {
  const services = [
    {
      icon: Shirt,
      name: "Wash & Fold",
      description: "Professional washing, drying, and folding of your everyday clothes",
      features: ["Eco-friendly detergents", "Fabric softener included", "Same-day service available"],
      price: "₹80/kg",
      duration: "24-48 hours",
    },
    {
      icon: Sparkles,
      name: "Dry Cleaning",
      description: "Expert dry cleaning for delicate fabrics and formal wear",
      features: ["Stain removal", "Professional pressing", "Garment protection"],
      price: "₹150/piece",
      duration: "48-72 hours",
    },
    {
      icon: Zap,
      name: "Express Service",
      description: "Quick turnaround for urgent laundry needs",
      features: ["4-hour service", "Priority handling", "Quality guaranteed"],
      price: "₹120/kg",
      duration: "4-6 hours",
    },
    {
      icon: Truck,
      name: "Pickup & Delivery",
      description: "Convenient doorstep pickup and delivery service",
      features: ["Free pickup", "Real-time tracking", "Flexible scheduling"],
      price: "Free with ₹500+ orders",
      duration: "As per service",
    },
  ]

  const additionalServices = [
    { name: "Shoe Cleaning", price: "₹200/pair" },
    { name: "Carpet Cleaning", price: "₹300/sqm" },
    { name: "Curtain Cleaning", price: "₹250/panel" },
    { name: "Blanket/Comforter", price: "₹400/piece" },
    { name: "Wedding Dress", price: "₹800/piece" },
    { name: "Leather Cleaning", price: "₹500/piece" },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Our Services</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div key={index} className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{service.name}</h3>
                      <p className="text-muted-foreground mb-4">{service.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {service.price}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {service.duration}
                          </div>
                        </div>

                        <ul className="space-y-1">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Shield className="h-3 w-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Additional Services</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {additionalServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="text-foreground">{service.name}</span>
                  <Badge variant="outline">{service.price}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary/5 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Service Guarantee</h4>
            <p className="text-sm text-muted-foreground">
              We guarantee 100% satisfaction with our services. If you're not happy with the quality, we'll redo the
              service free of charge or provide a full refund.
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Close
            </Button>
            <Button
              onClick={() => {
                onClose()
                // This would typically open the booking modal
              }}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Book Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
