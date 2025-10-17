import React from 'react';

export default function InvoicePreview({ company, customer, invoiceNo, date, items, totals }) {
  return (
    <div className="invoice">
      <h2>Invoice</h2>
      <div className="flex">
        <div>
          <strong>{company?.name || 'Your Company'}</strong>
          <div>{company?.address}</div>
          <div>GSTIN: {company?.gstin}</div>
        </div>
        <div>
          <div>Invoice: {invoiceNo}</div>
          <div>Date: {date}</div>
        </div>
      </div>

      <div>
        <strong>Bill To:</strong>
        <div>{customer?.name}</div>
        <div>{customer?.address}</div>
        <div>GSTIN: {customer?.gstin}</div>
      </div>

      <table className="inv-table">
        <thead>
          <tr><th>#</th><th>Description</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Taxable</th><th>Tax</th><th>Total</th></tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{it.description}</td>
              <td>{it.hsn}</td>
              <td>{it.qty}</td>
              <td>{it.unitPrice}</td>
              <td>{(it.taxableValue || 0).toFixed(2)}</td>
              <td>{(((it.cgst || 0) + (it.sgst || 0) + (it.igst || 0))).toFixed(2)}</td>
              <td>{(((it.taxableValue || 0) + (it.cgst || 0) + (it.sgst || 0) + (it.igst || 0))).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totals">
        <div>Taxable Total: ₹{totals.taxable.toFixed(2)}</div>
        <div>CGST: ₹{totals.cgst.toFixed(2)}</div>
        <div>SGST: ₹{totals.sgst.toFixed(2)}</div>
        <div>IGST: ₹{totals.igst.toFixed(2)}</div>
        <div><strong>Grand Total: ₹{totals.grand.toFixed(2)}</strong></div>
      </div>
    </div>
  );
}
