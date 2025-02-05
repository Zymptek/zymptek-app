"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Loader2 } from 'lucide-react'

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
            <div>
              <h3 className="text-lg font-semibold mb-4">About Zymptek</h3>
              <p className="text-sm mb-4">Connecting global businesses to Indian excellence since 2023. Our mission is to simplify and enhance international B2B trade.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-brand-500 transition-colors"><i className="fab fa-facebook fa-lg"></i></a>
                <a href="#" className="text-white hover:text-brand-500 transition-colors"><i className="fab fa-twitter fa-lg"></i></a>
                <a href="#" className="text-white hover:text-brand-500 transition-colors"><i className="fab fa-linkedin fa-lg"></i></a>
                <a href="#" className="text-white hover:text-brand-500 transition-colors"><i className="fab fa-instagram fa-lg"></i></a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="text-sm space-y-2">
                <li><Link href="/about" className="hover:underline">About Us</Link></li>
                <li><Link href="/services" className="hover:underline">Our Services</Link></li>
                <li><Link href="/how-it-works" className="hover:underline">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
                <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="text-sm space-y-2">
                <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:underline">Cookie Policy</Link></li>
                <li><Link href="/disclaimer" className="hover:underline">Disclaimer</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-sm mb-2">Email: info@zymptek.com</p>
              <p className="text-sm mb-4">Address: 308 Shivdhara Arcade, Kalol. Gandhinagar, India</p>
              <button 
                onClick={() => setShowTypeform(true)}
                className="text-white hover:text-white border-2 border-white px-4 py-2 rounded-full text-sm hover:bg-brand-300 transition-colors"
              >
                Get in Touch
              </button>
            </div>
          </div>
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