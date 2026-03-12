/**
 * ShipStation V2 API integration for creating orders after Stripe payment.
 *
 * Environment variables required:
 *   SHIPSTATION_API_KEY — your ShipStation API key
 *
 * Docs: https://docs.shipstation.com
 */

const SHIPSTATION_BASE = 'https://api.shipstation.com/v2'

function getApiKey(): string {
  const key = process.env.SHIPSTATION_API_KEY
  if (!key) throw new Error('Missing SHIPSTATION_API_KEY')
  return key
}

// ---------------------------------------------------------------------------
// Address parsing — shipping metadata is stored as:
//   "123 Main St Unit 4, Toronto, ON M5V 1A1, Canada"
// ---------------------------------------------------------------------------

interface ShipStationAddress {
  name: string
  phone: string
  address_line1: string
  address_line2?: string
  city_locality: string
  state_province: string
  postal_code: string
  country_code: string
  address_residential_indicator: 'yes' | 'no' | 'unknown'
}

/**
 * Parse the flat shipping string from Stripe metadata into ShipStation V2 address fields.
 *
 * Expected format: "street, city, province postal, country"
 */
export function parseShippingAddress(
  raw: string,
  name: string,
  phone?: string,
): ShipStationAddress {
  const parts = raw.split(',').map(s => s.trim())

  if (parts.length >= 4) {
    const street = parts[0]
    const city = parts[1]
    // "ON M5V 1A1" — province + postal code
    const provincePostal = parts[2].trim()
    const spaceIdx = provincePostal.indexOf(' ')
    const state = spaceIdx > 0 ? provincePostal.slice(0, spaceIdx) : provincePostal
    const postalCode = spaceIdx > 0 ? provincePostal.slice(spaceIdx + 1) : ''
    const country = parts.slice(3).join(',').trim()

    return {
      name,
      phone: phone || '',
      address_line1: street,
      city_locality: city,
      state_province: state,
      postal_code: postalCode,
      country_code: mapCountryCode(country),
      address_residential_indicator: 'unknown',
    }
  }

  // Fallback: couldn't parse — put full string in address_line1
  return {
    name,
    phone: phone || '',
    address_line1: raw,
    city_locality: '',
    state_province: '',
    postal_code: '',
    country_code: 'CA',
    address_residential_indicator: 'unknown',
  }
}

function mapCountryCode(country: string): string {
  const lower = country.toLowerCase()
  if (lower === 'canada' || lower === 'ca') return 'CA'
  if (lower === 'united states' || lower === 'us' || lower === 'usa') return 'US'
  return 'CA'
}

// ---------------------------------------------------------------------------
// Order creation via V2 shipments endpoint
// ---------------------------------------------------------------------------

export interface ShipStationOrderItem {
  name: string
  quantity: number
  unitPrice: number
  sku?: string
}

export interface CreateShipStationOrderInput {
  /** Unique order identifier — we use the Stripe subscription ID */
  orderNumber: string
  customerEmail: string
  shipTo: ShipStationAddress
  items: ShipStationOrderItem[]
  amountPaid: number
  taxAmount: number
  /** Internal notes visible to warehouse staff */
  internalNotes?: string
  /** Warehouse ID — if set, used instead of ship_from */
  warehouseId?: string
}

interface ShipStationShipmentPayload {
  create_sales_order: boolean
  external_shipment_id: string
  validate_address: string
  ship_to: ShipStationAddress
  warehouse_id?: string
  items: {
    name: string
    quantity: number
    unit_price: number
    sku?: string
  }[]
  amount_paid: { currency: string; amount: number }
  tax_paid: { currency: string; amount: number }
  packages: { weight: { value: number; unit: string } }[]
}

interface ShipStationV2Response {
  has_errors: boolean
  shipments: {
    shipment_id: string
    shipment_status: string
    errors: string[]
  }[]
}

/**
 * Create an order in ShipStation (V2) so a shipping label can be purchased.
 * Uses the shipments endpoint with `create_sales_order: true` to make
 * the order visible in ShipStation's Orders tab.
 */
export async function createShipStationOrder(
  input: CreateShipStationOrderInput,
): Promise<{ shipmentId: string; orderNumber: string }> {
  const shipment: ShipStationShipmentPayload = {
    create_sales_order: true,
    external_shipment_id: input.orderNumber,
    validate_address: 'no_validation',
    ship_to: input.shipTo,
    items: input.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      ...(item.sku ? { sku: item.sku } : {}),
    })),
    amount_paid: { currency: 'cad', amount: input.amountPaid },
    tax_paid: { currency: 'cad', amount: input.taxAmount },
    // Placeholder weight — update in ShipStation when packing the device
    packages: [{ weight: { value: 1, unit: 'pound' } }],
  }

  const warehouseId = input.warehouseId || process.env.SHIPSTATION_WAREHOUSE_ID
  if (warehouseId) {
    shipment.warehouse_id = warehouseId
  }

  const res = await fetch(`${SHIPSTATION_BASE}/shipments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-Key': getApiKey(),
    },
    body: JSON.stringify({ shipments: [shipment] }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`ShipStation V2 API error ${res.status}: ${body}`)
  }

  const data = await res.json() as ShipStationV2Response

  if (data.has_errors || data.shipments[0]?.errors?.length > 0) {
    throw new Error(`ShipStation order errors: ${JSON.stringify(data.shipments[0]?.errors)}`)
  }

  return {
    shipmentId: data.shipments[0].shipment_id,
    orderNumber: input.orderNumber,
  }
}
