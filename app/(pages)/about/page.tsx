import { Metadata } from 'next'
import AboutHero from './components/about-hero'
import AboutVision from './components/about-vision'
import { AboutStory } from './components/about-story'
import AboutCTA from './components/about-cta'
import { getAboutPage } from '@/lib/api/strapi/about'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'About Us | Zymptek',
  description: 'Learn about Zymptek - our mission, vision, and story.',
}

// Disable static page generation, always fetch fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AboutPage() {
  const data = await getAboutPage();
  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <AboutHero data={data} />
      <AboutVision data={data} />
      <AboutStory data={data} />
      <AboutCTA data={data} />
    </main>
  )
} 