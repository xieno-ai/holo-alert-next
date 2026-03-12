import type { MetadataRoute } from 'next'

const BASE_URL = 'https://holoalert.ca'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/devices/holo-pro',
    '/devices/holo-mini',
    '/devices/holo-active',
    '/accessories',
    '/compare',
    '/quiz',
    '/blog',
    '/testimonials',
    '/about-us',
    '/referral-program',
    '/privacy-policy',
    '/terms-conditions',
  ]

  return staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }))
}
