import { defineQuery } from 'next-sanity'

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{ siteTitle, phoneNumber, email, socialLinks, address }`
)

export const DEVICES_QUERY = defineQuery(
  `*[_type == "device" && isActive == true] | order(pricingCardOrder asc) {
    _id, name, slug, tagline, monthlyPriceDisplay, annualPriceDisplay,
    devicePrice, reducedDevicePrice, pricingCardImage, pricingCardSubhead,
    pricingCardSubscription, pricingCardBenefits, pricingCardOrder
  }`
)

export const DEVICES_COMPARE_QUERY = defineQuery(
  `*[_type == "device" && isActive == true] | order(pricingCardOrder asc) {
    _id, name, slug, tagline, monthlyPriceDisplay, annualPriceDisplay,
    devicePrice, reducedDevicePrice, pricingCardImage, pricingCardSubhead,
    pricingCardSubscription, pricingCardBenefits, pricingCardOrder,
    specs[]{ label, value }, shippingTimeline
  }`
)

export const DEVICE_QUERY = defineQuery(
  `*[_type == "device" && slug.current == $slug][0] {
    _id, name, slug, tagline, description, mainImage, featuresImage, gallery,
    monthlyPriceDisplay, annualPriceDisplay, devicePrice, reducedDevicePrice,
    annualBonusMonths, stripePriceIdMonthly, stripePriceIdYearly, stripePriceIdDevice,
    specs, featuresSectionEyebrow, featuresSectionHeading,
    features[]{ _key, title, content, image{ ..., asset-> } }, howItWorksSteps,
    accessories[]{ _key, name, image{ ..., asset->{ url } } },
    ambientVideo{ asset->{ url } }, videoUrl, videoThumbnail, fallAlertDisclaimer, shippingTimeline,
    pricingCardSubhead, pricingCardImage, pricingCardOrder,
    pricingCardSubscription, pricingCardBenefits, isActive,
    hasCaregiverApp,
    caregiverAppBackgroundImage{ ..., asset->{ url, metadata{ dimensions } } },
    caregiverAppForegroundImage{ ..., asset->{ url, metadata{ dimensions } } }
  }`
)

export const BLOG_POSTS_QUERY = defineQuery(
  `*[_type == "blogPost"] | order(publishedAt desc) {
    _id, title, slug, publishedAt, author, category, excerpt, mainImage, isFeatured
  }`
)

export const BLOG_POST_QUERY = defineQuery(
  `*[_type == "blogPost" && slug.current == $slug][0] {
    _id, title, slug, publishedAt, author, category, excerpt, mainImage, heroImage, body, seoTitle
  }`
)

export const FAQS_QUERY = defineQuery(
  `*[_type == "faq" && $page in pages] | order(sortOrder asc) {
    _id, question, answer, category, sortOrder
  }`
)

export const TESTIMONIALS_QUERY = defineQuery(
  `*[_type == "testimonial" && isApproved == true] | order(date desc) {
    _id, name, body, role, location, rating, date, productSlug
  }`
)

export const DEVICE_ADDONS_QUERY = defineQuery(
  `*[_type == "addon" && isActive == true && (
    appliesToAllDevices == true || references($deviceId)
  )] | order(sortOrder asc) {
    _id, name, slug, shortDescription, description,
    priceMonthly, priceAnnual, billingInterval,
    stripePriceIdMonthly, stripePriceIdAnnual
  }`
)

export const BLOG_POSTS_LATEST_QUERY = defineQuery(
  `*[_type == "blogPost"] | order(publishedAt desc) [0...4] {
    _id, title, slug, publishedAt, mainImage
  }`
)

export const BLOG_POSTS_RELATED_QUERY = defineQuery(
  `*[_type == "blogPost" && slug.current != $slug] | order(publishedAt desc) [0...3] {
    _id, title, slug, publishedAt, mainImage, category
  }`
)

export const ACTIVE_PROMO_QUERY = defineQuery(
  `*[_type == "promo" && isActive == true
    && (startDate == null || startDate <= now())
    && (endDate == null || endDate >= now())
  ][0] { _id, title, body, ctaText, ctaUrl, targetPages }`
)

export const LEGAL_PAGE_QUERY = defineQuery(
  `*[_type == "legalPage" && pageType == $pageType][0] {
    _id, title, pageType, effectiveDate, lastUpdatedDate, content
  }`
)
