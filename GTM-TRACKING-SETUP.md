# Holo Alert — Google Tag Manager & Analytics Setup Guide

Complete instructions for setting up Google Tag Manager (web container), Google Analytics 4, and Tracklution (server-side tracking) for the Holo Alert website.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [GTM Web Container Setup](#2-gtm-web-container-setup)
3. [GA4 Property Setup](#3-ga4-property-setup)
4. [DataLayer Events Reference](#4-datalayer-events-reference)
5. [GTM Variables Setup](#5-gtm-variables-setup)
6. [GTM Triggers Setup](#6-gtm-triggers-setup)
7. [GTM Tags Setup](#7-gtm-tags-setup)
8. [Tracklution Server-Side Setup](#8-tracklution-server-side-setup)
9. [Tracklution Connectors](#9-tracklution-connectors)
10. [Testing & Validation](#10-testing--validation)
11. [Conversion Tracking Summary](#11-conversion-tracking-summary)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  BROWSER (holoalert.ca)                                     │
│                                                             │
│  Next.js App → dataLayer.push() → GTM Web Container        │
│                                    (GTM-N2J4XSL)           │
│                                         │                   │
│                              ┌──────────┴──────────┐        │
│                              │                     │        │
│                         GA4 Tag              Tracklution     │
│                         (via GTM)            GTM Tag         │
│                              │                     │        │
└──────────────────────────────┼─────────────────────┼────────┘
                               │                     │
                               ▼                     ▼
                     ┌──────────────┐    ┌──────────────────┐
                     │  Google       │    │  Tracklution     │
                     │  Analytics 4  │    │  Server          │
                     │  (reports)    │    │  (tralut.        │
                     │              │    │   holoalert.ca)  │
                     └──────────────┘    │                  │
                                         │   Connectors:    │
                                         │   ├─ Google Ads  │
                                         │   ├─ Meta/FB     │
                                         │   └─ GA4 (sGTM)  │
                                         └──────────────────┘
```

**Key points:**
- The website pushes events to `window.dataLayer` — GTM picks them up
- GA4 receives events through a GTM GA4 Event tag
- Tracklution receives events through its GTM template tag, then fans out to ad platform connectors server-side
- No separate server-side GTM container needed — Tracklution replaces that

---

## 2. GTM Web Container Setup

Your existing GTM container ID is **GTM-N2J4XSL**. It's already installed in the site's `<head>` via Next.js `@next/third-parties/google`.

### Verify Installation

1. Open [tagmanager.google.com](https://tagmanager.google.com)
2. Select the **GTM-N2J4XSL** container
3. Make sure it's published (not just in draft)

The GTM snippet only loads in **production** (`process.env.NODE_ENV === 'production'`). For local testing, use GTM Preview Mode (see Section 10).

---

## 3. GA4 Property Setup

### Create GA4 Property (if not already done)

1. Go to [analytics.google.com](https://analytics.google.com)
2. **Admin** → **Create Property**
3. Property name: `Holo Alert — Production`
4. Reporting timezone: `Canada (Eastern Time)`
5. Currency: `CAD`
6. Create a **Web** data stream:
   - URL: `https://holoalert.ca`
   - Stream name: `Holo Alert Web`
7. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`) — you'll need this for GTM

### GA4 Configuration

In the GA4 Admin panel:

1. **Data Settings → Data Retention**: Set to **14 months**
2. **Data Settings → Data Collection**: Enable Google Signals (for demographics)
3. **Events → Mark as Conversion** — mark these events as conversions:
   - `purchase` (most important)
   - `begin_checkout`
   - `add_to_cart`
   - `cart_abandoned`

---

## 4. DataLayer Events Reference

The website pushes these events to the dataLayer. Each event and its properties are listed below.

### `page_data` — Fires on every page view

| Property | Example Value | Description |
|---|---|---|
| `utm_source` | `google` | Current session UTM source |
| `utm_medium` | `cpc` | Current session UTM medium |
| `utm_campaign` | `spring_promo` | Current session UTM campaign |
| `utm_content` | `hero_cta` | UTM content tag |
| `utm_term` | `medical+alert` | UTM keyword term |
| `gclid` | `abc123...` | Google Ads click ID |
| `fbclid` | `def456...` | Facebook click ID |
| `msclkid` | `ghi789...` | Microsoft Ads click ID |
| `first_touch_source` | `facebook` | First-ever visit source |
| `first_touch_medium` | `paid_social` | First-ever visit medium |
| `first_touch_campaign` | `awareness_q1` | First-ever visit campaign |
| `landing_page` | `/devices/holo-pro` | First page the user ever visited |
| `referrer` | `https://google.com` | Original referrer |

### `view_item` — Device product page viewed

| Property | Example Value |
|---|---|
| `device_name` | `Holo Pro` |
| `device_slug` | `holo-pro` |
| `monthly_price` | `$64.95/mo` |
| `annual_price` | `$779.95/yr` |
| `currency` | `CAD` |

### `add_to_cart` — User clicks "Continue to Checkout" from product page

| Property | Example Value |
|---|---|
| `device_name` | `Holo Pro` |
| `device_slug` | `holo-pro` |
| `plan_type` | `annual` or `monthly` |
| `device_price` | `$779.95/yr` |
| `addons` | `Fall Detection, Lockbox` |
| `currency` | `CAD` |
| `pages_before_cart` | `/ > /devices/holo-pro` |
| `page_count_before_cart` | `2` |
| `utm_source` | (current UTMs) |
| `first_touch_source` | (first-touch attribution) |
| `landing_page` | (first landing page) |
| `referrer` | (original referrer) |

### `begin_checkout` — User completes step 2 (alert info) and proceeds to payment

| Property | Example Value |
|---|---|
| `device_name` | `Holo Pro` |
| `plan_type` | `annual` |
| `value` | (price string) |
| `currency` | `CAD` |
| `first_touch_source` | (first-touch attribution) |

### `checkout_step` — Each checkout step completion

| Property | Example Value |
|---|---|
| `checkout_step` | `1` or `2` |
| `checkout_step_name` | `billing_shipping` or `alert_info` |
| `device_name` | `Holo Pro` |
| `plan_type` | `annual` |

### `purchase` — Order completed on success page

| Property | Example Value |
|---|---|
| `transaction_id` | `pi_3abc123...` |
| `device_name` | `Holo Pro` |
| `value` | `779.95` (numeric, in dollars) |
| `currency` | `CAD` |
| `plan_type` | `annual` |
| `first_touch_source` | (first-touch attribution) |
| `first_touch_medium` | (first-touch attribution) |
| `first_touch_campaign` | (first-touch attribution) |
| `landing_page` | `/` |
| `referrer` | `https://facebook.com` |
| `pages_before_purchase` | `/ > /devices/holo-pro > /checkout` |
| `page_count_before_purchase` | `3` |

### `cart_abandoned` — Fires on return visit if cart is >30 min old

| Property | Example Value |
|---|---|
| `device_name` | `Holo Pro` |
| `device_slug` | `holo-pro` |
| `plan_type` | `monthly` |
| `value` | `$64.95/mo` |
| `last_checkout_step` | `2` |
| `abandoned_minutes_ago` | `147` |

### `cta_clicked` — Any CTA button click (for future use)

| Property | Example Value |
|---|---|
| `cta_text` | `Get Started` |
| `cta_location` | `hero` |
| `destination` | `/devices/holo-pro` |

### `phone_click` — Phone number click (for future use)

| Property | Example Value |
|---|---|
| `click_location` | `header` |

### `faq_click` — FAQ question expanded (for future use)

| Property | Example Value |
|---|---|
| `faq_question` | `How does fall detection work?` |

---

## 5. GTM Variables Setup

Create these **Data Layer Variables** in GTM. Go to **Variables → User-Defined Variables → New → Data Layer Variable**.

### Naming Convention

All variables use the format: `DLV - variable_name`

### Required Variables

| Variable Name in GTM | Data Layer Variable Name | Type |
|---|---|---|
| `DLV - device_name` | `device_name` | Data Layer Variable |
| `DLV - device_slug` | `device_slug` | Data Layer Variable |
| `DLV - plan_type` | `plan_type` | Data Layer Variable |
| `DLV - device_price` | `device_price` | Data Layer Variable |
| `DLV - addons` | `addons` | Data Layer Variable |
| `DLV - currency` | `currency` | Data Layer Variable |
| `DLV - transaction_id` | `transaction_id` | Data Layer Variable |
| `DLV - value` | `value` | Data Layer Variable |
| `DLV - checkout_step` | `checkout_step` | Data Layer Variable |
| `DLV - checkout_step_name` | `checkout_step_name` | Data Layer Variable |
| `DLV - last_checkout_step` | `last_checkout_step` | Data Layer Variable |
| `DLV - abandoned_minutes_ago` | `abandoned_minutes_ago` | Data Layer Variable |
| `DLV - pages_before_cart` | `pages_before_cart` | Data Layer Variable |
| `DLV - page_count_before_cart` | `page_count_before_cart` | Data Layer Variable |
| `DLV - pages_before_purchase` | `pages_before_purchase` | Data Layer Variable |
| `DLV - page_count_before_purchase` | `page_count_before_purchase` | Data Layer Variable |

### Attribution Variables

| Variable Name in GTM | Data Layer Variable Name |
|---|---|
| `DLV - utm_source` | `utm_source` |
| `DLV - utm_medium` | `utm_medium` |
| `DLV - utm_campaign` | `utm_campaign` |
| `DLV - utm_content` | `utm_content` |
| `DLV - utm_term` | `utm_term` |
| `DLV - gclid` | `gclid` |
| `DLV - fbclid` | `fbclid` |
| `DLV - msclkid` | `msclkid` |
| `DLV - first_touch_source` | `first_touch_source` |
| `DLV - first_touch_medium` | `first_touch_medium` |
| `DLV - first_touch_campaign` | `first_touch_campaign` |
| `DLV - landing_page` | `landing_page` |
| `DLV - referrer` | `referrer` |

### Constants

| Variable Name in GTM | Type | Value |
|---|---|---|
| `CONST - GA4 Measurement ID` | Constant | `G-XXXXXXXXXX` (your GA4 ID) |
| `CONST - Tracklution Container ID` | Constant | `LS-XXXXXXXX-X` (from Tracklution dashboard) |
| `CONST - Tracklution Domain` | Constant | `tralut.holoalert.ca` (after DNS setup) |

---

## 6. GTM Triggers Setup

Create these **Custom Event Triggers**. Go to **Triggers → New → Custom Event**.

| Trigger Name | Event Name | Fires On |
|---|---|---|
| `CE - page_data` | `page_data` | All Custom Events |
| `CE - view_item` | `view_item` | All Custom Events |
| `CE - add_to_cart` | `add_to_cart` | All Custom Events |
| `CE - begin_checkout` | `begin_checkout` | All Custom Events |
| `CE - checkout_step` | `checkout_step` | All Custom Events |
| `CE - purchase` | `purchase` | All Custom Events |
| `CE - cart_abandoned` | `cart_abandoned` | All Custom Events |
| `CE - cta_clicked` | `cta_clicked` | All Custom Events |
| `CE - phone_click` | `phone_click` | All Custom Events |
| `CE - faq_click` | `faq_click` | All Custom Events |

---

## 7. GTM Tags Setup

### Tag 1: GA4 Configuration

| Setting | Value |
|---|---|
| **Tag Name** | `GA4 Config - Holo Alert` |
| **Tag Type** | Google Analytics: GA4 Configuration |
| **Measurement ID** | `{{CONST - GA4 Measurement ID}}` |
| **Trigger** | All Pages (built-in) |
| **Fields to Set** | `send_page_view` = `true` |

### Tag 2: GA4 Event — view_item

| Setting | Value |
|---|---|
| **Tag Name** | `GA4 Event - View Item` |
| **Tag Type** | Google Analytics: GA4 Event |
| **Configuration Tag** | `GA4 Config - Holo Alert` |
| **Event Name** | `view_item` |
| **Trigger** | `CE - view_item` |

**Event Parameters:**

| Parameter Name | Value |
|---|---|
| `device_name` | `{{DLV - device_name}}` |
| `device_slug` | `{{DLV - device_slug}}` |
| `currency` | `{{DLV - currency}}` |

### Tag 3: GA4 Event — add_to_cart

| Setting | Value |
|---|---|
| **Tag Name** | `GA4 Event - Add to Cart` |
| **Tag Type** | Google Analytics: GA4 Event |
| **Configuration Tag** | `GA4 Config - Holo Alert` |
| **Event Name** | `add_to_cart` |
| **Trigger** | `CE - add_to_cart` |

**Event Parameters:**

| Parameter Name | Value |
|---|---|
| `device_name` | `{{DLV - device_name}}` |
| `plan_type` | `{{DLV - plan_type}}` |
| `device_price` | `{{DLV - device_price}}` |
| `addons` | `{{DLV - addons}}` |
| `currency` | `{{DLV - currency}}` |
| `pages_before_cart` | `{{DLV - pages_before_cart}}` |
| `page_count_before_cart` | `{{DLV - page_count_before_cart}}` |
| `utm_source` | `{{DLV - utm_source}}` |
| `utm_medium` | `{{DLV - utm_medium}}` |
| `utm_campaign` | `{{DLV - utm_campaign}}` |
| `first_touch_source` | `{{DLV - first_touch_source}}` |
| `first_touch_medium` | `{{DLV - first_touch_medium}}` |
| `landing_page` | `{{DLV - landing_page}}` |
| `referrer` | `{{DLV - referrer}}` |

### Tag 4: GA4 Event — begin_checkout

| Setting | Value |
|---|---|
| **Tag Name** | `GA4 Event - Begin Checkout` |
| **Tag Type** | Google Analytics: GA4 Event |
| **Configuration Tag** | `GA4 Config - Holo Alert` |
| **Event Name** | `begin_checkout` |
| **Trigger** | `CE - begin_checkout` |

**Event Parameters:**

| Parameter Name | Value |
|---|---|
| `device_name` | `{{DLV - device_name}}` |
| `plan_type` | `{{DLV - plan_type}}` |
| `currency` | `{{DLV - currency}}` |

### Tag 5: GA4 Event — purchase (CONVERSION)

| Setting | Value |
|---|---|
| **Tag Name** | `GA4 Event - Purchase` |
| **Tag Type** | Google Analytics: GA4 Event |
| **Configuration Tag** | `GA4 Config - Holo Alert` |
| **Event Name** | `purchase` |
| **Trigger** | `CE - purchase` |

**Event Parameters:**

| Parameter Name | Value |
|---|---|
| `transaction_id` | `{{DLV - transaction_id}}` |
| `value` | `{{DLV - value}}` |
| `currency` | `{{DLV - currency}}` |
| `device_name` | `{{DLV - device_name}}` |
| `plan_type` | `{{DLV - plan_type}}` |
| `first_touch_source` | `{{DLV - first_touch_source}}` |
| `first_touch_medium` | `{{DLV - first_touch_medium}}` |
| `first_touch_campaign` | `{{DLV - first_touch_campaign}}` |
| `landing_page` | `{{DLV - landing_page}}` |
| `pages_before_purchase` | `{{DLV - pages_before_purchase}}` |
| `page_count_before_purchase` | `{{DLV - page_count_before_purchase}}` |

### Tag 6: GA4 Event — cart_abandoned

| Setting | Value |
|---|---|
| **Tag Name** | `GA4 Event - Cart Abandoned` |
| **Tag Type** | Google Analytics: GA4 Event |
| **Configuration Tag** | `GA4 Config - Holo Alert` |
| **Event Name** | `cart_abandoned` |
| **Trigger** | `CE - cart_abandoned` |

**Event Parameters:**

| Parameter Name | Value |
|---|---|
| `device_name` | `{{DLV - device_name}}` |
| `plan_type` | `{{DLV - plan_type}}` |
| `value` | `{{DLV - value}}` |
| `last_checkout_step` | `{{DLV - last_checkout_step}}` |
| `abandoned_minutes_ago` | `{{DLV - abandoned_minutes_ago}}` |

### Tag 7: GA4 Event — checkout_step

| Setting | Value |
|---|---|
| **Tag Name** | `GA4 Event - Checkout Step` |
| **Tag Type** | Google Analytics: GA4 Event |
| **Configuration Tag** | `GA4 Config - Holo Alert` |
| **Event Name** | `checkout_step` |
| **Trigger** | `CE - checkout_step` |

**Event Parameters:**

| Parameter Name | Value |
|---|---|
| `checkout_step` | `{{DLV - checkout_step}}` |
| `checkout_step_name` | `{{DLV - checkout_step_name}}` |
| `device_name` | `{{DLV - device_name}}` |
| `plan_type` | `{{DLV - plan_type}}` |

---

## 8. Tracklution Server-Side Setup

Tracklution replaces the need for a separate server-side GTM container. It handles server-side event delivery to Google Ads, Meta/Facebook, and other ad platforms.

### Step 1: Create Tracklution Account

1. Go to [tracklution.com](https://www.tracklution.com) and create an account
2. Add your website: `holoalert.ca`
3. From the **Installation** tab, copy:
   - **Container ID** (format: `LS-12345678-9`)
   - **Tracklution Domain** (format: `tralut.holoalert.ca`)

### Step 2: Set Up DNS CNAME (First-Party Cookies)

This is **critical** for accurate tracking. It lets Tracklution set first-party cookies under your domain, bypassing ad blockers and ITP restrictions.

1. Go to your DNS provider (where holoalert.ca DNS is managed)
2. Add a **CNAME record**:
   - **Name/Host**: `tralut`
   - **Value/Target**: The CNAME target provided by Tracklution (shown in your dashboard)
   - **TTL**: 3600 (or Auto)
3. Wait for DNS propagation (up to 48 hours, usually faster)
4. Verify in the Tracklution dashboard that the CNAME is active

> **Note:** Some DNS providers need `tralut.holoalert.ca` as the full hostname — try both formats if one doesn't work.

### Step 3: Install Tracklution GTM Template

1. In your GTM container (GTM-N2J4XSL), go to **Templates**
2. Click **Search Gallery** under Tag Templates
3. Search for **"Tracklution"**
4. Select the official template (look for the verified checkmark)
5. Click **Add to Workspace**

### Step 4: Create Tracklution PageView Tag

| Setting | Value |
|---|---|
| **Tag Name** | `Tracklution - PageView` |
| **Tag Type** | Tracklution |
| **Container ID** | `{{CONST - Tracklution Container ID}}` |
| **Tracklution Domain** | `{{CONST - Tracklution Domain}}` |
| **Event** | `PageView` |
| **Configuration** | `Automatic (default)` |
| **Trigger** | All Pages |

### Step 5: Create Tracklution Event Tags

Create one Tracklution tag per event:

#### Tracklution — AddToCart

| Setting | Value |
|---|---|
| **Tag Name** | `Tracklution - AddToCart` |
| **Event** | `AddToCart` |
| **Container ID** | `{{CONST - Tracklution Container ID}}` |
| **Tracklution Domain** | `{{CONST - Tracklution Domain}}` |
| **Trigger** | `CE - add_to_cart` |

**Custom Parameters:**

| Key | Value |
|---|---|
| `item_name` | `{{DLV - device_name}}` |
| `item_variant` | `{{DLV - plan_type}}` |
| `currency` | `{{DLV - currency}}` |

#### Tracklution — InitiateCheckout

| Setting | Value |
|---|---|
| **Tag Name** | `Tracklution - InitiateCheckout` |
| **Event** | `InitiateCheckout` |
| **Trigger** | `CE - begin_checkout` |

**Custom Parameters:**

| Key | Value |
|---|---|
| `item_name` | `{{DLV - device_name}}` |
| `item_variant` | `{{DLV - plan_type}}` |
| `currency` | `{{DLV - currency}}` |

#### Tracklution — Purchase

| Setting | Value |
|---|---|
| **Tag Name** | `Tracklution - Purchase` |
| **Event** | `Purchase` |
| **Trigger** | `CE - purchase` |

**Custom Parameters:**

| Key | Value |
|---|---|
| `value` | `{{DLV - value}}` |
| `currency` | `{{DLV - currency}}` |
| `transaction_id` | `{{DLV - transaction_id}}` |
| `item_name` | `{{DLV - device_name}}` |
| `item_variant` | `{{DLV - plan_type}}` |

#### Tracklution — ViewContent

| Setting | Value |
|---|---|
| **Tag Name** | `Tracklution - ViewContent` |
| **Event** | `ViewContent` |
| **Trigger** | `CE - view_item` |

**Custom Parameters:**

| Key | Value |
|---|---|
| `item_name` | `{{DLV - device_name}}` |
| `currency` | `{{DLV - currency}}` |

---

## 9. Tracklution Connectors

After the Tracklution tags are set up and firing, configure **Connectors** in the Tracklution dashboard to send data server-side to ad platforms.

### Google Ads Connector

1. In Tracklution dashboard → **Connectors** → **Google Ads**
2. Click **Add** and authorize with your Google Ads account
3. Enter your **Google Ads Customer ID**
4. Create conversion lists for:
   - **Purchase** (primary conversion for bidding)
   - **AddToCart** (secondary, for audience building)
   - **InitiateCheckout** (secondary)
5. Wait up to 6 hours for Google to prepare conversion lists
6. Tracklution sends **click conversions** (via GCLID) and **view-through conversions** automatically

> **Important:** For Google Ads conversions to work, the `gclid` parameter must be captured. The website already captures this from the URL and includes it in the `page_data` event.

### Meta / Facebook Ads Connector

1. In Tracklution dashboard → **Connectors** → **Meta Ads**
2. Authorize with your Meta Business account
3. Select your **Pixel ID**
4. Map events:
   - `ViewContent` → FB ViewContent
   - `AddToCart` → FB AddToCart
   - `InitiateCheckout` → FB InitiateCheckout
   - `Purchase` → FB Purchase
5. Tracklution handles the Conversions API (CAPI) server-side delivery

### GA4 Connector (Optional)

If you want Tracklution to also send events server-side to GA4 (for more accurate data):

1. In Tracklution dashboard → **Connectors** → **GA4**
2. Enter your GA4 Measurement ID and API Secret
3. Map events accordingly

---

## 10. Testing & Validation

### GTM Preview Mode

1. In GTM, click **Preview** (top right)
2. Enter your staging/production URL
3. The Tag Assistant panel opens — browse your site and verify:
   - `page_data` fires on every page
   - `view_item` fires on device pages (`/devices/holo-pro`, etc.)
   - `add_to_cart` fires when clicking "Continue to Checkout"
   - `begin_checkout` fires when progressing from step 2 to payment
   - `checkout_step` fires at each step transition
   - `purchase` fires on the success page

### GA4 DebugView

1. In GA4 → **Admin** → **DebugView**
2. Enable debug mode by installing the [GA Debugger Chrome extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
3. Browse your site and watch events appear in real-time

### Tracklution Dashboard

1. Log into [tracklution.com](https://tracklution.com)
2. Go to **Event Validation & Debugging**
3. Verify events are arriving with correct parameters
4. Check that connectors (Google Ads, Meta) show green status

### Validation Checklist

- [ ] `page_data` fires on homepage, device pages, blog, all marketing pages
- [ ] `view_item` fires once per device page load with correct device name
- [ ] `add_to_cart` fires with plan type, device name, addons, and attribution data
- [ ] `pages_before_cart` shows the correct page journey
- [ ] `begin_checkout` fires when user proceeds to payment (step 2 → 3)
- [ ] `checkout_step` fires for step 1 and step 2
- [ ] `purchase` fires on success page with transaction_id and value
- [ ] `purchase` value matches Stripe amount (in dollars, not cents)
- [ ] `cart_abandoned` fires on return visits with stale carts (>30 min)
- [ ] UTM parameters pass through correctly (test with `?utm_source=test&utm_medium=cpc`)
- [ ] First-touch attribution persists across sessions (check localStorage `ha_first_touch`)
- [ ] `gclid` / `fbclid` are captured from URL parameters
- [ ] Tracklution events appear in dashboard
- [ ] GA4 conversions marked for `purchase`, `begin_checkout`, `add_to_cart`

---

## 11. Conversion Tracking Summary

### What Gets Tracked

| User Action | Event | Where It Fires | Key Data |
|---|---|---|---|
| Visits any page | `page_data` | All pages | UTMs, attribution, click IDs |
| Views a device product page | `view_item` | `/devices/[slug]` | Device name, pricing |
| Clicks "Continue to Checkout" | `add_to_cart` | Product page | Device, plan, addons, page journey, attribution |
| Completes billing form | `checkout_step` (1) | `/checkout` | Step name, device |
| Completes alert info form | `checkout_step` (2) + `begin_checkout` | `/checkout` | Step name, device, plan |
| Completes payment | `purchase` | `/checkout/success` | Transaction ID, value, currency, full attribution |
| Returns with stale cart | `cart_abandoned` | Any page (on load) | Device, plan, last step, minutes since |

### Traffic Source Attribution

The system tracks where visitors come from at two levels:

1. **Session-level**: Current UTM parameters from the URL (e.g., `utm_source=google`)
2. **First-touch**: The very first visit source, stored permanently in localStorage — this persists across sessions so you can see which channel originally acquired the customer, even if they convert via a different channel later

### Pages Visited Before Add-to-Cart

The `add_to_cart` event includes `pages_before_cart` (a `>` delimited path like `/ > /devices/holo-pro`) and `page_count_before_cart`. This tells you:
- How many pages users visit before deciding to buy
- Which pages are most common in the conversion path
- Whether users come directly to product pages or browse first

### Abandoned Cart Detection

When a user adds to cart or begins checkout but doesn't complete the purchase within 30 minutes, the next page load fires a `cart_abandoned` event. This includes:
- Which device and plan they were considering
- How far they got in checkout (step 0 = just added to cart, step 1 = filled billing, step 2 = filled alert info)
- How long ago they abandoned

---

## Quick Reference: File Locations

| File | Purpose |
|---|---|
| `src/lib/analytics.ts` | All dataLayer event functions (centralized) |
| `src/components/AnalyticsPageTracker.tsx` | Page-level tracking + abandoned cart check |
| `src/components/product/ViewItemTracker.tsx` | `view_item` event on device pages |
| `src/components/product/ProductHeroSection.tsx` | `add_to_cart` event on plan selection |
| `src/app/(checkout)/checkout/CheckoutClient.tsx` | `begin_checkout` + `checkout_step` events |
| `src/app/(checkout)/checkout/success/SuccessTracking.tsx` | `purchase` event |
| `src/app/layout.tsx` | GTM script + AnalyticsPageTracker |
