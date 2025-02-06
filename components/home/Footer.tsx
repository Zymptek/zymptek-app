"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Loader2, Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone, ArrowRight } from 'lucide-react'

const Footer = () => {
  const [showTypeform, setShowTypeform] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (showTypeform) {
      const script = document.createElement('script');
      script.src = "//embed.typeform.com/next/embed.js";
      script.async = true;
      script.onload = () => setIsLoading(false);
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        setIsLoading(true);
      };
    }
  }, [showTypeform]);

  return (
    <footer className="bg-brand-200 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Zymptek</h3>
            <p className="text-sm mb-4">Connecting global businesses to Indian excellence since 2024. Our mission is to simplify and enhance international B2B trade.</p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/zymptek" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/zymptek" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/zymptek" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/zymptek" target="_blank" rel="noopener noreferrer" className="text-white hover:text-brand-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/products" className="hover:underline">Our Products</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="text-sm space-y-2">
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:underline">Cookie Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:underline">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@zymptek.com</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                <span>308 Shivdhara Arcade, Kalol. Gandhinagar, India</span>
              </div>
              <button 
                onClick={() => setShowTypeform(true)}
                className="mt-4 text-white hover:text-white border-2 border-white px-6 py-2 rounded-full text-sm hover:bg-brand-300 transition-colors inline-flex items-center"
              >
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-brand-300 text-center text-sm">
          <p>&copy; 2024 Zymptek. All rights reserved.</p>
        </div>
      </div>

      <Sheet open={showTypeform} onOpenChange={setShowTypeform}>
        <SheetContent side="right" className="w-full sm:w-3/4 lg:w-[75%] p-0 h-full bg-white">
          {isLoading && (
            <div className="w-full h-full flex items-center justify-center bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-brand-300" />
            </div>
          )}
          <div data-tf-live="01JHKNZ8W300RXPAD542EMZVJQ" className="h-full"></div>
        </SheetContent>
      </Sheet>
    </footer>
  )
}

export default Footer