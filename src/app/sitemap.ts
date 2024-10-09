import type { MetadataRoute } from 'next'
import { categories } from './guia/categories'
import { createClient } from '@/prismicio'

function formatDate(date: Date): string {
  return date.toISOString().split('.')[0] + 'Z'
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.indaga.site'
  const currentDate = new Date()

  const client = createClient()

  const staticPages = [
    {
      url: baseUrl,
      lastModified: formatDate(currentDate),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/happenings`,
      lastModified: formatDate(currentDate),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guia`,
      lastModified: formatDate(currentDate),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rutas`,
      lastModified: formatDate(currentDate),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/nosotras`,
      lastModified: formatDate(currentDate),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  const categoryPages = Object.keys(categories).map(categorySlug => ({
    url: `${baseUrl}/guia/${categorySlug}`,
    lastModified: formatDate(currentDate),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Obtener todos los happenings de Prismic
  const happenings = await client.getAllByType('happening', {
    orderings: {
      field: 'my.happening.date',
      direction: 'desc',
    },
  })

  const happeningPages = happenings.map(happening => ({
    url: `${baseUrl}/happenings/${happening.uid}`,
    lastModified: happening.last_publication_date 
      ? formatDate(new Date(happening.last_publication_date))
      : formatDate(currentDate),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages, ...happeningPages]
}