import React, { useEffect, useState } from 'react';

export default function Invoices() {
  const [list, setList] = useState([]);
  useEffect(() => load(), []);
  async function load() {
    const r = await fetch('/api/invoices');
    setList(await r.json());
  }
  return (
    <div>
      <h2>Invoices</h2>
      {list.map((i, idx) => (
        <div key={idx} className="inv-row"><b>{i.invoiceNo}</b> {i.date} — {i.customerName} — ₹{i.grandTotal}</div>
      ))}
    </div>
  );
}
