import HeaderServer from '@/components/layout/HeaderServer'
import Footer from '@/components/layout/Footer'
import PromoBannerServer from '@/components/layout/PromoBannerServer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <PromoBannerServer />
        <HeaderServer />
      </div>
      <main>{children}</main>
      <Footer />
    </>
  )
}
