import React, { useEffect, useState } from 'react';

export default function Products() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', hsn: '', unitPrice: 0, taxRate: 18 });

  useEffect(() => load(), []);

  async function load() {
    const r = await fetch('/api/products');
    setList(await r.json());
  }

  async function save(e) {
    e.preventDefault();
    const r = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await r.json();
    alert(j.message || j.error);
    setForm({ name: '', description: '', hsn: '', unitPrice: 0, taxRate: 18 });
    load();
  }

  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={save}>
        <input placeholder="Product name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="HSN/SAC" value={form.hsn} onChange={e => setForm({ ...form, hsn: e.target.value })} />
        <input type="number" placeholder="Unit price" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: Number(e.target.value) })} />
        <input type="number" placeholder="Tax Rate %" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: Number(e.target.value) })} />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Save product</button>
      </form>

      <div>
        <h3>Saved Products</h3>
        {list.map((p, i) => <div key={i}>{p.name} — ₹{p.unitPrice} — {p.taxRate}% — {p.hsn}</div>)}
      </div>
    </div>
  );
}
