'use client'

import { ElfsightWidget } from 'next-elfsight-widget'

export default function GoogleReviewsWidget() {
  const widgetId = process.env.NEXT_PUBLIC_ELFSIGHT_WIDGET_ID

  if (!widgetId) {
    // Static placeholder until Elfsight widget ID is configured
    // To activate: add NEXT_PUBLIC_ELFSIGHT_WIDGET_ID=<your-widget-uuid> to .env.local
    return (
      <div className="flex items-center gap-1.5 text-sm">
        <span className="text-yellow-400 text-base leading-none">★★★★★</span>
        <span className="font-semibold text-brand-black">4.9</span>
        <span className="text-brand-gray">· Google Reviews</span>
      </div>
    )
  }

  return <ElfsightWidget widgetId={widgetId} lazy={false} />
}
