# Holo Alert — Homepage Design System

> **Reference this file before writing any new section or updating existing UI.** All design decisions must align with the tokens and conventions below.

---

## Typeface

**Single typeface site-wide: Instrument Sans** (Google Fonts)

A contemporary geometric sans-serif with humanist characteristics — clean and trustworthy without feeling clinical. All hierarchy is achieved through weight, size, case, and spacing rather than font switching.

### Body / Base
| Property | Value |
|---|---|
| Font | Instrument Sans, sans-serif |
| Weight | 400 |
| Size | 1rem (16px) |
| Line height | 1.3 |
| Text wrap | pretty |

### Type Hierarchy
| Role | Treatment |
|---|---|
| Overline / eyebrow | All-caps, tight letter-spacing, small size — used above H2s to categorize sections |
| H1 | Bold/heavy, large display, primary value statement |
| H2 | Semi-bold, prominent, anchors each content block |
| H3 | Medium weight, mid-size — feature callouts and FAQ items |
| Stat callouts (e.g. "36%", "1000+") | Heavy/oversized — purely visual anchors |
| Pricing (e.g. "from $49.95/month") | Semi-bold, subordinate to headings |
| CTAs (e.g. "Explore", "Choose Holo Pro") | Semi-bold, compact, consistent across all actions |

---

## Colour Palette

### Brand Core
| Token | Hex | Usage |
|---|---|---|
| `--black` | `#171717` | Primary text |
| `--gray` | `#787878` | Secondary / muted text |
| `--black-5` | `#17171780` | Subdued text (50% opacity) |
| `--black-7` | `#171717b3` | Light text variant (70% opacity) |
| `--blue` | `#4294d8` | Accent — links, highlights, UI accents, overlines |
| `--orange` | `#f46036` | CTA buttons, urgency elements |
| `--promo-price` | `#45b864` | Pricing, savings callouts |
| Background | `#ffffff` | Page background |

### Borders & Surfaces
| Token | Hex | Usage |
|---|---|---|
| `--black-0-15` | `#d9d9d9` | Borders, dividers |
| `--black-1` | `#0000001a` | Very subtle dividers |
| `--black-15` | `#00000026` | Overlay / scrim |
| `--black-25` | `#00000040` | Stronger scrim |
| `--black-05` | `#f2f2f2` | Light surface / background wash |

### Untitled UI Token Layer
Used only for form, quiz, and component library elements — not core brand UI.

| Role | Values |
|---|---|
| Grays | `#f9fafb` → `#f2f4f7` → `#d0d5dd` → `#475467` → `#344054` → `#1d2939` → `#101828` |
| Purple (form/quiz only) | `#f9f5ff` → `#9e77ed` → `#7f56d9` → `#6941c6` → `#42307d` |
| Warning | `#fec84b` |

> Do not bleed Untitled UI purples into brand sections. They are scoped to lead capture UI only.

---

## Spacing & Layout

- **Box-sizing:** `border-box` (universal)
- **Min-height:** `100%` on body — full viewport coverage
- **Content max-width:** `1200px` for standard sections; `800px` for centered text-only sections
- **Section padding:** `100px 40px` (desktop), scaled down on mobile

---

## Design Character

- Minimal, single-typeface system anchored by near-black/white base
- Selective use of blue, orange, and green as **functional accents** — never decorative
- Palette prioritizes **trust and clarity** over energy — appropriate for senior-care audience
- Untitled UI layer is compartmentalized (quiz/form only)
- Motion: opacity and scroll-scrubbed reveals; never `transition-all`
