import React, { useEffect, useState } from 'react';

export default function Customers() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: '', address: '', gstin: '', state: '', phone: '', email: '' });

  useEffect(() => load(), []);

  async function load() {
    const r = await fetch('/api/customers');
    setList(await r.json());
  }

  async function save(e) {
    e.preventDefault();
    const r = await fetch('/api/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await r.json();
    alert(j.message || j.error);
    setForm({ name: '', address: '', gstin: '', state: '', phone: '', email: '' });
    load();
  }

  return (
    <div>
      <h2>Customers</h2>
      <form onSubmit={save}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
        <input placeholder="GSTIN" value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} />
        <textarea placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <button type="submit">Save</button>
      </form>

      <div>
        <h3>Saved</h3>
        {list.map((c, i) => <div key={i}>{c.name} — {c.state} {c.gstin ? ` — ${c.gstin}` : ''}</div>)}
      </div>
    </div>
  );
}
