import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shirt, Sparkles, Zap, Shield, Clock, Truck } from "lucide-react"

const services = [
  {
    icon: Shirt,
    title: "Wash & Fold",
    description: "Professional washing, drying, and folding of your everyday clothes with premium detergents.",
    features: ["Eco-friendly detergents", "Fabric softener included", "Careful sorting by color"],
    color: "primary",
  },
  {
    icon: Sparkles,
    title: "Dry Cleaning",
    description: "Expert dry cleaning for delicate fabrics, suits, dresses, and special garments.",
    features: ["Stain removal", "Professional pressing", "Garment protection"],
    color: "secondary",
  },
  {
    icon: Zap,
    title: "Ironing Service",
    description: "Crisp, professional ironing and pressing to keep your clothes looking their best.",
    features: ["Steam pressing", "Crease removal", "Hanger service available"],
    color: "accent",
  },
  {
    icon: Shield,
    title: "Stain Removal",
    description: "Specialized treatment for tough stains using advanced cleaning techniques.",
    features: ["Pre-treatment analysis", "Safe for all fabrics", "95% success rate"],
    color: "primary",
  },
  {
    icon: Clock,
    title: "Express Service",
    description: "Need it fast? Our express service delivers your laundry within 24 hours.",
    features: ["Same-day pickup", "24-hour turnaround", "Priority processing"],
    color: "secondary",
  },
  {
    icon: Truck,
    title: "Pickup & Delivery",
    description: "Convenient free pickup and delivery service right to your doorstep.",
    features: ["Flexible scheduling", "SMS notifications", "Contactless service"],
    color: "accent",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Our Professional Services</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            From everyday laundry to specialized cleaning, we provide comprehensive care for all your garments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-xl hover:border-primary/20 transition-all duration-300 group"
            >
              <CardHeader>
                <div
                  className={`w-12 h-12 ${
                    index % 3 === 0
                      ? "bg-primary/10 border-primary/20"
                      : index % 3 === 1
                        ? "bg-secondary/10 border-secondary/20"
                        : "bg-accent/10 border-accent/20"
                  } rounded-lg flex items-center justify-center mb-4 border group-hover:scale-110 transition-transform`}
                >
                  <service.icon
                    className={`h-6 w-6 ${
                      index % 3 === 0 ? "text-primary" : index % 3 === 1 ? "text-secondary" : "text-accent"
                    }`}
                  />
                </div>
                <CardTitle className="text-xl text-card-foreground">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-1.5 h-1.5 ${
                          index % 3 === 0 ? "bg-primary" : index % 3 === 1 ? "bg-secondary" : "bg-accent"
                        } rounded-full flex-shrink-0`}
                      />
                      <span className="text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
