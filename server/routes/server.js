// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const invoiceRoutes = require('./routes/invoices');

app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);

// Basic root
app.get('/', (req, res) => res.send('GST Billing Server is up'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
