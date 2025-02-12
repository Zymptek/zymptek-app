import { fetchAPI } from '@/lib/strapi'

export async function getAboutPage() {
  try {
    const response = await fetchAPI('/about-page', {
      populate: '*'
    }, {
      next: {
        revalidate: 0 // Disable cache to always get fresh data
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching about page data:', error);
    throw error;
  }
} 