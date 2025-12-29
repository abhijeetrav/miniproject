import { Shirt, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer
      id="contact"
      className="!bg-slate-900 text-white relative overflow-hidden"
      style={{ backgroundColor: "#0f172a" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-amber-500/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-cyan-500/20 to-amber-500/20 rounded-lg backdrop-blur-sm border border-white/10">
              <Shirt className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400" style={{ color: "#22d3ee" }}>
                eLaundry
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Professional laundry services with convenient pickup and delivery. We care for your clothes like they're
              our own.
            </p>
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="outline"
                className="p-2 bg-white/5 border-white/20 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
              >
                <Facebook className="h-4 w-4 text-cyan-400" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="p-2 bg-white/5 border-white/20 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
              >
                <Twitter className="h-4 w-4 text-cyan-400" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="p-2 bg-white/5 border-white/20 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300"
              >
                <Instagram className="h-4 w-4 text-cyan-400" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-cyan-400/30 pb-2">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-white hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-cyan-400 rounded-full group-hover:bg-amber-400 transition-colors duration-300"></span>
                  Wash & Fold
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-cyan-400 rounded-full group-hover:bg-amber-400 transition-colors duration-300"></span>
                  Dry Cleaning
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-cyan-400 rounded-full group-hover:bg-amber-400 transition-colors duration-300"></span>
                  Ironing Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-cyan-400 rounded-full group-hover:bg-amber-400 transition-colors duration-300"></span>
                  Stain Removal
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-cyan-400 rounded-full group-hover:bg-amber-400 transition-colors duration-300"></span>
                  Express Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-cyan-400 rounded-full group-hover:bg-amber-400 transition-colors duration-300"></span>
                  Pickup & Delivery
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3
              className="text-lg font-semibold !text-white border-b border-cyan-400/30 pb-2"
              style={{ color: "#ffffff" }}
            >
              Contact Us
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="p-1 bg-cyan-500/20 rounded">
                  <Phone className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                </div>
                <span className="text-gray-300">+91-9696189283</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="p-1 bg-cyan-500/20 rounded">
                  <Mail className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                </div>
                <span className="text-gray-300">info@elaundry.com</span>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="p-1 bg-cyan-500/20 rounded">
                  <MapPin className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                </div>
                <span className="text-gray-300">
                  Rajkiya Engineering College,Chandpur
                  <br />
                  Bijnor City, 246725
                </span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3
              className="text-lg font-semibold !text-white border-b border-cyan-400/30 pb-2"
              style={{ color: "#ffffff" }}
            >
              Stay Updated
            </h3>
            <p className="text-sm !text-gray-200" style={{ color: "#e5e7eb" }}>
              Subscribe to get special offers and laundry tips.
            </p>
            <div className="space-y-2 p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20"
              />
              <Button
                className="w-full !bg-gradient-to-r !from-cyan-500 !to-amber-500 !text-white hover:from-cyan-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                style={{ backgroundColor: "#0891b2", color: "#ffffff" }}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gradient-to-r from-cyan-500/30 via-white/20 to-amber-500/30 mt-12 pt-8 bg-gradient-to-r from-transparent via-white/5 to-transparent">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2025 eLaundry. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-amber-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors duration-300">
                FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
