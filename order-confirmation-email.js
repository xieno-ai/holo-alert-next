// Get input data - handle both direct execution and workflow execution
const inputData = $input.first()?.json;

// Debug: log what we received
console.log('Input data:', JSON.stringify(inputData, null, 2));

// If no input data, try to get from previous nodes
let data = inputData;
if (!data || !data.items) {
  // Try to get from Transform Order Data node if available
  try {
    data = $('Transform Order Data').first().json;
    console.log('Got data from Transform Order Data node');
  } catch (e) {
    console.log('Could not get data from Transform Order Data node');
  }
}

// Final safety check
if (!data || !data.items || !Array.isArray(data.items)) {
  throw new Error(`Missing or invalid items array. Received data structure: ${JSON.stringify(Object.keys(data || {}))}.\\n\\nPlease ensure either:\\n1. Execute the workflow from the beginning, OR\\n2. The Transform Order Data node has been executed successfully`);
}

console.log('Processing order with', data.items.length, 'items');

// Generate items HTML
const itemsHtml = data.items.map(item => {
  const recurringText = item.isRecurring ? ` • Recurring ${item.interval}ly` : '';
  return `
    <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #e5e5e5;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="70%" valign="top">
            <h3 style="font-size:16px;font-weight:600;color:#171717;margin:0 0 4px 0;">${item.name || 'Unknown Item'}</h3>
            <p style="font-size:13px;color:#999;margin:0;">Qty: ${item.quantity || 1}${recurringText}</p>
          </td>
          <td width="30%" valign="top" align="right">
            <p style="font-size:16px;font-weight:600;color:#171717;margin:0;">${item.price || '0.00'}</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}).join('');

// Conditionally show discount row only if discount > 0
const discountHtml = parseFloat(data.discount) > 0
  ? `<tr><td style="color:#22c55e;font-size:14px;padding:4px 0;">Discount</td><td align="right" style="color:#22c55e;font-size:14px;">-${data.currency || 'CAD'} ${data.discount}</td></tr>`
  : '';

// Build complete email HTML
const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @media (prefers-color-scheme: dark) {
      .light-mode { background-color: #ffffff !important; }
      .light-mode * { color-scheme: light !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f5f5f5;">
  <div style="max-width:1200px;margin:0 auto;padding:40px 20px;">
    <div class="light-mode" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="padding:30px 40px;border-bottom:1px solid #e5e5e5;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td align="left">
              <img src="https://cdn.prod.website-files.com/672b54ea49d64a75bdb0a617/68e009b4c5ec759aa39404a0_HA%5BAlertSystem%5D_BLACK_PNG_STANDARD.png" alt="Holo Alert" style="height:35px;width:auto;">
            </td>
            <td align="right">
              <img src="https://cdn.prod.website-files.com/672b54ea49d64a75bdb0a617/678e08a45706dce6d65346cc_Holo-Primary-Logo%202.avif" alt="Holo Alert" style="height:40px;width:auto;">
            </td>
          </tr>
        </table>
      </div>

      <!-- Main Content -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <!-- Left Column -->
          <td width="50%" valign="top" style="padding:60px 40px;">
            <h1 style="font-size:42px;font-weight:700;color:#171717;margin:0 0 20px 0;">Thank you for your purchase!</h1>
            <p style="color:#666;font-size:15px;line-height:1.6;margin:0 0 40px 0;">We're excited to get your Holo Alert system to you. Here's what happens next:</p>

            <!-- What to Expect Next -->
            <div style="margin:0 0 40px 0;">
              <h2 style="font-size:20px;font-weight:700;color:#171717;margin:0 0 24px 0;">What to Expect</h2>

              <!-- Step 1: Order Received -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td width="48" valign="top" style="padding-right:16px;">
                    <div style="width:40px;height:40px;border-radius:50%;background:#4294d8;color:#fff;font-size:16px;font-weight:700;line-height:40px;text-align:center;">1</div>
                  </td>
                  <td valign="top">
                    <p style="font-size:15px;font-weight:600;color:#171717;margin:0 0 4px 0;">Order Received</p>
                    <p style="font-size:13px;color:#666;line-height:1.5;margin:0;">We've got your order and our team is on it. You'll receive a confirmation shortly.</p>
                  </td>
                </tr>
              </table>

              <!-- Step 2: Device Programming -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td width="48" valign="top" style="padding-right:16px;">
                    <div style="width:40px;height:40px;border-radius:50%;background:#4294d8;color:#fff;font-size:16px;font-weight:700;line-height:40px;text-align:center;">2</div>
                  </td>
                  <td valign="top">
                    <p style="font-size:15px;font-weight:600;color:#171717;margin:0 0 4px 0;">Device Programming</p>
                    <p style="font-size:13px;color:#666;line-height:1.5;margin:0;">Your device will be personally programmed and configured by our team to ensure it's ready to go right out of the box.</p>
                  </td>
                </tr>
              </table>

              <!-- Step 3: Shipped to You -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td width="48" valign="top" style="padding-right:16px;">
                    <div style="width:40px;height:40px;border-radius:50%;background:#4294d8;color:#fff;font-size:16px;font-weight:700;line-height:40px;text-align:center;">3</div>
                  </td>
                  <td valign="top">
                    <p style="font-size:15px;font-weight:600;color:#171717;margin:0 0 4px 0;">Shipped to You</p>
                    <p style="font-size:13px;color:#666;line-height:1.5;margin:0;">Once programmed, we'll ship your device and send you tracking information so you know exactly when to expect it.</p>
                  </td>
                </tr>
              </table>

              <!-- Step 4: Personal Setup Call -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48" valign="top" style="padding-right:16px;">
                    <div style="width:40px;height:40px;border-radius:50%;background:#4294d8;color:#fff;font-size:16px;font-weight:700;line-height:40px;text-align:center;">4</div>
                  </td>
                  <td valign="top">
                    <p style="font-size:15px;font-weight:600;color:#171717;margin:0 0 4px 0;">Personal Setup Call</p>
                    <p style="font-size:13px;color:#666;line-height:1.5;margin:0;">After your device arrives, we'll call you to walk through testing it together, answer any questions, and make sure everything is working perfectly.</p>
                  </td>
                </tr>
              </table>
            </div>

            <h2 style="font-size:20px;font-weight:700;color:#171717;margin:0 0 24px 0;">Shipping Address</h2>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:8px 0;font-weight:600;color:#171717;font-size:14px;">Name</td><td style="padding:8px 0;color:#666;font-size:14px;">${data.customerName || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;font-weight:600;color:#171717;font-size:14px;">Email</td><td style="padding:8px 0;color:#666;font-size:14px;">${data.customerEmail || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;font-weight:600;color:#171717;font-size:14px;">Phone</td><td style="padding:8px 0;color:#666;font-size:14px;">${data.customerPhone || 'N/A'}</td></tr>
              <tr><td style="padding:8px 0;font-weight:600;color:#171717;font-size:14px;">Address</td><td style="padding:8px 0;color:#666;font-size:14px;">${data.shippingAddress?.line1 || ''}</td></tr>
              <tr><td style="padding:8px 0;font-weight:600;color:#171717;font-size:14px;">City</td><td style="padding:8px 0;color:#666;font-size:14px;">${data.shippingAddress?.city || ''}</td></tr>
              <tr><td style="padding:8px 0;font-weight:600;color:#171717;font-size:14px;">Province</td><td style="padding:8px 0;color:#666;font-size:14px;">${data.shippingAddress?.state || ''}</td></tr>
              <tr><td style="padding:8px 0;font-weight:600;color:#171717;font-size:14px;">Postal Code</td><td style="padding:8px 0;color:#666;font-size:14px;">${data.shippingAddress?.postal_code || ''}</td></tr>
              <tr><td style="padding:8px 0;font-weight:600;color:#171717;font-size:14px;">Country</td><td style="padding:8px 0;color:#666;font-size:14px;">${data.shippingAddress?.country || ''}</td></tr>
            </table>

            <div style="margin-top:40px;text-align:center;">
              <a href="${data.emergencyContactFormUrl || 'https://ctqtg.share.hsforms.com/2to_vayK3R_uV9KcBgnvYoQ'}" style="background:#4294d8;color:#fff;padding:16px 48px;text-decoration:none;border-radius:50px;font-weight:600;font-size:15px;display:inline-block;margin-bottom:12px;">Add Emergency Contacts</a>
              <p style="color:#999;font-size:13px;margin:0;">Help us keep you safe by adding your emergency contacts</p>
            </div>

            <div style="margin-top:32px;padding:20px;background:#f8f9fa;border-radius:8px;border-left:4px solid #4294d8;">
              <p style="color:#171717;font-size:14px;font-weight:600;margin:0 0 8px 0;">Questions or concerns?</p>
              <p style="color:#666;font-size:14px;margin:0 0 4px 0;">Our support team is here to help.</p>
              <a href="mailto:support@holoalert.ca" style="color:#4294d8;font-size:14px;text-decoration:none;font-weight:600;">support@holoalert.ca</a>
            </div>
          </td>

          <!-- Right Column -->
          <td width="50%" valign="top" style="padding:60px 40px;background:#fafafa;">
            <h2 style="font-size:28px;font-weight:700;color:#171717;margin:0 0 32px 0;">Order Summary</h2>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td width="50%" style="padding-right:12px;">
                  <p style="color:#999;font-size:12px;margin:0 0 4px 0;text-transform:uppercase;">Date</p>
                  <p style="color:#171717;font-size:14px;font-weight:600;margin:0;">${data.orderDate ? new Date(data.orderDate).toLocaleDateString() : 'N/A'}</p>
                </td>
                <td width="50%" style="padding-left:12px;">
                  <p style="color:#999;font-size:12px;margin:0 0 4px 0;text-transform:uppercase;">Order Number</p>
                  <p style="color:#171717;font-size:14px;font-weight:600;margin:0;">${data.orderId || 'N/A'}</p>
                </td>
              </tr>
            </table>

            <div style="border-top:1px solid #e5e5e5;padding-top:24px;">
              ${itemsHtml}

              <div style="padding-top:16px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr><td style="color:#666;font-size:14px;padding:4px 0;">Subtotal</td><td align="right" style="color:#666;font-size:14px;">${data.currency || 'CAD'} ${data.subtotal || '0.00'}</td></tr>
                  ${discountHtml}
                  <tr><td style="color:#666;font-size:14px;padding:4px 0;">Shipping</td><td align="right" style="color:#666;font-size:14px;">${data.currency || 'CAD'} ${data.shipping || '0.00'}</td></tr>
                  <tr><td style="color:#666;font-size:14px;padding:4px 0 16px 0;">Tax</td><td align="right" style="color:#666;font-size:14px;">${data.currency || 'CAD'} ${data.tax || '0.00'}</td></tr>
                  <tr><td style="font-size:20px;font-weight:700;color:#171717;padding-top:16px;border-top:2px solid #171717;">Order Total</td><td align="right" style="font-size:24px;font-weight:700;color:#171717;padding-top:16px;border-top:2px solid #171717;">${data.currency || 'CAD'} ${data.total || '0.00'}</td></tr>
                </table>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <div style="background:#171717;padding:32px 40px;text-align:center;">
        <p style="color:#fff;font-size:13px;margin:0;">&copy; 2025 Holo Alert. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

console.log('Email HTML generated successfully');

return {
  json: {
    ...data,
    emailHtml: emailHtml
  }
};
