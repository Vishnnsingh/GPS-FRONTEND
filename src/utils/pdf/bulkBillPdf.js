// Simple bulk invoice printer: renders a printable HTML in a new window and calls print
export function printBulkInvoices(invoices = [], options = {}) {
  const schoolName = options.schoolName || (import.meta.env.VITE_SCHOOL_NAME || 'GJ Public School')
  const schoolAddress = options.schoolAddress || (import.meta.env.VITE_SCHOOL_ADDRESS || 'School Address')

  const htmlParts = []
  htmlParts.push(`<!doctype html><html><head><meta charset="utf-8"><title>Bulk Invoices</title><style>body{font-family:Arial,Helvetica,sans-serif;color:#0f172a} .invoice{border:1px solid #ddd;padding:14px;margin:10px 0} .h{font-weight:700;font-size:16px} .muted{color:#6b7280;font-size:12px}</style></head><body>`)

  invoices.forEach(inv => {
    htmlParts.push(`<div class="invoice">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="h">${schoolName}</div>
          <div class="muted">${schoolAddress}</div>
        </div>
        <div style="text-align:right">
          <div class="muted">Invoice: ${inv.invoice_no}</div>
          <div class="muted">Date: ${inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('en-IN') : ''}</div>
        </div>
      </div>
      <hr style="margin:8px 0" />
      <div style="display:flex;justify-content:space-between">
        <div>
          <div style="font-weight:700">${inv.student?.name || '-'}</div>
          <div class="muted">Class ${inv.student?.class || inv.class} • Section ${inv.student?.section || '-'}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">₹${inv.amount}</div>
          <div class="muted">${inv.status}</div>
        </div>
      </div>
    </div>`)
  })

  htmlParts.push(`<script>window.onload = function(){ setTimeout(()=>{ window.print(); }, 300) }</script></body></html>`)

  const win = window.open('', '_blank')
  if (!win) return false
  win.document.write(htmlParts.join(''))
  win.document.close()
  return true
}
