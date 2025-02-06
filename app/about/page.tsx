import { Metadata } from 'next'
import AboutHero from './components/about-hero'
import AboutVision from './components/about-vision'
import { AboutStory } from './components/about-story'
import AboutCTA from './components/about-cta'

export const metadata: Metadata = {
  title: 'About Zymptek | Transforming International B2B Trade',
  description: 'Learn how Zymptek is revolutionizing international trade by connecting global businesses with verified Indian manufacturers through innovative technology.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <AboutVision />
      <AboutStory />
      <AboutCTA />
    </main>
  )
} 