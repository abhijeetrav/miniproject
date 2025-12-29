"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Truck } from "lucide-react"

interface HeroSectionProps {
  onOpenModal: (modalName: string) => void
}

export function HeroSection({ onOpenModal }: HeroSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted to-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight text-slate-900">
                Professional Laundry Services at Your <span className="text-primary">Doorstep</span>
              </h1>
              <p className="text-xl text-slate-700 text-pretty leading-relaxed">
                Experience the convenience of premium laundry services with free pickup and delivery. We handle your
                clothes with care while you focus on what matters most.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                onClick={() => onOpenModal("schedule-pickup")}
              >
                Schedule Pickup
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                onClick={() => onOpenModal("view-services")}
              >
                View Services
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">Professional Care</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                <Clock className="h-6 w-6 text-secondary flex-shrink-0" />
                <span className="text-sm font-medium">24-48 Hour Service</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                <Truck className="h-6 w-6 text-accent flex-shrink-0" />
                <span className="text-sm font-medium">Free Pickup & Delivery</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="/professional-laundry-service-with-clean-folded-clo.jpg"
              alt="Professional laundry service"
              className="rounded-lg shadow-2xl w-full h-auto"
            />
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-lg p-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">5000+ Happy Customers</p>
                  <p className="text-sm text-muted-foreground">Trusted since 2020</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
