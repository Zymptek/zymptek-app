import qs from 'qs';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Get full Strapi URL from path
 * @param {string} path Path of the URL
 * @returns {string} Full Strapi URL
 */
export function getStrapiURL(path = '') {
  return `${STRAPI_URL}${path}`;
}

/**
 * Helper to make GET requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} urlParamsObject URL params object, will be stringified
 * @param {Object} options Options passed to fetch
 * @returns Parsed API call response
 */
export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    ...options,
  };

  // Build request URL
  const queryString = qs.stringify(urlParamsObject);
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ''}`
  )}`;

  // Trigger API call
  try {
    const response = await fetch(requestUrl, mergedOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`Please check if your Strapi server is running`);
  }
}

/**
 * Helper to make POST/PUT/DELETE requests to Strapi API endpoints
 * @param {string} path Path of the API route
 * @param {Object} data Request body
 * @param {string} method HTTP method (POST, PUT, DELETE)
 * @returns Parsed API call response
 */
export async function submitAPI(path: string, data: any, method = 'POST') {
  try {
    const response = await fetch(`${getStrapiURL(`/api${path}`)}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(data),
    });
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(error);
    throw new Error(`Error submitting to Strapi API`);
  }
}

/**
 * Get media URL from Strapi
 * @param {object} media Strapi media object
 * @returns {string} URL of the media file
 */
export function getStrapiMedia(media: any) {
  if (!media) return null;
  const { url } = media.data.attributes;
  return url.startsWith('/') ? getStrapiURL(url) : url;
} 