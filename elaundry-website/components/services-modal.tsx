"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Zap, Shirt, Truck } from "lucide-react"

interface ServicesModalProps {
  onClose: () => void
}

export function ServicesModal({ onClose }: ServicesModalProps) {
  const services = [
    {
      icon: Shirt,
      title: "Wash & Fold",
      description: "Professional washing and folding service for your everyday clothes",
      features: ["Premium detergents", "Fabric softener included", "24-48 hour turnaround", "Eco-friendly process"],
    },
    {
      icon: Zap,
      title: "Dry Cleaning",
      description: "Expert dry cleaning for delicate fabrics and formal wear",
      features: ["Specialized solvents", "Stain removal", "Professional pressing", "Garment protection"],
    },
    {
      icon: Truck,
      title: "Pickup & Delivery",
      description: "Convenient doorstep service for your busy lifestyle",
      features: ["Free pickup & delivery", "Flexible scheduling", "Real-time tracking", "Contactless service"],
    },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-foreground">Our Services</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="border-border">
                <CardHeader className="text-center">
                  <service.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-foreground">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
