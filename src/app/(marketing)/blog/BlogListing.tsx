'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string | null
  author: string | null
  category: string | null
  excerpt: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mainImage: any
  isFeatured: boolean | null
}

const GRID_PAGE_SIZE = 9

function formatDate(dateString: string | null) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function ReadMoreLink({ slug }: { slug: string }) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="inline-flex items-center gap-1.5 text-[#4294d8] text-sm font-medium hover:underline"
    >
      Read more
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}

function FeaturedPost({ post }: { post: BlogPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(900).height(580).fit('crop').url()
    : null

  return (
    <article className="py-14 grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-0 lg:gap-16 items-start">
      {/* Image — landscape */}
      <div className="relative w-full overflow-hidden rounded-sm bg-[#f2f2f2]" style={{ aspectRatio: '16/10' }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? post.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 58vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-[#f2f2f2]" />
        )}
      </div>

      {/* Content — top-aligned, larger title to fill the vertical space */}
      <div className="pt-8 lg:pt-2 flex flex-col gap-5">
        {post.category && (
          <span className="text-xs font-semibold uppercase tracking-widest text-[#4294d8]">
            {post.category}
          </span>
        )}
        <Link href={`/blog/${post.slug.current}`}>
          <h2 className="text-[28px] lg:text-[36px] font-bold text-[#171717] leading-[1.12] hover:text-[#4294d8] transition-colors">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-[#787878] text-[15px] leading-relaxed line-clamp-4">
            {post.excerpt}
          </p>
        )}
        <div className="pt-1 flex flex-col gap-1.5">
          <ReadMoreLink slug={post.slug.current} />
          {post.publishedAt && (
            <span className="text-[13px] text-[#787878]">{formatDate(post.publishedAt)}</span>
          )}
        </div>
      </div>
    </article>
  )
}

function GridCard({ post }: { post: BlogPost }) {
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(600).height(450).fit('crop').url()
    : null

  return (
    <article className="flex flex-col" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 420px' }}>
      {/* Image */}
      <Link href={`/blog/${post.slug.current}`} className="block relative overflow-hidden rounded-sm bg-[#f2f2f2]" style={{ aspectRatio: '4/3' }}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt ?? post.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
          />
        ) : (
          <div className="w-full h-full bg-[#f2f2f2]" />
        )}
      </Link>

      {/* Content */}
      <div className="pt-5 flex flex-col flex-1 gap-3">
        <Link href={`/blog/${post.slug.current}`}>
          <h3 className="text-[17px] font-semibold text-[#171717] leading-snug hover:text-[#4294d8] transition-colors line-clamp-3">
            {post.title}
          </h3>
        </Link>
        {post.excerpt && (
          <p className="text-[14px] text-[#787878] leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto pt-3 flex flex-col gap-1">
          <ReadMoreLink slug={post.slug.current} />
          {post.publishedAt && (
            <span className="text-[13px] text-[#787878]">{formatDate(post.publishedAt)}</span>
          )}
        </div>
      </div>
    </article>
  )
}

export default function BlogListing({ posts }: { posts: BlogPost[] }) {
  const [visibleCount, setVisibleCount] = useState(GRID_PAGE_SIZE)

  const featured = posts[0] ?? null
  const gridPosts = posts.slice(1)
  const visibleGridPosts = gridPosts.slice(0, visibleCount)
  const hasMore = visibleCount < gridPosts.length

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
      {/* Featured post */}
      {featured && (
        <>
          <hr className="border-[#d9d9d9]" />
          <FeaturedPost post={featured} />
        </>
      )}

      {/* Grid */}
      {gridPosts.length > 0 ? (
        <>
          <hr className="border-[#d9d9d9]" />
          <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {visibleGridPosts.map((post) => (
              <GridCard key={post._id} post={post} />
            ))}
          </div>
        </>
      ) : null}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center pb-20">
          <button
            onClick={() => setVisibleCount((n) => n + GRID_PAGE_SIZE)}
            className="px-8 py-3 rounded-full bg-[#171717] text-white text-[14px] font-semibold hover:bg-[#333] transition-colors focus-visible:ring-2 focus-visible:ring-[#4294d8]/50 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  )
}
