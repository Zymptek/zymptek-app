import { Metadata } from 'next'
import AboutHero from './components/about-hero'
import AboutVision from './components/about-vision'
import { AboutStory } from './components/about-story'
import AboutCTA from './components/about-cta'
import { getAboutPage } from '@/lib/api/sanity/about'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'About Us | Zymptek',
  description: 'Learn about Zymptek - our mission, vision, and story.',
}

export default async function AboutPage() {
  const data = await getAboutPage();
  
  if (!data) {
    notFound();
  }

  // Map Sanity data structure to component props
  const heroData = {
    hero_title_start: data.hero.hero_title_start,
    hero_title_highlight: data.hero.hero_title_highlight,
    hero_title_end: data.hero.hero_title_end,
    hero_subtitle: data.hero.hero_subtitle,
    hero_description: data.hero.hero_description,
    hero_features: data.hero.hero_features.map((feature, index) => ({
      id: parseInt(feature._key.replace(/\D/g, '')) || index + 1,
      icon: feature.icon,
      label: feature.label,
      description: feature.description
    }))
  }

  const visionData = {
    vision_title: data.vision.vision_title,
    vision_description: data.vision.vision_description,
    vision_points: data.vision.vision_points.map((point, index) => ({
      id: parseInt(point._key.replace(/\D/g, '')) || index + 1,
      title: point.title,
      description: point.description
    }))
  }

  const storyData = {
    story_header: {
      id: 1,
      badge: data.story.story_badge,
      title: data.story.story_title,
      highlightedText: data.story.story_highlightedText,
      description: data.story.story_description
    },
    story_items: data.story.story_items.map((item, index) => ({
      id: parseInt(item._key.replace(/\D/g, '')) || index + 1,
      title: item.title,
      description: item.description,
      content: item.content
    }))
  }

  const ctaData = {
    cta_title: data.cta.cta_title,
    cta_description: data.cta.cta_description,
    cta_button_text: data.cta.cta_button_text,
    cta_button_link: data.cta.cta_button_link
  }
  
  return (
    <main className="min-h-screen">
      <AboutHero data={{
        ...heroData,
        hero_features: heroData.hero_features.map(feature => ({
          ...feature,
          _key: `feature-${feature.id}`,
          _type: 'aboutFeature'
        }))
      }} cta={ctaData} />
      <AboutVision data={visionData} />
      <AboutStory data={storyData} />
      <AboutCTA data={ctaData} />
    </main>
  )
} 