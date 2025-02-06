interface Section {
  title: string;
  content?: string;
  subsections?: {
    title?: string;
    content: string;
  }[];
  items?: string[];
}

interface TermsData {
  lastUpdated: string;
  sections: Section[];
}

export const termsOfServiceData: TermsData = {
  lastUpdated: "February 6, 2024",
  sections: [
    {
      title: "Introduction",
      content: `These terms and conditions govern your use of Zymptek's B2B platform and services. By accessing or using our platform, you agree to be bound by these terms. If you disagree with any part of these terms, you may not access or use our services.

Zymptek provides an online B2B marketplace connecting buyers with verified Indian manufacturers and suppliers. Our platform facilitates business transactions, communication, and trade between parties.`
    },
    {
      title: "Definitions",
      items: [
        "'Platform' refers to the website, mobile applications, and services operated by Zymptek",
        "'User' refers to any person or entity accessing or using the Platform",
        "'Buyer' refers to users seeking to purchase products through the Platform",
        "'Supplier' refers to manufacturers, vendors, or sellers listing products on the Platform",
        "'Content' includes text, images, videos, and other materials posted on the Platform",
        "'Services' means all services provided by Zymptek through the Platform"
      ]
    },
    {
      title: "Account Registration and Eligibility",
      subsections: [
        {
          content: "To use our services, you must be at least 18 years old and have the authority to enter into binding contracts. Business accounts must be registered by authorized representatives."
        },
        {
          title: "Account Requirements",
          content: "Users must provide accurate, current, and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials and all activities under your account."
        },
        {
          title: "Verification Process",
          content: "Business accounts may be subject to verification. We reserve the right to reject applications or suspend accounts that don't meet our verification criteria."
        }
      ]
    },
    {
      title: "Platform Usage and Restrictions",
      subsections: [
        {
          title: "Acceptable Use",
          content: "Users agree to use the Platform only for lawful business purposes. You must comply with all applicable laws, regulations, and industry standards."
        },
        {
          title: "Prohibited Activities",
          content: "Users shall not:"
        }
      ],
      items: [
        "Post false, inaccurate, misleading, or deceptive content",
        "Engage in fraudulent activities or misrepresent products/services",
        "Violate intellectual property rights or other proprietary rights",
        "Manipulate platform features or pricing",
        "Use the platform for non-business or personal purposes",
        "Attempt to circumvent platform security or features",
        "Harvest or collect user information without consent"
      ]
    },
    {
      title: "Listing and Transaction Terms",
      subsections: [
        {
          title: "Product Listings",
          content: "Suppliers must provide accurate, complete product information including prices, specifications, and terms. Zymptek reserves the right to remove any listings that violate our policies."
        },
        {
          title: "Transaction Process",
          content: "All transactions must be processed through our platform's designated payment and escrow systems. Direct dealings bypassing platform safeguards are prohibited."
        },
        {
          title: "Escrow Services",
          content: "Our escrow service ensures secure transactions. Funds are held safely until both parties fulfill their obligations as per the agreed terms."
        }
      ]
    },
    {
      title: "Fees and Payments",
      subsections: [
        {
          content: "Zymptek charges fees for various services including but not limited to transaction processing, escrow services, and premium features. All fees are non-refundable unless stated otherwise."
        },
        {
          title: "Payment Terms",
          content: "Users agree to pay all applicable fees and taxes. Payments must be made through approved payment methods. Late payments may result in account suspension."
        }
      ]
    },
    {
      title: "Intellectual Property Rights",
      subsections: [
        {
          content: "All platform content, features, and functionality are owned by Zymptek and protected by international copyright, trademark, and other intellectual property laws."
        },
        {
          title: "User Content",
          content: "By posting content on the platform, users grant Zymptek a worldwide, non-exclusive license to use, reproduce, and distribute such content for platform purposes."
        }
      ]
    },
    {
      title: "Privacy and Data Protection",
      content: "We collect and process user data in accordance with our Privacy Policy. By using our platform, you consent to such processing and warrant that all data provided by you is accurate."
    },
    {
      title: "Limitation of Liability",
      content: `Zymptek shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:

• Loss of profits, revenue, or business opportunities
• Business interruption or lost data
• Damages resulting from platform usage or inability to use
• Any actions or content of other users

Our total liability for any claims shall not exceed the fees paid by you in the 12 months preceding the claim.`
    },
    {
      title: "Dispute Resolution",
      subsections: [
        {
          content: "Any disputes between users should first be addressed through our platform's dispute resolution system."
        },
        {
          title: "Governing Law",
          content: "These terms are governed by the laws of India. Any legal proceedings shall be subject to the exclusive jurisdiction of courts in Gujarat, India."
        }
      ]
    },
    {
      title: "Modifications to Terms",
      content: "We reserve the right to modify these terms at any time. Users will be notified of significant changes. Continued use of the platform after changes constitutes acceptance of modified terms."
    },
    {
      title: "Termination",
      content: "We may terminate or suspend access to our platform immediately, without prior notice, for any breach of these terms. Upon termination, your right to use the platform ceases immediately."
    }
  ]
} 