export interface HeroContent {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: {
    gradient: string;
    main: string;
  };
  description: string;
  searchPlaceholder: string;
  stats: {
    products: {
      number: string;
      label: string;
    };
    suppliers: {
      number: string;
      label: string;
    };
    countries: {
      number: string;
      label: string;
    };
  };
  animation: {
    url: string;
  };
} 