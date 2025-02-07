import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer | Zymptek - B2B Trade Platform',
  description: 'Important disclaimers and limitations regarding the use of Zymptek\'s B2B trade platform.',
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-200">Disclaimer</h1>
          
          <div className="space-y-8 text-gray-600">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">General Disclaimer</h2>
              <p className="mb-4 leading-relaxed">
                The information provided on Zymptek is for general informational purposes only. While we strive to keep the information up to date and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the platform or the information, products, services, or related graphics contained on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">No Warranty</h2>
              <p className="mb-4 leading-relaxed">
                The platform is provided "as is" without any warranty of any kind. Zymptek does not warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="leading-relaxed">The platform will be constantly available or available at all</li>
                <li className="leading-relaxed">The information on this platform is complete, true, accurate, or non-misleading</li>
                <li className="leading-relaxed">The platform will be secure or free from bugs or viruses</li>
                <li className="leading-relaxed">The quality of products or services obtained through the platform will meet your expectations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">Third-Party Content</h2>
              <p className="mb-4 leading-relaxed">
                Our platform may contain links to external websites or content provided by third parties. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">Business Decisions</h2>
              <p className="mb-4 leading-relaxed">
                Any reliance you place on information or services provided through our platform is strictly at your own risk. You should always:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="leading-relaxed">Conduct your own due diligence before making business decisions</li>
                <li className="leading-relaxed">Verify information independently</li>
                <li className="leading-relaxed">Seek professional advice when necessary</li>
                <li className="leading-relaxed">Review all terms and conditions before entering into any transaction</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">Limitation of Liability</h2>
              <p className="mb-4 leading-relaxed">
                In no event shall Zymptek be liable for any direct, indirect, incidental, consequential, special, or exemplary damages, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="leading-relaxed">Loss of profits, revenue, or data</li>
                <li className="leading-relaxed">Business interruption</li>
                <li className="leading-relaxed">Personal or business losses</li>
                <li className="leading-relaxed">Any other commercial damages or losses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">Changes to Platform</h2>
              <p className="mb-4 leading-relaxed">
                We reserve the right to modify, suspend, or discontinue any aspect of the platform at any time without notice. We are not liable to you or any third party for any such modification, suspension, or discontinuation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-brand-200">Contact Information</h2>
              <p className="mb-4 leading-relaxed">
                If you have any questions about this Disclaimer, please contact us at:
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