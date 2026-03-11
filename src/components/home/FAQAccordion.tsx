'use client'

import { useState } from 'react'

interface FAQ {
  _id: string
  question: string
  answer: string
}

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        return (
          <div key={faq._id} style={{ borderBottom: '1px solid #e5e5e5' }}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 0',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                textAlign: 'left',
                gap: '16px',
              }}
            >
              <span style={{ fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 600, color: '#171717', lineHeight: 1.4 }}>
                {faq.question}
              </span>
              <span
                aria-hidden="true"
                style={{
                  width: '28px',
                  height: '28px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s',
                  transform: isOpen ? 'rotate(45deg)' : 'none',
                  fontSize: '22px',
                  color: '#787878',
                  lineHeight: 1,
                }}
              >
                +
              </span>
            </button>
            <div
              style={{
                overflow: 'hidden',
                maxHeight: isOpen ? '500px' : '0',
                transition: 'max-height 0.35s ease',
              }}
            >
              <div style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', color: '#555', lineHeight: 1.7, paddingBottom: '20px' }}>
                {faq.answer}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
