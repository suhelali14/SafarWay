import type React from "react"
import { MapPin, Instagram, Facebook, Twitter, Youtube } from "lucide-react"
import { Link } from "react-router-dom"


export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4 flex items-center">
              <MapPin className="mr-2 text-orange-400" />
              <span>SafarWay</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting travelers with verified tour operators for unforgettable journeys.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Instagram size={20} />} label="Instagram" />
              <SocialLink href="#" icon={<Facebook size={20} />} label="Facebook" />
              <SocialLink href="#" icon={<Twitter size={20} />} label="Twitter" />
              <SocialLink href="#" icon={<Youtube size={20} />} label="YouTube" />
            </div>
          </div>

          <FooterLinkGroup
            title="Quick Links"
            links={[
              { label: "Home", href: "#" },
              { label: "Packages", href: "#" },
              { label: "Top Destinations", href: "#" },
              { label: "List Your Package", href: "#" },
            ]}
          />

          <FooterLinkGroup
            title="Support"
            links={[
              { label: "Contact Us", href: "#" },
              { label: "FAQ", href: "#" },
              { label: "Terms & Conditions", href: "#" },
              { label: "Privacy Policy", href: "#" },
            ]}
          />

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@safarway.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: 123 Travel Street, Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SafarWay. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

interface SocialLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">
      {icon}
      <span className="sr-only">{label}</span>
    </a>
  )
}

interface FooterLinkGroupProps {
  title: string
  links: { label: string; href: string }[]
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link to={link.href} className="text-gray-400 hover:text-white transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

