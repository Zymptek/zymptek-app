export interface AboutFeature {
  id: number;
  icon: "shield" | "wallet" | "check" | "clock";
  label: string;
  description: string;
}

export interface StoryHeader {
  id: number;
  badge: string;
  title: string;
  highlightedText: string;
  description: string;
}

export interface StoryItem {
  id: number;
  title: string;
  description: string;
  year: string;
}

export interface VisionPoint {
  id: number;
  title: string;
  description: string;
  icon?: string;
}

export interface AboutPageAttributes {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  hero_title_start: string;
  hero_title_highlight: string;
  hero_title_end: string;
  hero_subtitle: string;
  hero_description: string;
  hero_features: AboutFeature[];
  vision_title: string;
  vision_description: string;
  vision_points: VisionPoint[];
  story_header: StoryHeader;
  story_items: StoryItem[];
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;
}

export interface AboutPageResponse {
  data: {
    id: number;
    attributes: AboutPageAttributes;
  };
  meta: Record<string, any>;
} 