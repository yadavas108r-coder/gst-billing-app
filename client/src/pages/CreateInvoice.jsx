import React, { useEffect, useState } from 'react';
import InvoicePreview from '../components/InvoicePreview';

export default function CreateInvoice() {
  const [customers, setCustomers] = useState([]);
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ description: '', hsn: '', qty: 1, unitPrice: 0, discount: 0, taxRate: 18 }]);
  const [invoiceNo, setInvoiceNo] = useState('INV-1');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [customer, setCustomer] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [pageSize, setPageSize] = useState('A4');

  useEffect(() => {
    fetch('/api/customers').then(r => r.json()).then(setCustomers);
    fetch('/api/company').then(r => r.json()).then(j => { if (j) { setCompany(j); if (j.placeOfSupply) setPlaceOfSupply(j.placeOfSupply); } });
    fetch('/api/products').then(r => r.json()).then(setProducts);
  }, []);

  function updateItem(i, val) {
    const copy = [...items];
    copy[i] = { ...copy[i], ...val };
    // if product selected (by name) populate fields
    if (val.productName) {
      const p = products.find(x => x.name === val.productName);
      if (p) {
        copy[i].description = p.description || p.name;
        copy[i].hsn = p.hsn || '';
        copy[i].unitPrice = p.unitPrice || 0;
        copy[i].taxRate = p.taxRate || 0;
      }
    }
    setItems(copy);
  }
  function addItem() { setItems([...items, { description: '', hsn: '', qty: 1, unitPrice: 0, discount: 0, taxRate: 18 }]); }
  function removeItem(i) { const copy = [...items]; copy.splice(i, 1); setItems(copy); }

  function computeTotals() {
    const compState = company ? company.state : '';
    let taxable = 0, cgst = 0, sgst = 0, igst = 0;
    const intra = compState && placeOfSupply && compState.toLowerCase() === placeOfSupply.toLowerCase();
    const enriched = items.map(it => {
      const pre = Number(it.qty) * Number(it.unitPrice);
      const taxval = Math.round(pre * (1 - (Number(it.discount) || 0) / 100) * 100) / 100;
      taxable += taxval;
      if (intra) { const c = Math.round(taxval * (it.taxRate / 100 / 2) * 100) / 100; cgst += c; sgst += c; return { ...it, taxableValue: taxval, cgst: c, sgst: c, igst: 0 }; }
      else { const ig = Math.round(taxval * (it.taxRate / 100) * 100) / 100; igst += ig; return { ...it, taxableValue: taxval, cgst: 0, sgst: 0, igst: ig }; }
    });
    const grand = Math.round((taxable + cgst + sgst + igst) * 100) / 100;
    return { taxable, cgst, sgst, igst, grand, enriched };
  }

  async function saveInvoice() {
    const { taxable, cgst, sgst, igst, grand, enriched } = computeTotals();
    const body = { invoiceNo, date, customerName: customer, placeOfSupply, items: enriched, taxableTotal: taxable, totalCGST: cgst, totalSGST: sgst, totalIGST: igst, grandTotal: grand, notes: '' };
    const res = await fetch('/api/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await res.json();
    alert(j.message || j.error);
  }

  async function downloadPdf() {
    const { taxable, cgst, sgst, igst, grand, enriched } = computeTotals();
    const previewHTML = document.getElementById('invoice-preview').outerHTML;
    const res = await fetch('/api/invoices/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ html: previewHTML, pageSize }) });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = invoiceNo + '.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      const j = await res.json();
      alert(j.error || 'Failed');
    }
  }

  const totals = computeTotals();

  return (
    <div>
      <h2>Create Invoice</h2>
      <label>Invoice No: <input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} /></label>
      <label>Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
      <label>Customer:
        <select value={customer} onChange={e => setCustomer(e.target.value)}>
          <option value="">-- Select --</option>
          {customers.map((c, i) => <option key={i} value={c.name}>{c.name} {c.gstin ? ` - ${c.gstin}` : ''}</option>)}
        </select>
      </label>
      <label>Place of Supply: <input value={placeOfSupply} onChange={e => setPlaceOfSupply(e.target.value)} /></label>

      <h3>Items</h3>
      {items.map((it, i) => (
        <div key={i} className="item-row">
          <select onChange={e => updateItem(i, { productName: e.target.value })} >
            <option value="">-- select product --</option>
            {products.map((p, idx) => <option key={idx} value={p.name}>{p.name} — ₹{p.unitPrice}</option>)}
          </select>
          <input placeholder="Description" value={it.description} onChange={e => updateItem(i, { description: e.target.value })} />
          <input placeholder="HSN" value={it.hsn} onChange={e => updateItem(i, { hsn: e.target.value })} />
          <input type="number" placeholder="Qty" value={it.qty} onChange={e => updateItem(i, { qty: Number(e.target.value) })} />
          <input type="number" placeholder="Unit Price" value={it.unitPrice} onChange={e => updateItem(i, { unitPrice: Number(e.target.value) })} />
          <input type="number" placeholder="Discount %" value={it.discount} onChange={e => updateItem(i, { discount: Number(e.target.value) })} />
          <input type="number" placeholder="Tax %" value={it.taxRate} onChange={e => updateItem(i, { taxRate: Number(e.target.value) })} />
          <button onClick={() => removeItem(i)}>Remove</button>
        </div>
      ))}
      <button onClick={addItem}>Add Item</button>

      <div>
        <strong>Totals:</strong>
        <div>Taxable: ₹{totals.taxable.toFixed(2)} | CGST: ₹{totals.cgst.toFixed(2)} | SGST: ₹{totals.sgst.toFixed(2)} | IGST: ₹{totals.igst.toFixed(2)} | Grand: ₹{totals.grand.toFixed(2)}</div>
      </div>

      <label>Page size:
        <select value={pageSize} onChange={e => setPageSize(e.target.value)}>
          <option value="A4">A4</option>
          <option value="A5">A5</option>
          <option value="letter">Letter</option>
        </select>
      </label>

      <div style={{ marginTop: 12 }}>
        <button onClick={saveInvoice}>Save Invoice</button>
        <button onClick={downloadPdf}>Download PDF (server-side)</button>
      </div>

      <div id="invoice-preview">
        <InvoicePreview company={company} customer={customers.find(c => c.name === customer)} invoiceNo={invoiceNo} date={date} items={totals.enriched || items} totals={totals} />
      </div>
    </div>
  );
}
