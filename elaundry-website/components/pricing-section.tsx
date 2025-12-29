import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const pricingPlans = [
  {
    name: "Basic",
    price: "₹199",
    period: "per load",
    description: "Perfect for individuals and small households",
    features: [
      "Wash & fold service",
      "Standard detergent",
      "Free pickup & delivery",
      "48-hour turnaround",
      "Basic stain treatment",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "₹299",
    period: "per load",
    description: "Enhanced care for your valuable garments",
    features: [
      "Wash & fold service",
      "Premium eco-friendly detergent",
      "Free pickup & delivery",
      "24-hour turnaround",
      "Advanced stain removal",
      "Fabric softener included",
      "Garment inspection",
    ],
    popular: true,
  },
  {
    name: "Luxury",
    price: "₹499",
    period: "per load",
    description: "White-glove service for the finest care",
    features: [
      "Wash & fold service",
      "Luxury detergent & softener",
      "Priority pickup & delivery",
      "Same-day service available",
      "Professional stain removal",
      "Hand-finished pressing",
      "Garment protection",
      "Quality guarantee",
    ],
    popular: false,
  },
]

const additionalServices = [
  { service: "Dry Cleaning (per item)", price: "₹120-250" },
  { service: "Ironing (per item)", price: "₹50-80" },
  { service: "Express Service (24hr)", price: "+₹150" },
  { service: "Stain Removal (specialty)", price: "₹80-200" },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Choose the service level that fits your needs. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative bg-card border-border ${plan.popular ? "ring-2 ring-primary" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-card-foreground">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    {plan.price}
                    <span className="text-lg text-muted-foreground font-normal">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-card-foreground">Additional Services</CardTitle>
            <CardDescription>Enhance your laundry experience with our specialized services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {additionalServices.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
                >
                  <span className="text-card-foreground">{item.service}</span>
                  <span className="font-semibold text-primary">{item.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
