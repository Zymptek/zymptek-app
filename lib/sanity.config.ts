import { createClient, type ClientConfig } from 'next-sanity'

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
export const DEFAULT_REVALIDATE_DURATION = isPreviewMode ? 0 : 3600 // No cache in preview mode, 1 hour in production
export const PREVIEW_REVALIDATE = 0 // No cache in preview mode

// Tag constants for better organization and reuse
export const SANITY_TAGS = {
  ABOUT: 'about'
} as const

// GROQ query helper with types and improved caching
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
  revalidate = DEFAULT_REVALIDATE_DURATION,
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
  revalidate?: number
}): Promise<QueryResponse> {
  try {
    const result = await client.fetch<QueryResponse>(query, params, {
      next: { 
        tags: [...tags, ...Object.values(SANITY_TAGS)],
        revalidate: 0
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