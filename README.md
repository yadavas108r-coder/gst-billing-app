# GST Billing App (Google Sheets as DB)

Complete starter project:
- Server: Node.js + Express + Google Sheets API + Puppeteer PDF + JWT auth
- Client: React + Vite
- Sheets used as "database": Company, Customers, Products, Invoices, InvoiceItems

## Setup

1. Create Google Cloud project, enable Google Sheets API.
2. Create Service Account, download JSON -> put in server/service-account.json.
3. Share your Google Sheet with the Service Account email (Editor).
4. Create tabs with headers:
   - Company: Name,Address,GSTIN,PAN,State,Phone,Email,PlaceOfSupply
   - Customers: Name,Address,GSTIN,State,Phone,Email
   - Products: Name,Description,HSN,UnitPrice,TaxRate
   - Invoices: InvoiceNo,Date,CustomerName,PlaceOfSupply,TaxableTotal,TotalCGST,TotalSGST,TotalIGST,GrandTotal,Notes
   - InvoiceItems: InvoiceNo,Description,HSN,Qty,UnitPrice,Discount,TaxRate,TaxableValue,CGST,SGST,IGST

5. In `server` folder, create `.env` from `.env.example` and fill values.
6. Install & run:
   - Server: `cd server` -> `npm install` -> `npm start`
   - Client: `cd client` -> `npm install` -> `npm run dev`

## Notes
- Keep service-account.json & .env private.
- For production, secure auth, and consider using a real DB for high concurrency.
