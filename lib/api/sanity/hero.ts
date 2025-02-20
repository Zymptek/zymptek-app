import { sanityFetch } from '@/lib/sanity.config'
import { HeroContent } from '@/lib/types/sanity/hero'

export async function getHeroContent(): Promise<HeroContent> {
  const query = `*[_type == "homepage"][0] {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title {
      gradient,
      main
    },
    description,
    searchPlaceholder,
    stats {
      products {
        number,
        label
      },
      suppliers {
        number,
        label
      },
      countries {
        number,
        label
      }
    },
    animation {
      url
    }
  }`

  try {
    const data = await sanityFetch<HeroContent>({
      query
    })
    return data
  } catch (error) {
    console.error('Error fetching hero content:', error)
    throw error
  }
} 