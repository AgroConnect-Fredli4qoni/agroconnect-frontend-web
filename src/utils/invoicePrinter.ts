import { Order } from '../types/order'

/**
 * formatRupiah formats a numeric value into standard Indonesian Rupiah notation.
 *
 * @param amount - Numeric currency value.
 * @returns Formatted Rupiah string.
 */
function formatRupiah(amount: number): string {
  return 'Rp ' + Number(amount || 0).toLocaleString('id-ID')
}

/**
 * formatInvoiceDate converts timestamp into Indonesian formal date time format.
 *
 * @param dateStr - Timestamp string.
 * @returns Formatted Indonesian date string.
 */
function formatInvoiceDate(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

/**
 * generateInvoiceHTML builds the standalone printable invoice HTML template.
 *
 * @param order - Order object containing transaction details.
 * @param sellerName - Optional farmer/seller representative name.
 * @returns Fully styled HTML document string.
 */
export function generateInvoiceHTML(order: Order, sellerName?: string): string {
  const currentDate = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const orderDate = formatInvoiceDate(order.created_at)
  const isPaid = order.status === 'PAID' || order.status === 'COMPLETED'
  const statusBadgeClass = isPaid
    ? 'badge-paid'
    : order.status === 'SHIPPED'
    ? 'badge-shipped'
    : order.status === 'CANCELLED'
    ? 'badge-cancelled'
    : 'badge-pending'

  const statusLabel =
    order.status === 'PAID'
      ? 'LUNAS (TERBAYAR)'
      : order.status === 'COMPLETED'
      ? 'SELESAI (LUNAS)'
      : order.status === 'SHIPPED'
      ? 'DALAM PENGIRIMAN'
      : order.status === 'CANCELLED'
      ? 'DIBATALKAN'
      : 'MENUNGGU PEMBAYARAN'

  const itemsRows = (order.items || [])
    .map((item, index) => {
      const price = Number(item.price || 0)
      const qty = Number(item.quantity || 1)
      const subtotal = Number(item.subtotal || price * qty)
      return `
      <tr>
        <td class="text-center">${index + 1}</td>
        <td><strong>${item.product_name}</strong></td>
        <td class="text-right">${formatRupiah(price)}</td>
        <td class="text-center"><strong>${qty} kg</strong></td>
        <td class="text-right text-emerald"><strong>${formatRupiah(subtotal)}</strong></td>
      </tr>
    `
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Faktur #${order.order_code || order.id} - AgroConnect</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 20mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.5;
      padding: 10px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #059669;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .brand h1 {
      font-size: 22px;
      font-weight: 900;
      color: #059669;
      letter-spacing: -0.5px;
    }
    .brand p {
      font-size: 10px;
      color: #64748b;
      margin-top: 2px;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h2 {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.5px;
    }
    .invoice-title p {
      font-size: 11px;
      font-family: monospace;
      font-weight: 700;
      color: #334155;
      margin-top: 2px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      font-size: 10px;
      font-weight: 800;
      border-radius: 4px;
      margin-top: 6px;
      letter-spacing: 0.5px;
    }
    .badge-paid {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #10b981;
    }
    .badge-pending {
      background: #fffbeb;
      color: #b45309;
      border: 1px solid #f59e0b;
    }
    .badge-shipped {
      background: #faf5ff;
      color: #7e22ce;
      border: 1px solid #a855f7;
    }
    .badge-cancelled {
      background: #fff1f2;
      color: #e11d48;
      border: 1px solid #f43f5e;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .info-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      background: #f8fafc;
    }
    .info-card h3 {
      font-size: 10px;
      font-weight: 800;
      color: #059669;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .info-row {
      margin-bottom: 4px;
    }
    .info-label {
      font-size: 10px;
      color: #64748b;
      display: inline-block;
      width: 100px;
    }
    .info-val {
      font-weight: 600;
      color: #0f172a;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-weight: 800;
      text-align: left;
      padding: 8px 10px;
      font-size: 10px;
      text-transform: uppercase;
      border-top: 1px solid #cbd5e1;
      border-bottom: 1px solid #cbd5e1;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 11px;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .text-emerald { color: #059669; }
    .summary-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 24px;
    }
    .summary-box {
      width: 260px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
    }
    .summary-line {
      display: flex;
      justify-content: space-between;
      padding: 6px 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 11px;
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      padding: 10px 12px;
      background: #ecfdf5;
      font-size: 12px;
      font-weight: 900;
      color: #047857;
      border-top: 1.5px solid #059669;
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 25px;
      page-break-inside: avoid;
    }
    .sig-col {
      text-align: center;
      padding: 10px;
    }
    .sig-space {
      height: 50px;
    }
    .sig-line {
      font-weight: 700;
      border-top: 1px solid #94a3b8;
      padding-top: 5px;
      font-size: 10px;
      display: inline-block;
      min-width: 160px;
    }
    .footer-stamp {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      font-size: 9px;
      color: #94a3b8;
      text-align: center;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <h1>AGROCONNECT</h1>
      <p>Platform Ekosistem Rantai Pasok Pertanian & Garansi Mutu Panen</p>
      <p>Kawasan Agribisnis Terpadu | support@agroconnect.id | www.agroconnect.id</p>
    </div>
    <div class="invoice-title">
      <h2>FAKTUR PENJUALAN</h2>
      <p>${order.order_code || `ORD-${order.id}`}</p>
      <span class="badge ${statusBadgeClass}">${statusLabel}</span>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-card">
      <h3>Informasi Penerima / Pembeli</h3>
      <div class="info-row">
        <span class="info-label">Nama Pemesan</span>: <span class="info-val">${order.customer_name || 'Pelanggan AgroConnect'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email Kontak</span>: <span class="info-val">${order.customer_email || '-'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Alamat Kirim</span>: <span class="info-val">${order.shipping_address || 'Alamat tujuan tidak dicantumkan'}</span>
      </div>
    </div>

    <div class="info-card">
      <h3>Informasi Transaksi & Penyedia</h3>
      <div class="info-row">
        <span class="info-label">Mitra Petani</span>: <span class="info-val">${sellerName || 'Mitra Petani Terverifikasi'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Waktu Pesanan</span>: <span class="info-val">${orderDate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Waktu Cetak</span>: <span class="info-val">${currentDate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Metode Bayar</span>: <span class="info-val">Midtrans Payment / AgroConnect Escrow</span>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="text-center" style="width: 35px;">No</th>
        <th>Komoditas Panen</th>
        <th class="text-right">Harga Satuan</th>
        <th class="text-center">Kuantitas</th>
        <th class="text-right">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows || '<tr><td colspan="5" class="text-center">Tidak ada item transaksi</td></tr>'}
    </tbody>
  </table>

  <div class="summary-wrapper">
    <div class="summary-box">
      <div class="summary-line">
        <span>Subtotal Komoditas</span>
        <span><strong>${formatRupiah(order.total_amount)}</strong></span>
      </div>
      <div class="summary-line">
        <span>Biaya Penanganan / Escrow</span>
        <span><strong>Rp 0 (Gratis)</strong></span>
      </div>
      <div class="summary-line">
        <span>Biaya Pengiriman Panen</span>
        <span><strong>Rp 0 (Promo Rantai Pasok)</strong></span>
      </div>
      <div class="summary-total">
        <span>TOTAL PEMBAYARAN</span>
        <span>${formatRupiah(order.total_amount)}</span>
      </div>
    </div>
  </div>

  <div class="signatures">
    <div class="sig-col">
      <p style="font-size: 10px; color: #64748b; margin-bottom: 6px;">Mitra Petani / Pengirim:</p>
      <div class="sig-space"></div>
      <span class="sig-line">${sellerName || 'Mitra Petani Terverifikasi'}</span>
    </div>
    <div class="sig-col">
      <p style="font-size: 10px; color: #64748b; margin-bottom: 6px;">Pembeli / Penerima Hasil Panen:</p>
      <div class="sig-space"></div>
      <span class="sig-line">${order.customer_name || 'Penerima Barang'}</span>
    </div>
  </div>

  <div class="footer-stamp">
    <p>Faktur ini diterbitkan secara otomatis dan sah secara hukum melalui platform digital AgroConnect.</p>
    <p>Dana transaksi dilindungi oleh sistem Rekening Bersama (Escrow) AgroConnect hingga mutu komoditas diterima dengan baik.</p>
  </div>
</body>
</html>`
}

/**
 * printOrderInvoice renders and opens the official print dialog using a clean isolated iframe.
 *
 * @param order - Target Order record to format and print.
 * @param sellerName - Optional farmer or store name.
 */
export function printOrderInvoice(order: Order, sellerName?: string): void {
  const invoiceHtml = generateInvoiceHTML(order, sellerName)

  const printFrame = document.createElement('iframe')
  printFrame.style.position = 'fixed'
  printFrame.style.right = '0'
  printFrame.style.bottom = '0'
  printFrame.style.width = '0'
  printFrame.style.height = '0'
  printFrame.style.border = '0'
  printFrame.style.visibility = 'hidden'

  document.body.appendChild(printFrame)

  const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document
  if (!frameDoc) {
    window.print()
    return
  }

  frameDoc.open()
  frameDoc.write(invoiceHtml)
  frameDoc.close()

  setTimeout(() => {
    try {
      printFrame.contentWindow?.focus()
      printFrame.contentWindow?.print()
    } catch {
      window.print()
    } finally {
      setTimeout(() => {
        try {
          document.body.removeChild(printFrame)
        } catch {
          void 0
        }
      }, 3000)
    }
  }, 350)
}
