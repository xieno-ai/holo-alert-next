import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/client'
import { BLOG_POSTS_QUERY } from '@/sanity/lib/queries'
import BlogListing from './BlogListing'

export const metadata = {
  title: "Canada's Medical Alert & Senior Safety Blog | Holo Alert",
  description:
    'Expert insights on medical alert systems, fall prevention, and aging in place safely in Canada. Get trusted advice from Holo Alert\'s senior safety specialists.',
}

export default async function BlogPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts = await sanityFetch<any[]>({
    query: BLOG_POSTS_QUERY,
    tags: ['blogPost'],
  })

  return (
    <div style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
      {/* Page header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 pb-2 text-[13px] text-[#787878]" style={{ paddingTop: '16px' }}>
          <Link href="/" className="hover:text-[#171717] transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Home">
              <path d="M1.5 6.5L7 2l5.5 4.5V12.5a.5.5 0 0 1-.5.5H9.5V9.5h-5V13H2a.5.5 0 0 1-.5-.5V6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </Link>
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" aria-hidden="true">
            <path d="M1 1l4 4-4 4" stroke="#d9d9d9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Blog</span>
        </nav>

        {/* Title + description */}
        <div className="grid grid-cols-1 lg:grid-cols-[58fr_42fr] gap-8 lg:gap-16 items-center pt-10 pb-16">
          <h1 className="text-[42px] lg:text-[52px] font-bold text-[#171717] leading-[1.05] tracking-tight">
            Canada&apos;s Medical Alert<br />
            &amp; Senior Safety Blog
          </h1>
          <p className="text-[16px] text-[#787878] leading-relaxed">
            Expert insights on medical alert systems, fall prevention, and aging in place safely in Canada.
            Get trusted advice from Holo Alert&apos;s senior safety specialists.
          </p>
        </div>
      </div>

      {/* Posts listing */}
      <BlogListing posts={posts ?? []} />
    </div>
  )
}
