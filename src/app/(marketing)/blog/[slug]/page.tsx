import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { sanityFetch } from '@/sanity/lib/client'
import { BLOG_POST_QUERY, BLOG_POSTS_LATEST_QUERY, BLOG_POSTS_RELATED_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import BlogShareButtons from './BlogShareButtons'

interface Params { params: Promise<{ slug: string }> }

// ─── Reading time ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function estimateReadingTime(body: any[]): number {
  if (!body) return 1
  let words = 0
  for (const block of body) {
    if (block._type === 'block' && block.children) {
      for (const child of block.children) {
        if (child.text) words += child.text.split(/\s+/).filter(Boolean).length
      }
    }
  }
  return Math.max(1, Math.round(words / 200))
}

// ─── Portable text components ─────────────────────────────────────────────────

const ptComponents: PortableTextComponents = {
  types: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    table: ({ value }: { value: any }) => {
      const rows: { cells: string[] }[] = value?.rows ?? []
      if (!rows.length) return null
      const [headerRow, ...bodyRows] = rows
      return (
        <div className="my-8 overflow-x-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="bg-[#171717] text-white">
                {(headerRow?.cells ?? []).map((cell: string, ci: number) => (
                  <th
                    key={ci}
                    className="px-4 py-3 text-left font-semibold tracking-wide border border-[#2a2a2a]"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-[#f7f7f7]'}>
                  {(row?.cells ?? []).map((cell: string, ci: number) => (
                    <td
                      key={ci}
                      className="px-4 py-3 border border-[#e5e5e5] text-[#171717] leading-snug"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: ({ value }: { value: any }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative w-full overflow-hidden rounded-sm" style={{ aspectRatio: '16/9' }}>
            <Image
              src={urlFor(value).width(900).url()}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 680px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-[13px] text-[#787878] text-center mt-2">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-[22px] font-bold text-[#171717] mt-10 mb-3 leading-snug">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-[18px] font-semibold text-[#171717] mt-7 mb-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-[16px] font-semibold text-[#171717] mt-5 mb-2">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-[15px] text-[#171717] leading-[1.75] mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#4294d8] pl-5 my-6 italic text-[#787878] text-[15px] leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  marks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    link: ({ children, value }: { children?: React.ReactNode; value?: any }) => (
      <a
        href={value.href}
        target={value.href?.startsWith('http') ? '_blank' : undefined}
        rel={value.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-[#4294d8] underline underline-offset-2 hover:text-[#2e7abf] transition-colors"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold text-[#171717]">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-1.5 mb-5 text-[15px] text-[#171717] leading-[1.7]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-1.5 mb-5 text-[15px] text-[#171717] leading-[1.7]">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
}

// ─── Date formatter ───────────────────────────────────────────────────────────

function formatDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const post = await sanityFetch<any>({ query: BLOG_POST_QUERY, params: { slug }, tags: ['blogPost'] })
  if (!post) return {}
  return {
    title: post.seoTitle ?? `${post.title} | Holo Alert`,
    description: post.excerpt ?? undefined,
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params

  const [post, latestPosts, relatedPosts] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sanityFetch<any>({ query: BLOG_POST_QUERY, params: { slug }, tags: ['blogPost'] }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sanityFetch<any[]>({ query: BLOG_POSTS_LATEST_QUERY, tags: ['blogPost'] }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sanityFetch<any[]>({ query: BLOG_POSTS_RELATED_QUERY, params: { slug }, tags: ['blogPost'] }),
  ])

  if (!post) notFound()

  const readingTime = estimateReadingTime(post.body)
  const heroImage = post.heroImage ?? post.mainImage

  return (
    <div style={{ fontFamily: 'Instrument Sans, sans-serif', color: '#171717' }}>

      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <nav className="flex items-center gap-2 pb-1 text-[13px] text-[#787878]" style={{ paddingTop: '88px' }}>
          <Link href="/" className="hover:text-[#171717] transition-colors">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-label="Home">
              <path d="M1.5 6.5L7 2l5.5 4.5V12.5a.5.5 0 0 1-.5.5H9.5V9.5h-5V13H2a.5.5 0 0 1-.5-.5V6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </Link>
          <span className="text-[#d9d9d9]">/</span>
          <Link href="/blog" className="hover:text-[#171717] transition-colors">Blog</Link>
          <span className="text-[#d9d9d9]">/</span>
          <span className="truncate max-w-[320px]">{post.title}</span>
        </nav>
      </div>

      {/* ── Article header ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <div className="pt-8 pb-10 max-w-[760px]">
          {post.category && (
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#4294d8] block mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-[36px] lg:text-[48px] font-bold text-[#171717] leading-[1.08] tracking-tight mb-5">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-[13px] text-[#787878]">
            {post.author && <span>{post.author}</span>}
            {post.author && post.publishedAt && <span className="text-[#d9d9d9]">·</span>}
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
            <span className="text-[#d9d9d9]">·</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>

      {/* ── Hero image ─────────────────────────────────────────────────── */}
      {heroImage && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <div className="relative w-full overflow-hidden rounded-sm mb-12" style={{ aspectRatio: '16/7' }}>
            <Image
              src={urlFor(heroImage).width(1200).height(525).fit('crop').url()}
              alt={heroImage.alt ?? post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
        </div>
      )}

      {/* ── 3-column body ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 80px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[56px_1fr_260px] gap-0 lg:gap-12">

          {/* Left: Share */}
          <div className="hidden lg:block pt-1">
            <div className="sticky top-28">
              <BlogShareButtons />
            </div>
          </div>

          {/* Center: Article body */}
          <article className="min-w-0">
            {post.body ? (
              <PortableText value={post.body} components={ptComponents} />
            ) : (
              post.excerpt && (
                <p className="text-[15px] text-[#787878] leading-[1.75]">{post.excerpt}</p>
              )
            )}
          </article>

          {/* Right: The Latest */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#787878] mb-5">
                The Latest
              </h3>
              <div className="flex flex-col gap-5">
                {(latestPosts ?? [])
                  .filter((p) => p.slug.current !== slug)
                  .slice(0, 3)
                  .map((p) => {
                    const thumbUrl = p.mainImage
                      ? urlFor(p.mainImage).width(160).height(110).fit('crop').url()
                      : null
                    return (
                      <Link
                        key={p._id}
                        href={`/blog/${p.slug.current}`}
                        className="flex gap-3 group"
                      >
                        {thumbUrl && (
                          <div className="relative flex-shrink-0 w-[70px] h-[50px] overflow-hidden rounded-sm bg-[#f2f2f2]">
                            <Image src={thumbUrl} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="70px" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#171717] leading-snug line-clamp-2 group-hover:text-[#4294d8] transition-colors">
                            {p.title}
                          </p>
                          <p className="text-[11px] text-[#787878] mt-1">{formatDate(p.publishedAt)}</p>
                        </div>
                      </Link>
                    )
                  })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Related Posts ──────────────────────────────────────────────── */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="border-t border-[#d9d9d9]">
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px 80px' }}>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[26px] font-bold text-[#171717]">Related Posts</h2>
              <Link href="/blog" className="text-[13px] font-medium text-[#4294d8] hover:underline">
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {relatedPosts.map((p) => {
                const imgUrl = p.mainImage
                  ? urlFor(p.mainImage).width(600).height(400).fit('crop').url()
                  : null
                return (
                  <article key={p._id}>
                    <Link href={`/blog/${p.slug.current}`} className="block relative overflow-hidden rounded-sm bg-[#f2f2f2]" style={{ aspectRatio: '4/3' }}>
                      {imgUrl && (
                        <Image src={imgUrl} alt={p.title} fill className="object-cover hover:scale-[1.03] transition-transform duration-500" sizes="33vw" />
                      )}
                    </Link>
                    <div className="pt-4">
                      <Link href={`/blog/${p.slug.current}`}>
                        <h3 className="text-[16px] font-semibold text-[#171717] leading-snug hover:text-[#4294d8] transition-colors line-clamp-2 mb-2">
                          {p.title}
                        </h3>
                      </Link>
                      {p.publishedAt && (
                        <span className="text-[12px] text-[#787878]">{formatDate(p.publishedAt)}</span>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA Banner ─────────────────────────────────────────────────── */}
      <div className="bg-[#171717]">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 40px' }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#4294d8] mb-3">
              Medical Alert Systems
            </p>
            <h2 className="text-[28px] lg:text-[36px] font-bold text-white leading-tight max-w-[500px]">
              Find The Right Holo Alert System
            </h2>
            <p className="text-[15px] text-white/60 mt-3 max-w-[440px] leading-relaxed">
              Tell us about your loved one and we&apos;ll help you choose the perfect device for their safety and independence.
            </p>
          </div>
          <Link
            href="/devices"
            className="flex-shrink-0 px-8 py-4 rounded-full bg-[#f46036] text-white text-[14px] font-bold uppercase tracking-wider hover:bg-[#d94f2a] transition-colors"
          >
            Shop Devices
          </Link>
        </div>
      </div>

    </div>
  )
}
