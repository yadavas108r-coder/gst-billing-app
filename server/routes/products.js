// server/routes/products.js
const express = require('express');
const router = express.Router();
const { appendRow, getRange } = require('../utils/sheets');
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  hsn: Joi.string().allow(''),
  unitPrice: Joi.number().required(),
  taxRate: Joi.number().required()
});

// Add product
router.post('/', async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  try {
    await appendRow('Products!A:E', [value.name, value.description || '', value.hsn || '', value.unitPrice, value.taxRate]);
    res.json({ message: 'Product saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save product' });
  }
});

// List products
router.get('/', async (req, res) => {
  try {
    const rows = await getRange('Products!A:E');
    if (rows.length <= 1) return res.json([]);
    const data = rows.slice(1).map(r => ({
      name: r[0] || '',
      description: r[1] || '',
      hsn: r[2] || '',
      unitPrice: Number(r[3] || 0),
      taxRate: Number(r[4] || 0)
    }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
