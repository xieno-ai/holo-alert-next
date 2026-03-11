import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
}): Promise<T> {
  const isDev = process.env.NODE_ENV === 'development'
  return client.fetch<T>(query, params, {
    next: {
      revalidate: isDev ? 0 : tags.length ? false : 3600,
      tags,
    },
  })
}
