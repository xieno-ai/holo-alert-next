'use client'

import { useRef, useCallback } from 'react'

/* ── Types ────────────────────────────────────────────────────────────────── */

interface AddressComponents {
  line1: string
  city: string
  province: string // 2-letter code (e.g. "ON")
  postal: string
}

interface UseGooglePlacesAutocompleteOptions {
  /** Called when the user picks an address from the dropdown */
  onSelect: (address: AddressComponents) => void
  /** Restrict to specific country (default: "ca") */
  country?: string
}

/* ── Script loader (singleton) ────────────────────────────────────────────── */

let scriptPromise: Promise<void> | null = null

function loadGooglePlacesScript(): Promise<void> {
  if (scriptPromise) return scriptPromise

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    console.warn('[Google Places] NEXT_PUBLIC_GOOGLE_PLACES_API_KEY is not set — autocomplete disabled.')
    return Promise.reject(new Error('Missing API key'))
  }

  scriptPromise = new Promise((resolve, reject) => {
    // Already loaded?
    if (typeof google !== 'undefined' && google.maps?.places) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Failed to load Google Places script'))
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

/* ── Province mapping ─────────────────────────────────────────────────────── */

const PROVINCE_MAP: Record<string, string> = {
  Alberta: 'AB', 'British Columbia': 'BC', Manitoba: 'MB',
  'New Brunswick': 'NB', 'Newfoundland and Labrador': 'NL', 'Nova Scotia': 'NS',
  'Northwest Territories': 'NT', Nunavut: 'NU', Ontario: 'ON',
  'Prince Edward Island': 'PE', Quebec: 'QC', Saskatchewan: 'SK', Yukon: 'YT',
}

/* ── Hook ─────────────────────────────────────────────────────────────────── */

export function useGooglePlacesAutocomplete({
  onSelect,
  country = 'ca',
}: UseGooglePlacesAutocompleteOptions) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const listenerRef = useRef<google.maps.MapsEventListener | null>(null)
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  // Callback ref — fires every time the input mounts/unmounts in the DOM.
  // This handles conditionally-rendered inputs (e.g. behind a checkbox).
  const attachRef = useCallback(
    (node: HTMLInputElement | null) => {
      // Cleanup previous instance when input unmounts or swaps
      if (listenerRef.current) {
        google.maps.event.removeListener(listenerRef.current)
        listenerRef.current = null
      }
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }

      if (!node) return

      loadGooglePlacesScript()
        .then(() => {
          // Guard: input may have unmounted while script was loading
          if (!node.isConnected) return

          const ac = new google.maps.places.Autocomplete(node, {
            types: ['address'],
            componentRestrictions: { country },
            fields: ['address_components'],
          })

          autocompleteRef.current = ac

          listenerRef.current = ac.addListener('place_changed', () => {
            const place = ac.getPlace()
            if (!place.address_components) return

            const get = (type: string) =>
              place.address_components!.find((c) => c.types.includes(type))

            const streetNumber = get('street_number')?.long_name ?? ''
            const route = get('route')?.long_name ?? ''
            const city =
              get('locality')?.long_name ??
              get('sublocality_level_1')?.long_name ??
              ''
            const provinceName =
              get('administrative_area_level_1')?.long_name ?? ''
            const postal = get('postal_code')?.long_name ?? ''

            const line1 = streetNumber ? `${streetNumber} ${route}` : route

            onSelectRef.current({
              line1,
              city,
              province: PROVINCE_MAP[provinceName] ?? provinceName,
              postal,
            })
          })
        })
        .catch(() => {
          // Silently degrade — fields remain fully manual
        })
    },
    [country],
  )

  return { attachRef }
}
