import { sanityFetch } from '@/lib/sanity.config'
import { AboutPageResponse } from '@/lib/types/sanity/about'

export async function getAboutPage(): Promise<AboutPageResponse> {
  const query = `*[_type == "about"][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    "hero": {
      "hero_title_start": hero_title_start,
      "hero_title_highlight": hero_title_highlight,
      "hero_title_end": hero_title_end,
      "hero_subtitle": hero_subtitle,
      "hero_description": hero_description,
      "hero_features": hero_features[]{
        _key,
        _type,
        icon,
        label,
        description
      }
    },
    "vision": {
      "vision_title": vision_title,
      "vision_description": vision_description,
      "vision_points": vision_points[]{
        _key,
        _type,
        title,
        description
      }
    },
    "story": {
      "story_badge": story_header.badge,
      "story_title": story_header.title,
      "story_highlightedText": story_header.highlightedText,
      "story_description": story_header.description,
      "story_items": story_items[]{
        _key,
        _type,
        title,
        description,
        content
      }
    },
    "cta": {
      "cta_title": cta_title,
      "cta_description": cta_description,
      "cta_button_text": cta_button_text,
      "cta_button_link": cta_button_link
    }
  }`

  try {
    const data = await sanityFetch<AboutPageResponse>({
      query
    })
    return data
  } catch (error) {
    console.error('Error fetching about page data:', error)
    throw error
  }
} 