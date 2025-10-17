// server/routes/customers.js
const express = require('express');
const router = express.Router();
const { appendRow, getRange } = require('../utils/sheets');
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().allow(''),
  gstin: Joi.string().allow(''),
  state: Joi.string().allow(''),
  phone: Joi.string().allow(''),
  email: Joi.string().email().allow('')
});

router.post('/', async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  try {
    await appendRow('Customers!A:F', [value.name, value.address, value.gstin, value.state, value.phone, value.email]);
    res.json({ message: 'Customer saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save customer' });
  }
});

router.get('/', async (req, res) => {
  try {
    const rows = await getRange('Customers!A:F');
    if (rows.length <= 1) return res.json([]);
    const data = rows.slice(1).map(r => ({
      name: r[0] || '',
      address: r[1] || '',
      gstin: r[2] || '',
      state: r[3] || '',
      phone: r[4] || '',
      email: r[5] || ''
    }));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

module.exports = router;
