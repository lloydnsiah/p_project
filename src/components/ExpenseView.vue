<template>
  <main>
    <div class="receipt-container">
      <div class="header">
        <img
          src="https://zapier-images.imgix.net/storage/developer_cli/6f3096e904d8168587ad67f1219f2c0e.png"
          alt="Logo"
          class="logo"
        />
        <h1 class="receipt-title">RECEIPT</h1>
        <p class="receipt-number">Receipt #RCP-001</p>
        <p class="receipt-number">2025-01-14 at 14:30</p>
      </div>

      <div class="info-section">
        <div class="info-block">
          <h3>From</h3>
          <p><strong>Your Store Name</strong></p>
          <p>123 Business Street<br />City, State 12345</p>
          <p>+1 (555) 123-4567</p>
          <p>info@yourstore.com</p>
        </div>
        <div class="info-block">
          <h3>To</h3>
          <p><strong>John Doe</strong></p>
          <p>john@example.com</p>
          <p>Order: ORD-12345</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: center">Qty</th>
            <th style="text-align: right">Price</th>
            <th style="text-align: right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb">
              Product A
            </td>
            <td
              style="
                padding: 8px;
                border-bottom: 1px solid #e5e7eb;
                text-align: center;
              "
            >
              2
            </td>
            <td
              style="
                padding: 8px;
                border-bottom: 1px solid #e5e7eb;
                text-align: right;
              "
            >
              $25.00
            </td>
            <td
              style="
                padding: 8px;
                border-bottom: 1px solid #e5e7eb;
                text-align: right;
              "
            >
              $50.00
            </td>
          </tr>

          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #e5e7eb">
              Product B
            </td>
            <td
              style="
                padding: 8px;
                border-bottom: 1px solid #e5e7eb;
                text-align: center;
              "
            >
              1
            </td>
            <td
              style="
                padding: 8px;
                border-bottom: 1px solid #e5e7eb;
                text-align: right;
              "
            >
              $35.00
            </td>
            <td
              style="
                padding: 8px;
                border-bottom: 1px solid #e5e7eb;
                text-align: right;
              "
            >
              $35.00
            </td>
          </tr>
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>Subtotal</span>
          <span>$85.00</span>
        </div>
        <div class="total-row">
          <span>Tax (8.5%)</span>
          <span>$7.23</span>
        </div>
        <div class="total-row">
          <span>Shipping</span>
          <span>$10.00</span>
        </div>
        <div class="total-row grand-total">
          <span>Total Paid</span>
          <span>$102.22</span>
        </div>
      </div>

      <div class="payment-info">
        <strong>Payment Method:</strong> Visa ending in 4242
      </div>

      <div class="footer">
        <p>Thank you for your purchase!</p>
        <p style="margin-top: 12px; font-size: 12px">
          Questions? Contact us at info@yourstore.com
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
@page { margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 25px;
      color: #1f2937;
    }
    .receipt-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
    }
    .header {
      text-align: center;
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e5e7eb;
    }
    .logo {
      max-width: 100px;
      margin-bottom: 12px;
    }
    .receipt-title {
      font-size: 28px;
      font-weight: bold;
      color: #111827;
      margin: 0;
    }
    .receipt-number {
      font-size: 13px;
      color: #6b7280;
      margin-top: 6px;
    }
    .info-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .info-block {
      flex: 1;
    }
    .info-block h3 {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: #6b7280;
      margin: 0 0 6px 0;
    }
    .info-block p {
      margin: 3px 0;
      font-size: 13px;
      line-height: 1.4;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #f9fafb;
      padding: 10px 6px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: #6b7280;
      border-bottom: 2px solid #e5e7eb;
    }
    th:nth-child(2), th:nth-child(3), th:nth-child(4) {
      text-align: right;
    }
    td {
      padding: 8px 6px;
      font-size: 13px;
    }
    .totals {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 2px solid #e5e7eb;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
    }
    .total-row.grand-total {
      font-size: 16px;
      font-weight: bold;
      padding-top: 10px;
      border-top: 2px solid #e5e7eb;
      margin-top: 6px;
    }
    .footer {
      margin-top: 25px;
      padding-top: 15px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .payment-info {
      background: #f9fafb;
      padding: 12px;
      border-radius: 8px;
      margin: 15px 0;
      font-size: 13px;
    }

</style>
