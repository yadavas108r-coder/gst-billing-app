import React, { useEffect, useState } from 'react';

export default function Company() {
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', gstin: '', pan: '', state: '', phone: '', email: '', placeOfSupply: '' });

  useEffect(() => {
    fetch('/api/company').then(r => r.json()).then(j => { if (j) { setCompany(j); setForm(j); } });
  }, []);

  async function save(e) {
    e.preventDefault();
    // Admin auth required: get token from localStorage (if set)
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch('/api/company', { method: 'POST', headers, body: JSON.stringify(form) });
    const j = await res.json();
    alert(j.message || j.error);
  }

  return (
    <div>
      <h2>Company</h2>
      <form onSubmit={save}>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" required />
        <input value={form.gstin} onChange={e => setForm({ ...form, gstin: e.target.value })} placeholder="GSTIN" />
        <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="State" />
        <input value={form.placeOfSupply} onChange={e => setForm({ ...form, placeOfSupply: e.target.value })} placeholder="Place of Supply" />
        <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Address" />
        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" />
        <button type="submit">Save Company (admin)</button>
      </form>
      <div style={{ marginTop: 12 }}>
        <small>Note: Company save requires admin token. Login via /api/auth/login to obtain token and set it in localStorage as 'token'.</small>
      </div>
    </div>
  );
}
