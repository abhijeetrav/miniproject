"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { PricingSection } from "@/components/pricing-section"
import { BookingSection } from "@/components/booking-section"
import { Footer } from "@/components/footer"
import { ServicesModal } from "@/components/services-modal"
import { PricingModal } from "@/components/pricing-modal"
import { BookingModal } from "@/components/booking-modal"
import { ContactModal } from "@/components/contact-modal"
import { SchedulePickupModal } from "@/components/schedule-pickup-modal"
import { ViewServicesModal } from "@/components/view-services-modal"
import { DeliveryTrackingModal } from "@/components/delivery-tracking-modal"
import { CustomerChatbot } from "@/components/customer-chatbot"

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const openModal = (modalName: string) => {
    setActiveModal(modalName)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenModal={openModal} />
      <main>
        <HeroSection onOpenModal={openModal} />
        <ServicesSection />
        <PricingSection />
        <BookingSection />
      </main>
      <Footer />

      {activeModal === "services" && <ServicesModal onClose={closeModal} />}
      {activeModal === "pricing" && <PricingModal onClose={closeModal} />}
      {activeModal === "booking" && <BookingModal onClose={closeModal} />}
      {activeModal === "contact" && <ContactModal onClose={closeModal} />}
      {activeModal === "schedule-pickup" && <SchedulePickupModal onClose={closeModal} />}
      {activeModal === "view-services" && <ViewServicesModal onClose={closeModal} />}
      {activeModal === "track-delivery" && <DeliveryTrackingModal onClose={closeModal} />}

      <CustomerChatbot />
    </div>
  )
}
