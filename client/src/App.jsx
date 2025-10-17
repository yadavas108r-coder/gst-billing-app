import React, { useState } from 'react';
import Company from './pages/Company';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';

export default function App() {
  const [page, setPage] = useState('invoices');
  return (
    <div className="app">
      <header>
        <h1>GST Billing</h1>
        <nav>
          <button onClick={() => setPage('company')}>Company</button>
          <button onClick={() => setPage('customers')}>Customers</button>
          <button onClick={() => setPage('products')}>Products</button>
          <button onClick={() => setPage('create')}>Create Invoice</button>
          <button onClick={() => setPage('invoices')}>Invoices</button>
        </nav>
      </header>
      <main>
        {page === 'company' && <Company />}
        {page === 'customers' && <Customers />}
        {page === 'products' && <Products />}
        {page === 'create' && <CreateInvoice />}
        {page === 'invoices' && <Invoices />}
      </main>
    </div>
  );
}
