export interface Section {
    _key: string;
    title: string;
    content?: string;
    subsections?: {
      _key: string;
      title?: string;
      content: string;
    }[];
    items?: string[];
  }
  
  export interface TermsData {
    _id: string;
    _updatedAt: string;
    sections: Section[];
  }