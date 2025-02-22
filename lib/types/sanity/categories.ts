export interface CategorySectionContent {
    _id: string;
    _type: string;
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    title: {
      start: string;
      highlight: string;
    };
    description: string;
    search: {
      placeholder: string;
      noResults: string;
      clearButton: string;
    };
    navigation: {
      previous: string;
      next: string;
    };
  }