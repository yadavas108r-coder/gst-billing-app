// server/routes/invoices.js
const express = require('express');
const router = express.Router();
const { appendRow, getRange } = require('../utils/sheets');
const { htmlToPdfBuffer } = require('../utils/pdf');
const Joi = require('joi');

const invoiceSchema = Joi.object({
  invoiceNo: Joi.string().required(),
  date: Joi.string().required(),
  customerName: Joi.string().required(),
  placeOfSupply: Joi.string().allow(''),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().allow(''),
      hsn: Joi.string().allow(''),
      qty: Joi.number().required(),
      unitPrice: Joi.number().required(),
      discount: Joi.number().allow(0),
      taxRate: Joi.number().required(),
      taxableValue: Joi.number().optional(),
      cgst: Joi.number().optional(),
      sgst: Joi.number().optional(),
      igst: Joi.number().optional()
    })
  ),
  taxableTotal: Joi.number(),
  totalCGST: Joi.number(),
  totalSGST: Joi.number(),
  totalIGST: Joi.number(),
  grandTotal: Joi.number(),
  notes: Joi.string().allow('')
});

router.post('/', async (req, res) => {
  const { error, value } = invoiceSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  try {
    const { invoiceNo, date, customerName, placeOfSupply, items, taxableTotal, totalCGST, totalSGST, totalIGST, grandTotal, notes } = value;
    await appendRow('Invoices!A:J', [invoiceNo, date, customerName, placeOfSupply, taxableTotal, totalCGST, totalSGST, totalIGST, grandTotal, notes]);
    if (Array.isArray(items)) {
      for (const it of items) {
        await appendRow('InvoiceItems!A:K', [invoiceNo, it.description || '', it.hsn || '', it.qty, it.unitPrice, it.discount || 0, it.taxRate, it.taxableValue || 0, it.cgst || 0, it.sgst || 0, it.igst || 0]);
      }
    }
    res.json({ message: 'Invoice saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save invoice' });
  }
});

router.get('/', async (req, res) => {
  try {
    const rows = await getRange('Invoices!A:J');
    if (rows.length <= 1) return res.json([]);
    const list = rows.slice(1).map(r => ({
      invoiceNo: r[0] || '',
      date: r[1] || '',
      customerName: r[2] || '',
      placeOfSupply: r[3] || '',
      taxableTotal: Number(r[4] || 0),
      totalCGST: Number(r[5] || 0),
      totalSGST: Number(r[6] || 0),
      totalIGST: Number(r[7] || 0),
      grandTotal: Number(r[8] || 0),
      notes: r[9] || ''
    }));
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Generate PDF server-side: expects { html, pageSize }
router.post('/pdf', async (req, res) => {
  const { html, pageSize } = req.body;
  if (!html) return res.status(400).json({ error: 'Missing html' });
  try {
    const buf = await htmlToPdfBuffer(html, pageSize || 'A4');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"');
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

module.exports = router;
