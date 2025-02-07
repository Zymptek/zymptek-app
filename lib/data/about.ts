export const aboutPageMetadata = {
  title: 'About Zymptek | Transforming International B2B Trade',
  description: 'Learn how Zymptek is revolutionizing international trade by connecting global businesses with verified Indian manufacturers through innovative technology.',
}

export interface AboutHeroData {
  title: string
  subtitle: string
  description: string
  features: {
    icon: 'shield' | 'wallet' | 'check' | 'clock'
    label: string
    description: string
  }[]
}

export interface AboutVisionData {
  title: string
  description: string
  points: {
    title: string
    description: string
  }[]
}

export interface AboutStoryData {
  header: {
    badge: string;
    title: string;
    highlightedText: string;
    description: string;
  };
  items: {
    title: string;
    description: string;
    content: string;
  }[];
}

export interface AboutCTAData {
  title: string
  description: string
  buttonText: string
  buttonLink: string
}

export const aboutData = {
  hero: {
    title: "Revolutionizing Global Trade Through Innovation",
    subtitle: "About Zymptek",
    description: "At Zymptek, we're bridging the gap between global buyers and Indian manufacturers, creating a seamless ecosystem powered by trust, technology, and transparency.",
    features: [
      {
        icon: 'shield',
        label: "Verified Suppliers",
        description: "Thoroughly vetted manufacturers ensuring quality and reliability"
      },
      {
        icon: 'wallet',
        label: "Secure Escrow",
        description: "Protected payments and guaranteed delivery through our escrow service"
      },
      {
        icon: 'check',
        label: "Quality Assurance",
        description: "Rigorous quality control and inspection processes"
      },
      {
        icon: 'clock',
        label: "24/7 Support",
        description: "Round-the-clock expert assistance for seamless trade"
      }
    ]
  } as AboutHeroData,

  vision: {
    title: "Our Vision",
    description: "We envision a world where international trade barriers are eliminated, enabling seamless connections between businesses and manufacturers globally.",
    points: [
      {
        title: "Mission",
        description: "To simplify global trade by connecting quality Indian manufacturers with international buyers through innovative technology."
      },
      {
        title: "Innovation",
        description: "Leveraging cutting-edge technology to create efficient, transparent, and secure trading processes."
      },
      {
        title: "Community",
        description: "Building a community of trusted manufacturers and buyers to foster long-term relationships and mutual growth."
      },
      {
        title: "Impact",
        description: "Empowering businesses globally while promoting sustainable and ethical trading practices."
      }
    ]
  } as AboutVisionData,



  story: {
    header: {
      badge: "Our Story",
      title: "Building the Future of",
      highlightedText: "Global Trade",
      description: "We're building Zymptek with a simple yet powerful vision: making international trade seamless, secure, and efficient for businesses worldwide."
    },
    items: [
      {
        title: "The Challenge",
        description: "Identifying the Gap",
        content: "Born from firsthand experience with the challenges of global trade, we recognized that India's manufacturing potential wasn't being fully leveraged. Despite the country's enormous manufacturing capabilities, the lack of a reliable platform and trust issues in international trade were holding businesses back."
      },
      {
        title: "Our Solution",
        description: "Bridging the Gap",
        content: "At Zymptek, we're bridging this gap by combining strong relationships with innovative technology. We verify every manufacturer on our platform, secure transactions through escrow payments, and provide real-time updates at every step. Our goal is to make importing from India a worry-free experience for businesses worldwide."
      },
      {
        title: "The Future",
        description: "Expanding Horizons",
        content: "Starting with textiles, we're building a comprehensive platform where trust and transparency aren't just promises – they're built into every feature. We're expanding into automotive parts, wooden & handcrafted items, chemicals, and medical equipment, creating a seamless experience that prioritizes quality and reliability."
      }
    ]
  } as AboutStoryData,

  cta: {
    title: "Join the Future of B2B Trade",
    description: "Start your journey with Zymptek today and experience seamless international trade.",
    buttonText: "Get Started",
    buttonLink: "/register"
  } as AboutCTAData
} 