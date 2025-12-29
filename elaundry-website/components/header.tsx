"use client"

import { Button } from "@/components/ui/button"
import { Shirt, MapPin } from "lucide-react"

interface HeaderProps {
  onOpenModal: (modalName: string) => void
}

export function Header({ onOpenModal }: HeaderProps) {
  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <Shirt className="h-6 w-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">eLaundry</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onOpenModal("track-delivery")}
              className="flex items-center gap-1 text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-primary/5"
            >
              <MapPin className="h-4 w-4" />
              Track Delivery
            </button>
            <button
              onClick={() => onOpenModal("services")}
              className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-primary/5"
            >
              Services
            </button>
            <button
              onClick={() => onOpenModal("pricing")}
              className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-primary/5"
            >
              Pricing
            </button>
            <button
              onClick={() => onOpenModal("booking")}
              className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-primary/5"
            >
              Book Now
            </button>
            <button
              onClick={() => onOpenModal("contact")}
              className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-primary/5"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center">
            <Button
              onClick={() => onOpenModal("booking")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
