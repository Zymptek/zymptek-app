import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Zymptek - B2B Trade Platform',
  description: 'Learn about how Zymptek uses cookies and similar technologies.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-200">Cookie Policy</h1>
          
          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">What Are Cookies</h2>
              <p className="mb-4 leading-relaxed">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">How We Use Cookies</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-brand-200">Essential Cookies</h3>
                  <p className="mb-2 leading-relaxed">
                    These cookies are necessary for the website to function properly. They enable core functionality such as security, account authentication, and remembering your preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-brand-200">Analytics Cookies</h3>
                  <p className="mb-2 leading-relaxed">
                    We use analytics cookies to understand how visitors interact with our website, helping us improve our services and user experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-brand-200">Functionality Cookies</h3>
                  <p className="mb-2 leading-relaxed">
                    These cookies allow the website to remember choices you make and provide enhanced features and content.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">Types of Cookies We Use</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li className="leading-relaxed">Session Cookies: Temporary cookies that expire when you close your browser</li>
                <li className="leading-relaxed">Persistent Cookies: Remain on your device for a set period</li>
                <li className="leading-relaxed">First-party Cookies: Set by our website</li>
                <li className="leading-relaxed">Third-party Cookies: Set by our partners and service providers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">Managing Cookies</h2>
              <p className="mb-4 leading-relaxed">
                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience using our website.
              </p>
              <div>
                <p className="mb-2 leading-relaxed">
                  To manage cookies in your browser:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="leading-relaxed">Chrome: Settings → Privacy and Security → Cookies</li>
                  <li className="leading-relaxed">Firefox: Options → Privacy & Security → Cookies</li>
                  <li className="leading-relaxed">Safari: Preferences → Privacy → Cookies</li>
                  <li className="leading-relaxed">Edge: Settings → Privacy & Security → Cookies</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">Updates to This Policy</h2>
              <p className="mb-4 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">Contact Us</h2>
              <p className="mb-4 leading-relaxed">
                If you have any questions about our Cookie Policy, please contact us at:
              </p>
              <div className="ml-6">
                <p>Email: info@zymptek.com</p>
                <p>Address: 308 Shivdhara Arcade, Kalol. Gandhinagar, India</p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-500 text-sm">
                Last Updated: February 6, 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 