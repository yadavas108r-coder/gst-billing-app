// server/routes/company.js
const express = require('express');
const router = express.Router();
const { appendRow, getRange } = require('../utils/sheets');
const auth = require('../middleware/auth');

// Save company (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { name, address, gstin, pan, state, phone, email, placeOfSupply } = req.body;
    // For simplicity: append. You can replace logic to overwrite the first data row if needed.
    await appendRow('Company!A:H', [name || '', address || '', gstin || '', pan || '', state || '', phone || '', email || '', placeOfSupply || '']);
    res.json({ message: 'Company saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save company' });
  }
});

// Get latest company (last appended)
router.get('/', async (req, res) => {
  try {
    const rows = await getRange('Company!A:H');
    if (rows.length <= 1) return res.json(null);
    const r = rows[rows.length - 1];
    const company = {
      name: r[0] || '',
      address: r[1] || '',
      gstin: r[2] || '',
      pan: r[3] || '',
      state: r[4] || '',
      phone: r[5] || '',
      email: r[6] || '',
      placeOfSupply: r[7] || ''
    };
    res.json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

module.exports = router;
