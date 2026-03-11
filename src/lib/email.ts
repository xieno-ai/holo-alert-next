import { Resend } from 'resend'

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY)
}

export interface OrderEmailData {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  deviceName: string
  plan: string
  orderDate: string
  subscriptionId: string
  items: { name: string; price: string; quantity: number; isRecurring: boolean; interval: string }[]
  subtotal: string
  discount: string
  tax: string
  total: string
  currency: string
}

function buildItemsHtml(items: OrderEmailData['items']): string {
  return items.map(item => {
    const recurringText = item.isRecurring ? ` &bull; ${item.interval}ly` : ''
    return `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #f2f2f2;">
        <p style="font-size:14px;font-weight:600;color:#171717;margin:0;">${item.name}</p>
        <p style="font-size:12px;color:#787878;margin:4px 0 0 0;">Qty: ${item.quantity}${recurringText}</p>
      </td>
      <td align="right" style="padding:10px 0;border-bottom:1px solid #f2f2f2;font-size:14px;font-weight:600;color:#171717;">${item.price}</td>
    </tr>`
  }).join('')
}

function formatShippingBlock(name: string, address: string): string {
  // address is "123 Main St, Toronto, ON M5V 1A1, Canada"
  const parts = address.split(',').map(p => p.trim())
  const lines = [name]
  if (parts.length >= 4) {
    lines.push(parts[0]) // street
    lines.push(`${parts[1]}, ${parts[2]}`) // city, province + postal
    lines.push(parts[3]) // country
  } else {
    lines.push(address)
  }
  return lines.map(l => `<span style="display:block;line-height:1.6;">${l}</span>`).join('')
}

function buildEmailHtml(data: OrderEmailData): string {
  const itemsHtml = buildItemsHtml(data.items)
  const shippingBlock = formatShippingBlock(data.customerName, data.shippingAddress)
  const orderDate = new Date(data.orderDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })

  const discountRow = parseFloat(data.discount) > 0
    ? `<tr><td style="padding:4px 0;font-size:13px;color:#45b864;">Discount</td><td align="right" style="padding:4px 0;font-size:13px;color:#45b864;">-$${data.discount}</td></tr>`
    : ''

  // Timeline step helper — no connecting line
  const step = (num: number, title: string, desc: string, isLast = false) => `
    <tr>
      <td width="46" valign="top" style="padding-right:14px;">
        <div style="width:32px;height:32px;border-radius:50%;background:#4294d8;color:#fff;font-size:13px;font-weight:700;line-height:32px;text-align:center;">${num}</div>
      </td>
      <td valign="top" style="padding-bottom:${isLast ? '0' : '18'}px;">
        <p style="font-size:14px;font-weight:600;color:#171717;margin:0 0 2px 0;line-height:32px;">${title}</p>
        <p style="font-size:13px;color:#787878;line-height:1.5;margin:0;">${desc}</p>
      </td>
    </tr>`

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media (prefers-color-scheme: dark) {
      .email-body { background-color: #ffffff !important; }
      .email-body * { color-scheme: light !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#f2f2f2;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px;">

    <!-- Card -->
    <div class="email-body" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

      <!-- Header -->
      <div style="padding:24px 32px;border-bottom:1px solid #f2f2f2;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left">
              <img src="https://cdn.prod.website-files.com/672b54ea49d64a75bdb0a617/68e009b4c5ec759aa39404a0_HA%5BAlertSystem%5D_BLACK_PNG_STANDARD.png" alt="Holo Alert" style="height:28px;width:auto;">
            </td>
            <td align="right" style="font-size:12px;color:#787878;">Order Confirmation</td>
          </tr>
        </table>
      </div>

      <!-- Greeting -->
      <div style="padding:32px 32px 0 32px;">
        <h1 style="font-size:24px;font-weight:700;color:#171717;margin:0 0 8px 0;letter-spacing:-0.3px;">Thank you, ${data.customerName.split(' ')[0]}!</h1>
        <p style="font-size:14px;color:#787878;line-height:1.5;margin:0;">Your order has been confirmed. Here's a summary and what to expect next.</p>
      </div>

      <!-- Shipping + Contact Info -->
      <div style="padding:24px 32px 0 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" valign="top">
              <p style="font-size:11px;color:#787878;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Ships To</p>
              <div style="font-size:13px;color:#171717;">${shippingBlock}</div>
            </td>
            <td width="50%" valign="top" style="padding-left:24px;">
              <p style="font-size:11px;color:#787878;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Contact</p>
              <div style="font-size:13px;color:#171717;line-height:1.6;">
                <span style="display:block;">${data.customerEmail}</span>
                <span style="display:block;">${data.customerPhone}</span>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Order Summary Box -->
      <div style="margin:24px 32px;background:#f9fafb;border-radius:6px;padding:20px 24px;border:1px solid #f2f2f2;">
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
          <tr>
            <td>
              <p style="font-size:11px;color:#787878;margin:0;text-transform:uppercase;letter-spacing:0.5px;">Date</p>
              <p style="font-size:13px;font-weight:600;color:#171717;margin:4px 0 0 0;">${orderDate}</p>
            </td>
            <td align="right">
              <p style="font-size:11px;color:#787878;margin:0;text-transform:uppercase;letter-spacing:0.5px;">Order #</p>
              <p style="font-size:13px;font-weight:600;color:#171717;margin:4px 0 0 0;">${data.subscriptionId.slice(-12)}</p>
            </td>
          </tr>
        </table>

        <div style="border-top:1px solid #e5e5e5;padding-top:12px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemsHtml}
          </table>
        </div>

        <div style="border-top:1px solid #e5e5e5;margin-top:8px;padding-top:8px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:3px 0;font-size:13px;color:#787878;">Subtotal</td><td align="right" style="padding:3px 0;font-size:13px;color:#787878;">$${data.subtotal}</td></tr>
            ${discountRow}
            <tr><td style="padding:3px 0;font-size:13px;color:#787878;">Tax</td><td align="right" style="padding:3px 0;font-size:13px;color:#787878;">$${data.tax}</td></tr>
          </table>
        </div>

        <div style="border-top:2px solid #171717;margin-top:8px;padding-top:10px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:15px;font-weight:700;color:#171717;">Total</td>
              <td align="right" style="font-size:18px;font-weight:700;color:#171717;">${data.currency} $${data.total}</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Divider -->
      <div style="margin:0 32px;border-top:1px solid #f2f2f2;"></div>

      <!-- What to Expect -->
      <div style="padding:24px 32px 0 32px;">
        <p style="font-size:11px;color:#4294d8;margin:0 0 16px 0;text-transform:uppercase;letter-spacing:1px;font-weight:600;">What to Expect</p>

        <table width="100%" cellpadding="0" cellspacing="0">
          ${step(1, 'Order Received', 'We\'ve got your order and our team is on it.')}
          ${step(2, 'Device Programming', 'Your device gets personally configured — ready to go out of the box.')}
          ${step(3, 'Shipped to You', 'We\'ll send you tracking info so you know exactly when to expect it.')}
          ${step(4, 'Personal Setup Call', 'After delivery, we\'ll call to walk through setup and testing together.', true)}
        </table>
      </div>

      <!-- CTA -->
      <div style="padding:28px 32px;text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/emergency-contacts" style="background:#f46036;color:#fff;padding:14px 40px;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;display:inline-block;">Add Emergency Contacts</a>
        <p style="color:#787878;font-size:12px;margin:10px 0 0 0;">Help us keep you safe — add contacts we can reach in an emergency</p>
      </div>

      <!-- Support Callout -->
      <div style="margin:0 32px 24px 32px;padding:16px 20px;background:#f9fafb;border-radius:6px;text-align:center;">
        <p style="font-size:13px;color:#171717;margin:0;"><strong>Need help?</strong> Reach us at <a href="mailto:support@holoalert.ca" style="color:#4294d8;text-decoration:none;font-weight:600;">support@holoalert.ca</a></p>
      </div>

      <!-- Footer -->
      <div style="background:#171717;padding:20px 32px;text-align:center;">
        <p style="color:#787878;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} Holo Alert. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const html = buildEmailHtml(data)

  const { error } = await getResendClient().emails.send({
    from: 'Holo Alert <orders@orders.holoalert.ca>',
    to: data.customerEmail,
    subject: `Order Confirmed — ${data.deviceName}`,
    html,
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}
