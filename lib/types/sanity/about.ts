export interface AboutFeature {
  _key: string;
  _type: 'aboutFeature';
  icon: "shield" | "wallet" | "check" | "clock";
  label: string;
  description: string;
}

export interface VisionPoint {
  _key: string;
  _type: 'visionPoint';
  title: string;
  description: string;
}

export interface StoryItem {
  _key: string;
  _type: 'storyItem';
  title: string;
  description: string;
  content: string;
}

export interface StoryHeader {
  title: string;
  highlightedText: string;
  badge: string;
  description: string;
}

export interface AboutHeroSection {
  hero_title_start: string;
  hero_title_highlight: string;
  hero_title_end: string;
  hero_subtitle: string;
  hero_description: string;
  hero_features: AboutFeature[];
}

export interface AboutVisionSection {
  vision_title: string;
  vision_description: string;
  vision_points: VisionPoint[];
}

export interface AboutStorySection {
  story_badge: string;
  story_title: string;
  story_highlightedText: string;
  story_description: string;
  story_items: StoryItem[];
}

export interface AboutCTASection {
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;
}

export interface AboutPageResponse {
  _id: string;
  _type: 'about';
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  hero: AboutHeroSection;
  vision: AboutVisionSection;
  story: AboutStorySection;
  cta: AboutCTASection;
} 