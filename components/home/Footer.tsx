import React from 'react'
import Link from 'next/link'

const Footer = () => {
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
              <p className="text-sm mb-2">Phone: +91 123 456 7890</p>
              <p className="text-sm mb-4">Address: 123 Business Street, Tech Park, Bangalore, India 560001</p>
              <Link href="/contact" className="text-white hover:text-white border-2 border-white px-4 py-2 rounded-full text-sm hover:bg-brand-300 transition-colors">Get in Touch</Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-brand-300 text-center text-sm">
            <p>&copy; 2023 Zymptek. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer