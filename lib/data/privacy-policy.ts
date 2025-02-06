interface Item {
  purpose: string;
  details: string;
}

interface Subsection {
  title: string;
  content?: string;
  items?: string[];
}

interface Section {
  title: string;
  content?: string;
  subsections?: Subsection[];
  items?: (string | Item)[];
}

interface GrievanceOfficer {
  name: string;
  email: string;
  address: string;
}

interface ContactInfo {
  email: string;
  address: string;
  grievanceOfficer: GrievanceOfficer;
}

interface PrivacyPolicyData {
  lastUpdated: string;
  sections: Section[];
  contactInfo: ContactInfo;
}

export const privacyPolicyData: PrivacyPolicyData = {
  lastUpdated: "February 6, 2024",
  sections: [
    {
      title: "Introduction",
      content: `Zymptek Private Limited ("we", "our", "us", "Zymptek") values the trust placed in us by data subjects ("you", "your", "user") and therefore, we follow the highest standards of privacy guidelines to protect the information shared by you with us.

This privacy policy describes how we collect, use, process, and disclose your information, including personal information, in conjunction with your access to and use of the Zymptek Platform.`
    },
    {
      title: "Information We Collect",
      subsections: [
        {
          title: "Information You Give Us",
          items: [
            "Name, phone number, and email address",
            "Company details including business name, type, and registration information",
            "Billing and shipping addresses",
            "Financial information for escrow transactions and payments",
            "Communication preferences and settings",
            "Product inquiries and business requirements",
            "Documents for business verification"
          ]
        },
        {
          title: "Information Automatically Collected",
          items: [
            "IP address and device information",
            "Browser type and version",
            "Operating system information",
            "Time zone setting and location",
            "Browsing actions and patterns",
            "Platform usage statistics"
          ]
        },
        {
          title: "Transaction Information",
          items: [
            "Order details and history",
            "Escrow transaction records",
            "Payment information",
            "Shipping and delivery details",
            "Trade documentation",
            "Communication records related to transactions"
          ]
        }
      ]
    },
    {
      title: "How We Use Your Information",
      items: [
        {
          purpose: "Platform Operation",
          details: "To operate, maintain, and improve the Zymptek platform"
        },
        {
          purpose: "Transaction Processing",
          details: "To facilitate and manage escrow transactions, payments, and trade documentation"
        },
        {
          purpose: "Communication",
          details: "To send transaction updates, important notices, and marketing communications (where permitted)"
        },
        {
          purpose: "Security",
          details: "To detect and prevent fraud, abuse, and security incidents"
        },
        {
          purpose: "Compliance",
          details: "To comply with legal obligations and resolve disputes"
        },
        {
          purpose: "Analytics",
          details: "To analyze platform usage and improve our services"
        }
      ]
    },
    {
      title: "Information Sharing",
      subsections: [
        {
          title: "Business Partners",
          content: "We share information with trusted business partners who assist us in operating our platform, conducting our business, or servicing you."
        },
        {
          title: "Escrow Services",
          content: "Information is shared with our escrow service partners to facilitate secure transactions and payments."
        },
        {
          title: "Legal Requirements",
          content: "We may disclose information where required by law or to protect our rights or the rights of others."
        }
      ]
    },
    {
      title: "Data Security",
      content: `We implement appropriate technical and organizational measures to maintain the security of your personal information, including:

• Encryption of data in transit and at rest
• Regular security assessments
• Access controls and authentication
• Secure escrow transaction processing
• Regular security training for staff
• Incident response procedures`
    },
    {
      title: "Your Rights",
      items: [
        "Access your personal information",
        "Correct inaccurate data",
        "Request deletion of your information",
        "Object to processing of your information",
        "Data portability",
        "Withdraw consent for marketing communications"
      ]
    },
    {
      title: "International Data Transfers",
      content: "Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers."
    },
    {
      title: "Retention Period",
      content: "We retain your information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law."
    },
    {
      title: "Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date."
    }
  ],
  contactInfo: {
    email: "info@zymptek.com",
    address: "308 Shivdhara Arcade, Kalol. Gandhinagar, India",
    grievanceOfficer: {
      name: "Privacy Officer",
      email: "privacy@zymptek.com",
      address: "308 Shivdhara Arcade, Kalol. Gandhinagar, India"
    }
  }
} 