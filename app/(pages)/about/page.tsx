import { Metadata } from 'next'
import AboutHero from './components/about-hero'
import AboutVision from './components/about-vision'
import { AboutStory } from './components/about-story'
import AboutCTA from './components/about-cta'
import { aboutPageMetadata, aboutData } from '@/lib/data/about'

export const metadata: Metadata = aboutPageMetadata

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero data={aboutData.hero} />
      <AboutVision data={aboutData.vision} />
      <AboutStory data={aboutData.story} />
      <AboutCTA data={aboutData.cta} />
    </main>
  )
} 