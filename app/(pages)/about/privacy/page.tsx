import { Metadata } from 'next'
import { privacyPolicyData } from '@/lib/data/privacy-policy'

export const metadata: Metadata = {
  title: 'Privacy Policy | Zymptek - B2B Trade Platform',
  description: 'Learn about how Zymptek handles and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-200">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            {privacyPolicyData.sections.map((section, index) => (
              <section key={index} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-brand-200">{section.title}</h2>
                
                {/* Regular content */}
                {section.content && (
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line mb-4">
                    {section.content}
                  </div>
                )}

                {/* Subsections */}
                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex}>
                        <h3 className="text-xl font-semibold text-brand-200 mb-3">{subsection.title}</h3>
                        {subsection.content && (
                          <p className="text-gray-600 leading-relaxed mb-3">{subsection.content}</p>
                        )}
                        {subsection.items && (
                          <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            {subsection.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="leading-relaxed">{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Items list */}
                {section.items && (
                  <div>
                    {Array.isArray(section.items) && section.items.every(item => typeof item === 'string') ? (
                      <ul className="list-disc pl-6 text-gray-600 space-y-2">
                        {(section.items as string[]).map((item, itemIndex) => (
                          <li key={itemIndex} className="leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="space-y-4">
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="text-gray-600">
                            {typeof item === 'string' ? (
                              item
                            ) : (
                              <div className="leading-relaxed">
                                <span className="font-semibold text-gray-700">{item.purpose}:</span> {item.details}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>
            ))}

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-brand-200">Contact Information</h2>
              <div className="text-gray-600 space-y-4">
                <p>For any questions about this Privacy Policy, please contact us at:</p>
                <div className="ml-6 space-y-1">
                  <p>Email: {privacyPolicyData.contactInfo.email}</p>
                  <p>Address: {privacyPolicyData.contactInfo.address}</p>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-brand-200 mb-3">Grievance Officer</h3>
                  <p className="mb-3">In accordance with Information Technology Act 2000 and rules made there under, the name and contact details of the Grievance Officer are provided below:</p>
                  <div className="ml-6 space-y-1">
                    <p>{privacyPolicyData.contactInfo.grievanceOfficer.name}</p>
                    <p>Email: {privacyPolicyData.contactInfo.grievanceOfficer.email}</p>
                    <p>Address: {privacyPolicyData.contactInfo.grievanceOfficer.address}</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-gray-500 text-sm">
                Last Updated: {privacyPolicyData.lastUpdated}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 