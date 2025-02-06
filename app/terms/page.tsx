import { Metadata } from 'next'
import { termsOfServiceData } from '@/lib/data/terms-of-service'

export const metadata: Metadata = {
  title: 'Terms of Service | Zymptek - B2B Trade Platform',
  description: 'Read our terms of service and user agreement for using the Zymptek B2B trade platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-200">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-600">
            {termsOfServiceData.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-2xl font-bold mb-4 text-brand-200">{section.title}</h2>
                
                {section.content && (
                  <div className="mb-4 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                )}

                {section.subsections && (
                  <div className="space-y-4">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        {subsection.title && (
                          <h3 className="text-xl font-semibold mb-2 text-brand-200">{subsection.title}</h3>
                        )}
                        {subsection.content && (
                          <p className="mb-2 leading-relaxed">{subsection.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.items && (
                  <ul className="list-disc pl-6 space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-500 text-sm">
                Last Updated: {termsOfServiceData.lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 