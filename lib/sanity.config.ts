import { createClient, type ClientConfig } from 'next-sanity'
import { getCacheDuration, CACHE_CONFIG } from '@/config/cache.config'

// Environment configuration
const environment = process.env.NODE_ENV || 'development'
const isPreviewMode = process.env.NEXT_PUBLIC_SANITY_PREVIEW_MODE === 'true'
const isDevEnvironment = environment === 'development'

// Sanity configuration
export const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-13',
  useCdn: !isDevEnvironment && !isPreviewMode, // Only use CDN in production and non-preview mode
  token: process.env.SANITY_API_TOKEN
}

// Validate configuration
if (!config.projectId) {
  throw new Error('Sanity Project ID is required')
}

if (!config.dataset) {
  throw new Error('Sanity Dataset is required')
}

// Create Sanity client
export const client = createClient(config)

// Constants for revalidation
export const PREVIEW_REVALIDATE = 0 // No cache in preview mode

// Tag constants for better organization and reuse
export const SANITY_TAGS = {
  ABOUT: 'about',
  HERO: 'hero',
  TERMS: 'terms'
} as const

type SanityContentType = 'hero' | 'about' | 'terms' | 'default';
type SanityCacheKey = `SANITY_${Uppercase<SanityContentType>}`;

// GROQ query helper with types and improved caching
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
  contentType = 'default'
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
  contentType?: SanityContentType
}): Promise<QueryResponse> {
  try {
    // Get cache duration based on content type
    const cacheKey = `SANITY_${contentType.toUpperCase()}` as SanityCacheKey
    const revalidate = isPreviewMode ? 0 : getCacheDuration(cacheKey)

    const result = await client.fetch<QueryResponse>(query, params, {
      next: { 
        tags: [...tags, ...Object.values(SANITY_TAGS)],
        revalidate
      }
    })

    if (!result && !isPreviewMode) {
      console.warn('No data found for query:', query)
    }
    return result
  } catch (error) {
    console.error('Sanity fetch error:', error)
    throw new Error('Failed to fetch data from Sanity')
  }
} 